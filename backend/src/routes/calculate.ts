import { Router, Response } from "express";
import { prisma } from "../lib/prisma";
import { calculateSchema } from "../validators/schemas";
import { EFFICIENCY } from "../constants/efficiency";
import {
  CHAIN_REF,
  CHAIN_TABLE,
  CHAIN_POWER_TABLE,
  SAFETY_FACTOR_TABLE,
  CHAIN_USE_FACTORS,
  CONTACT_STRESS_ALLOW,
  ELASTIC_MODULUS,
} from "../constants/chainTables";
import { GEARBOX_RATIO_OPTIONS, PRELIM_UX, GearboxType } from "../constants/gearbox";
import { CHAIN_Z1_TABLE, getKbtByChainSpeed, getPmaxBySprocketSpeed } from "../constants/standards";

const router = Router();

type ExternalDriveType = "CHAIN" | "BELT" | "GEAR" | "NONE";
type ChainLayoutType = "HORIZONTAL_OR_LT40" | "STEEP_GT40";

const CONDITION_FACTOR_MAP: Record<number, number> = {
  1: 1,
  2: 1.1,
  3: 1.25,
  4: 1.4,
};

function mapConditionFactor(type: number | undefined, fallback: number): number {
  if (!type) return fallback;
  return CONDITION_FACTOR_MAP[type] ?? fallback;
}

function safeRound(value: number, digits = 4): number {
  if (!Number.isFinite(value)) {
    return value;
  }
  const factor = Math.pow(10, digits);
  return Math.round(value * factor) / factor;
}

function chooseMotor(
  motors: Array<{
    motor_id: number;
    model: string;
    rated_power: number | null;
    rated_speed: number | null;
    tk_tdn: number | null;
    efficiency: number | null;
  }>,
  pct: number,
  nsb: number,
  tmmT1Ratio: number,
) {
  const ranked = motors
    .filter((motor) => {
      if (motor.rated_power == null || motor.rated_power < pct) return false;
      if (motor.tk_tdn == null || motor.tk_tdn < tmmT1Ratio) return false;
      return true;
    })
    .map((motor) => {
      const speed = motor.rated_speed ?? Number.POSITIVE_INFINITY;
      const speedDiff = Math.abs(speed - nsb);
      return { motor, speedDiff };
    })
    .sort((a, b) => {
      if (a.speedDiff !== b.speedDiff) {
        return a.speedDiff - b.speedDiff;
      }
      return (a.motor.rated_power ?? Number.POSITIVE_INFINITY) - (b.motor.rated_power ?? Number.POSITIVE_INFINITY);
    });

  if (ranked.length > 0) {
    return ranked[0].motor;
  }

  return null;
}

function selectGearRatios(ratio: number, type: GearboxType) {
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
}

function findPowerRowBySpeed(n: number) {
  const validN = Number.isFinite(n) && n > 0 ? n : CHAIN_REF.n01;
  return CHAIN_POWER_TABLE.reduce((best, current) => {
    const bestDiff = Math.abs(best.n01 - validN);
    const currentDiff = Math.abs(current.n01 - validN);
    return currentDiff < bestDiff ? current : best;
  }, CHAIN_POWER_TABLE[0]);
}

function findChainIndexByPt(pt: number, n: number): number {
  const row = findPowerRowBySpeed(n);
  const index = row.values.findIndex((value) => pt <= value);
  return index === -1 ? CHAIN_TABLE.length - 1 : index;
}

