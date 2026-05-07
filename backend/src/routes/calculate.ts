import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { calculateSchema } from "../validators/schemas";
import { EFFICIENCY } from "../constants/efficiency";
import { CHAIN_REF, CHAIN_TABLE, CHAIN_POWER_TABLE, SAFETY_FACTOR_TABLE, CHAIN_USE_FACTORS, CONTACT_STRESS_ALLOW, ELASTIC_MODULUS } from "../constants/chainTables";
import { GEARBOX_RATIO_OPTIONS, PRELIM_UX, GearboxType } from "../constants/gearbox";

const router = Router();

/**
 * POST /api/calculate
 * Tính toán công suất và thông số động học cơ bản
 */
router.post("/", async (req, res: Response): Promise<void> => {
  try {
    const parsed = calculateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Dữ liệu không hợp lệ",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { F, v, D, t1, t2, T1_ratio, T2_ratio, uh, gearbox_type, tmm_t1_ratio } = parsed.data;

    // Công suất làm việc
    const Plv = (F * v) / 1000;

    // Công suất tương đương khi tải thay đổi
    const timeTotal = t1 + t2;
    const ratioSum = (t1 * Math.pow(T1_ratio, 2) + t2 * Math.pow(T2_ratio, 2)) / timeTotal;
    const Ptd = Plv * Math.sqrt(ratioSum);

    // Hiệu suất hệ thống
    const eta = EFFICIENCY.chain * Math.pow(EFFICIENCY.gear, 2) * Math.pow(EFFICIENCY.bearing, 4) * EFFICIENCY.coupling;

    // Công suất cần thiết
    const Pct = Ptd / eta;

    // Số vòng quay trục công tác
    const nlv = (60000 * v) / (Math.PI * D);

    // Tỷ số truyền sơ bộ và số vòng quay sơ bộ
    const usb = PRELIM_UX * uh;
    const nsb = nlv * usb;

    const resultBase = { Plv, Ptd, eta, Pct, nlv, usb, nsb };

    const hasInvalid = Object.values(resultBase).some((value) => !Number.isFinite(value));
    if (hasInvalid) {
      res.status(400).json({ error: "Kết quả tính toán không hợp lệ" });
      return;
    }

    // Đề xuất động cơ theo điều kiện công suất và tốc độ
    const candidates = await prisma.motorLibrary.findMany({
      where: { rated_power: { gte: Pct } },
    });

    let motor = null as (typeof candidates)[number] | null;
    if (candidates.length > 0) {
      motor = candidates[0];
      for (const current of candidates.slice(1)) {
        const bestSpeed = motor.rated_speed ?? Number.POSITIVE_INFINITY;
        const currentSpeed = current.rated_speed ?? Number.POSITIVE_INFINITY;
        const bestDiff = Math.abs(bestSpeed - nsb);
        const currentDiff = Math.abs(currentSpeed - nsb);

        if (currentDiff < bestDiff) {
          motor = current;
          continue;
        }

        if (currentDiff === bestDiff) {
          const bestPower = motor.rated_power ?? Number.POSITIVE_INFINITY;
          const currentPower = current.rated_power ?? Number.POSITIVE_INFINITY;
          if (currentPower < bestPower) {
            motor = current;
          }
        }
      }
    } else {
      motor = await prisma.motorLibrary.findFirst({
        orderBy: { rated_power: "desc" },
      });
    }

    const ut = motor?.rated_speed != null ? motor.rated_speed / nlv : null;
    const ut_expected = usb;
    const T_dc = motor?.rated_power != null && motor.rated_speed != null
      ? (9.55 * 1_000_000 * motor.rated_power) / motor.rated_speed
      : null;
    const overload_ok = motor?.tk_tdn != null ? motor.tk_tdn >= tmm_t1_ratio : null;

    const selectGearRatios = (ratio: number, type: GearboxType) => {
      const { u1Values, u2Values } = GEARBOX_RATIO_OPTIONS[type];
      let best = { u1: u1Values[0], u2: u2Values[0], diff: Number.POSITIVE_INFINITY };

      for (const u1 of u1Values) {
        for (const u2 of u2Values) {
          const diff = Math.abs(u1 * u2 - ratio);
          if (diff < best.diff) {
            best = { u1, u2, diff };
          }
        }
      }

      return best;
    };

    const gearChoice = selectGearRatios(uh, gearbox_type);
    const u1 = gearChoice.u1;
    const u2 = gearChoice.u2;
    const ux = ut != null ? ut / uh : null;
    if (ux == null || !Number.isFinite(ux) || ux <= 0) {
      res.status(400).json({ error: "Tỷ số truyền ux không hợp lệ" });
      return;
    }

    // Công suất trên các trục
    const P3 = Plv / (EFFICIENCY.chain * EFFICIENCY.bearing);
    const P2 = P3 / (EFFICIENCY.gear * EFFICIENCY.bearing);
    const P1 = P2 / (EFFICIENCY.gear * EFFICIENCY.bearing);
    const Pdc_prime = P1 / (EFFICIENCY.coupling * EFFICIENCY.bearing);

    // Số vòng quay trên các trục
    const n_dc = motor?.rated_speed ?? null;
    const n1 = n_dc != null ? n_dc / 1 : null;
    const n2 = n1 != null ? n1 / u1 : null;
    const n3 = n2 != null ? n2 / u2 : null;
    const n_lv_calc = n3 != null ? n3 / ux : null;

    // Momen xoắn
    const calcT = (p: number, n: number) => (9.55 * 1_000_000 * p) / n;
    const T_lv = calcT(Plv, nlv);
    const T1 = n1 != null ? calcT(P1, n1) : null;
    const T2 = n2 != null ? calcT(P2, n2) : null;
    const T3 = n3 != null ? calcT(P3, n3) : null;

    // Thiết kế bộ truyền xích
    const z1_calc = 29 - 2 * ux;
    const z1 = Math.max(15, Math.round(z1_calc));
    const z2 = Math.round(z1 * ux);

    const K = CHAIN_USE_FACTORS.k0 * CHAIN_USE_FACTORS.ka * CHAIN_USE_FACTORS.kdc * CHAIN_USE_FACTORS.kbt * CHAIN_USE_FACTORS.kd * CHAIN_USE_FACTORS.kc;
    const Kz = CHAIN_REF.z01 / z1;
    const Kn = CHAIN_REF.n01 / (n3 ?? CHAIN_REF.n01);
    const Pt = P3 * K * Kz * Kn;

    const powerRow = CHAIN_POWER_TABLE.find((row) => row.n01 === CHAIN_REF.n01) ?? CHAIN_POWER_TABLE[0];
    const powerIndex = powerRow.values.findIndex((value) => Pt <= value);
    const chainIndex = powerIndex === -1 ? CHAIN_TABLE.length - 1 : powerIndex;
    const selectedChain = CHAIN_TABLE[chainIndex];
    const p = selectedChain.p;

    const a_temp = 40 * p;
    const diff_z = z2 - z1;
    const xc_calc = (2 * a_temp) / p + (z1 + z2) / 2 + Math.pow(diff_z / (2 * Math.PI), 2) * (p / a_temp);
    const xc = Math.ceil(xc_calc / 2) * 2;

    const a_star = 0.25 * p * (
      xc - 0.5 * (z1 + z2) + Math.sqrt(
        Math.pow(xc - 0.5 * (z1 + z2), 2) - 2 * Math.pow(diff_z / Math.PI, 2)
      )
    );
    const a = a_star - 0.002 * a_star;

    const d1 = p / Math.sin(Math.PI / z1);
    const d2 = p / Math.sin(Math.PI / z2);
    const da1 = p * (0.5 + 1 / Math.tan(Math.PI / z1));
    const da2 = p * (0.5 + 1 / Math.tan(Math.PI / z2));

    const r = 0.5025 * selectedChain.dl + 0.05;
    const df1 = d1 - 2 * r;
    const df2 = d2 - 2 * r;

    const v_chain = (z1 * p * (n3 ?? 0)) / 60000;
    const Ft = v_chain > 0 ? (1000 * P3) / v_chain : 0;
    const Fv = selectedChain.q * Math.pow(v_chain, 2);
    const F0 = 9.81 * CHAIN_USE_FACTORS.kf * selectedChain.q * (a / 1000);

    const s = selectedChain.Q / (CHAIN_USE_FACTORS.kd * Ft + F0 + Fv);
    const s_min_data = SAFETY_FACTOR_TABLE.find((item) => item.p === p) || { s_min: 8.5 };

    const Fvd = 13e-7 * (n3 ?? 0) * Math.pow(p, 3) * 1;
    const calcSigmaH = (kr: number) => {
      const insideSqrt = (kr * (Ft * CHAIN_USE_FACTORS.kd + Fvd) * ELASTIC_MODULUS) / (selectedChain.A * 1);
      return 0.47 * Math.sqrt(insideSqrt);
    };

    const sigmaH1 = calcSigmaH(1.0);
    const sigmaH2 = calcSigmaH(0.8);

    const Fr = CHAIN_USE_FACTORS.kx * Ft;

    const chainParams = {
      z1,
      z2,
      p,
      B: selectedChain.B,
      dc: selectedChain.dc,
      xc,
      a,
      d1,
      d2,
      da1,
      da2,
      df1,
      df2,
      Fr,
    };

    const chainStrength = {
      Pt,
      v_chain,
      Ft,
      Fv,
      F0,
      s,
      s_min: s_min_data.s_min,
      passed: s >= s_min_data.s_min,
      sigmaH1,
      sigmaH2,
      sigmaH_allow: CONTACT_STRESS_ALLOW,
      contactPassed: sigmaH1 <= CONTACT_STRESS_ALLOW && sigmaH2 <= CONTACT_STRESS_ALLOW,
    };

    const motorCheck = motor
      ? {
          motor,
          conditions: {
            power_ok: (motor.rated_power ?? 0) >= Pct,
            speed_diff: motor.rated_speed != null ? Math.abs(motor.rated_speed - nsb) : null,
            overload_ok,
          },
          derived: {
            ut,
            ut_expected,
            T_dc,
          },
        }
      : null;

    const result = {
      ...resultBase,
      ut,
      uh,
      ux,
      u1,
      u2,
      gear_diff: gearChoice.diff,
      P1,
      P2,
      P3,
      Pdc_prime,
      n_dc,
      n1,
      n2,
      n3,
      n_lv_calc,
      T_lv,
      T1,
      T2,
      T3,
      chainParams,
      chainStrength,
      shaftTable: {
        dc: { P: Pdc_prime, u: 1, n: n_dc, T: T_dc },
        truc1: { P: P1, u: u1, n: n1, T: T1 },
        truc2: { P: P2, u: u2, n: n2, T: T2 },
        truc3: { P: P3, u: ux, n: n3, T: T3 },
        ct: { P: Plv, u: 0, n: nlv, T: T_lv },
      },
    };

    res.json({ input: parsed.data, result, motor: motorCheck });
  } catch (err) {
    console.error("Calculate error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

export default router;