function chooseZ1ByRatio(ux: number) {
  const tableHit = CHAIN_Z1_TABLE.find((row) => ux >= row.u_from && ux < row.u_to) ?? CHAIN_Z1_TABLE[CHAIN_Z1_TABLE.length - 1];
  const formula = Math.max(15, Math.round(29 - 2 * ux));
  const clamped = Math.max(tableHit.z1_to, Math.min(tableHit.z1_from, formula));
  return Math.round(clamped);
}

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

    const {
      F,
      v,
      D,
      t1,
      t2,
      T1_ratio,
      T2_ratio,
      uh,
      gearbox_type,
      tmm_t1_ratio,
      external_drive_type,
      chain_layout,
      conditions,
    } = parsed.data;

    const externalDriveType: ExternalDriveType = external_drive_type ?? "CHAIN";
    const chainLayout: ChainLayoutType = chain_layout ?? "HORIZONTAL_OR_LT40";

    const Plv = (F * v) / 1000;
    const timeTotal = t1 + t2;
    const ratioSum = (t1 * Math.pow(T1_ratio, 2) + t2 * Math.pow(T2_ratio, 2)) / timeTotal;
    const Ptd = Plv * Math.sqrt(ratioSum);
    const eta = EFFICIENCY.chain * Math.pow(EFFICIENCY.gear, 2) * Math.pow(EFFICIENCY.bearing, 4) * EFFICIENCY.coupling;
    const Pct = Ptd / eta;
    const nlv = (60000 * v) / (Math.PI * D);
    const usb = PRELIM_UX * uh;
    const nsb = nlv * usb;

    const resultBase = { Plv, Ptd, eta, Pct, nlv, usb, nsb };
    if (Object.values(resultBase).some((value) => !Number.isFinite(value))) {
      res.status(400).json({ error: "Kết quả tính toán không hợp lệ" });
      return;
    }

    const allMotors = await prisma.motorLibrary.findMany({
      orderBy: [{ rated_power: "asc" }, { rated_speed: "asc" }],
    });

    const motor = chooseMotor(allMotors, Pct, nsb, tmm_t1_ratio);
    if (!motor) {
      res.status(422).json({
        error: "Không có động cơ thỏa điều kiện quá tải",
        code: "motor_overload_requirement_not_met",
      });
      return;
    }

    const ut = motor.rated_speed != null ? motor.rated_speed / nlv : null;
    const ut_expected = usb;
    const T_dc =
      motor.rated_power != null && motor.rated_speed != null
        ? (9.55 * 1_000_000 * motor.rated_power) / motor.rated_speed
        : null;
    const overload_ok = motor.tk_tdn != null ? motor.tk_tdn >= tmm_t1_ratio : null;

    if (ut == null || !Number.isFinite(ut) || ut <= 0) {
      res.status(400).json({ error: "Không thể xác định tỷ số truyền tổng từ động cơ đã chọn" });
      return;
    }

    const gearChoice = selectGearRatios(uh, gearbox_type);
    const u1 = gearChoice.u1;
    const u2 = gearChoice.u2;

    let un = ut / uh;
    if (!Number.isFinite(un) || un <= 0) {
      res.status(400).json({ error: "Tỷ số truyền bộ truyền ngoài không hợp lệ" });
      return;
    }

    if (externalDriveType === "NONE") {
      un = 1;
    }

    const externalRatioName =
      externalDriveType === "CHAIN"
        ? "ux"
        : externalDriveType === "BELT"
          ? "ud"
          : externalDriveType === "GEAR"
            ? "ubr"
            : "un";

    const ux = externalDriveType === "CHAIN" ? un : null;

    const P3 = Plv / (EFFICIENCY.chain * EFFICIENCY.bearing);
    const P2 = P3 / (EFFICIENCY.gear * EFFICIENCY.bearing);
    const P1 = P2 / (EFFICIENCY.gear * EFFICIENCY.bearing);
    const Pdc_prime = P1 / (EFFICIENCY.coupling * EFFICIENCY.bearing);

    const n_dc = motor.rated_speed ?? null;
    const n1 = n_dc != null ? n_dc : null;
    const n2 = n1 != null ? n1 / u1 : null;
    const n3 = n2 != null ? n2 / u2 : null;
    const n_lv_calc = n3 != null ? n3 / un : null;

    const calcT = (p: number, n: number) => (9.55 * 1_000_000 * p) / n;
    const T_lv = calcT(Plv, nlv);
    const T1 = n1 != null ? calcT(P1, n1) : null;
    const T2 = n2 != null ? calcT(P2, n2) : null;
    const T3 = n3 != null ? calcT(P3, n3) : null;

    let chainParams: Record<string, unknown> | null = null;
    let chainStrength: Record<string, unknown> | null = null;

    if (externalDriveType === "CHAIN") {
      if (n3 == null || !Number.isFinite(n3) || n3 <= 0 || ux == null || ux <= 0) {
        res.status(400).json({ error: "Không thể thiết kế bộ truyền xích do thiếu dữ liệu động học" });
        return;
      }

      const z1 = chooseZ1ByRatio(ux);
      const z2 = Math.max(z1 + 1, Math.round(z1 * ux));

      const dynamicFactors = {
        k0: mapConditionFactor(conditions?.k0_type, CHAIN_USE_FACTORS.k0),
        ka: mapConditionFactor(conditions?.ka_type, CHAIN_USE_FACTORS.ka),
        kdc: mapConditionFactor(conditions?.kdc_type, CHAIN_USE_FACTORS.kdc),
        kd: mapConditionFactor(conditions?.kd_type, CHAIN_USE_FACTORS.kd),
        kc: mapConditionFactor(conditions?.kc_type, CHAIN_USE_FACTORS.kc),
        kf: chainLayout === "HORIZONTAL_OR_LT40" ? 6 : 1,
        kx: chainLayout === "HORIZONTAL_OR_LT40" ? 1.15 : 1.05,
      };

      let chainIndex = findChainIndexByPt(P3, n3);
      let passed = false;
      const optimizationLog: Array<Record<string, unknown>> = [];

      for (let iteration = 1; iteration <= 5; iteration += 1) {
        const selectedChain = CHAIN_TABLE[Math.min(chainIndex, CHAIN_TABLE.length - 1)];
        const p = selectedChain.p;

        const a_temp = 40 * p;
        const diff_z = z2 - z1;
        const xc_calc = (2 * a_temp) / p + (z1 + z2) / 2 + Math.pow(diff_z / (2 * Math.PI), 2) * (p / a_temp);
        const xc = Math.ceil(xc_calc / 2) * 2;

        const sqrtTerm = Math.pow(xc - 0.5 * (z1 + z2), 2) - 2 * Math.pow(diff_z / Math.PI, 2);
        if (sqrtTerm <= 0) {
          res.status(400).json({ error: "Không thể xác định khoảng cách trục bộ truyền xích" });
          return;
        }

        const a_star = 0.25 * p * (xc - 0.5 * (z1 + z2) + Math.sqrt(sqrtTerm));
        const a = a_star - 0.002 * a_star;

        const d1 = p / Math.sin(Math.PI / z1);
        const d2 = p / Math.sin(Math.PI / z2);
        const da1 = p * (0.5 + 1 / Math.tan(Math.PI / z1));
        const da2 = p * (0.5 + 1 / Math.tan(Math.PI / z2));

        const r = 0.5025 * selectedChain.dl + 0.05;
        const df1 = d1 - 2 * r;
        const df2 = d2 - 2 * r;

        const v_chain = (z1 * p * n3) / 60000;
        const kbtBySpeed = getKbtByChainSpeed(v_chain);
        const kbt = mapConditionFactor(conditions?.kbt_type, kbtBySpeed);
        const K =
          dynamicFactors.k0 *
          dynamicFactors.ka *
          dynamicFactors.kdc *
          kbt *
          dynamicFactors.kd *
          dynamicFactors.kc;

        const Kz = CHAIN_REF.z01 / z1;
        const Kn = CHAIN_REF.n01 / n3;
        const Pt = P3 * K * Kz * Kn;

        const requiredIndex = findChainIndexByPt(Pt, n3);
        if (requiredIndex > chainIndex) {
          chainIndex = requiredIndex;
          optimizationLog.push({ iteration, action: "increase_chain_by_power", required_index: requiredIndex, Pt: safeRound(Pt) });
          continue;
        }

        const pMax = getPmaxBySprocketSpeed(n3);
        const pitchLimitOk = p <= pMax;

        const Ft = v_chain > 0 ? (1000 * P3) / v_chain : 0;
        const Fv = selectedChain.q * Math.pow(v_chain, 2);
        const F0 = 9.81 * dynamicFactors.kf * selectedChain.q * (a / 1000);

        const s = selectedChain.Q / (dynamicFactors.kd * Ft + F0 + Fv);
        const sMinData = SAFETY_FACTOR_TABLE.find((item) => item.p === p) ?? { s_min: 8.5 };

        // SR-08.6: Số lần va đập xích trong 1 giây
        const impact_freq = (z1 * n3) / (15 * xc);

        const Fvd = 13e-7 * n3 * Math.pow(p, 3);
        const calcSigmaH = (kr: number) => {
          const insideSqrt = (kr * (Ft * dynamicFactors.kd + Fvd) * ELASTIC_MODULUS) / selectedChain.A;
          return 0.47 * Math.sqrt(insideSqrt);
        };

        const sigmaH1 = calcSigmaH(1.0);
        const sigmaH2 = calcSigmaH(0.8);
        const contactPassed = sigmaH1 <= CONTACT_STRESS_ALLOW && sigmaH2 <= CONTACT_STRESS_ALLOW;

        passed = s >= sMinData.s_min && pitchLimitOk && contactPassed;

        chainParams = {
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
          Fr: dynamicFactors.kx * Ft,
        };

        chainStrength = {
          Pt,
          v_chain,
          Ft,
          Fv,
          F0,
          s,
          s_min: sMinData.s_min,
          impact_freq,
          passed,
          tensile_passed: s >= sMinData.s_min,
          sigmaH1,
          sigmaH2,
          sigmaH_allow: CONTACT_STRESS_ALLOW,
          contactPassed,
          pitch_limit_ok: pitchLimitOk,
          p_max: pMax,
          kbt,
          kbt_by_speed: kbtBySpeed,
          condition_types: conditions ?? null,
          iteration,
        };

        optimizationLog.push({
          iteration,
          p,
          kbt,
          s: safeRound(s),
          s_min: sMinData.s_min,
          contactPassed,
          pitchLimitOk,
          passed,
        });

        if (passed) {
          break;
        }

        if (chainIndex >= CHAIN_TABLE.length - 1) {
          break;
        }

        chainIndex += 1;
      }

      if (!chainParams || !chainStrength) {
        res.status(400).json({ error: "Không thể thiết kế bộ truyền xích" });
        return;
      }

      chainStrength.optimization = {
        max_iterations: 5,
        history: optimizationLog,
        final_passed: passed,
      };
    }

    const motorCheck = {
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
      warnings: [
        ...(motor.rated_power != null && motor.rated_power < Pct ? ["dong_co_chua_dat_cong_suat_pct"] : []),
        ...(overload_ok === false ? ["dong_co_khong_dat_dieu_kien_qua_tai"] : []),
      ],
    };

    const result: Record<string, unknown> = {
      ...resultBase,
      ut,
      uh,
      u1,
      u2,
      gear_diff: gearChoice.diff,
      external_drive_type: externalDriveType,
      external_ratio_name: externalRatioName,
      external_ratio: un,
      ...(ux != null ? { ux } : {}),
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
        truc3: { P: P3, u: un, n: n3, T: T3 },
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
