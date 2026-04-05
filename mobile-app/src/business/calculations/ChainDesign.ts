import { ChainParams, ChainStrengthCheck } from "../../types/result";
import { CHAIN_TABLE, CHAIN_POWER_TABLE, SAFETY_FACTOR_TABLE, CHAIN_USE_FACTORS, CONTACT_STRESS_ALLOW, ELASTIC_MODULUS } from "../../utils/constants";

export class ChainDriveDesign {
  /**
   * Tính toán bộ truyền xích (Chương 3)
   */
  design(P3: number, n3: number, ux: number): { chainParams: ChainParams; strength: ChainStrengthCheck } {
    // 1. Chọn số răng đĩa xích
    const z1_calc = 29 - 2 * ux;
    const z1 = Math.max(15, Math.round(z1_calc)); // Giới hạn z1 tối thiểu
    const z2 = Math.round(z1 * ux);

    // 2. Chọn bước xích (p)
    // Coi K = K0*Ka*... ~ 1.3 cho ví dụ này
    const K = CHAIN_USE_FACTORS.k0 * CHAIN_USE_FACTORS.ka * CHAIN_USE_FACTORS.kdc * 
              CHAIN_USE_FACTORS.kbt * CHAIN_USE_FACTORS.kd * CHAIN_USE_FACTORS.kc; // ~ 1.56
    const Kz = 25 / z1;
    const Kn = 200 / n3; // giả sử n01 = 200
    const Pt = P3 * K * Kz * Kn;

    // Chọn bước xích từ bảng (giả định Pt <= [P])
    // Đơn giản hóa: chọn p = 19.05 cho đa số trường hợp băng tải nhỏ
    // TODO: Áp dụng thuật toán lookup bảng CHAIN_POWER_TABLE chuẩn xác
    const selectedChain = CHAIN_TABLE.find(c => c.p === 19.05)!; 
    const p = selectedChain.p;

    // 3. Khoảng cách trục a & số mắt xích xc
    const a_temp = 40 * p;
    const diff_z = z2 - z1;
    let xc_calc = (2 * a_temp) / p + (z1 + z2) / 2 + Math.pow(diff_z / (2 * Math.PI), 2) * (p / a_temp);
    const xc = Math.ceil(xc_calc / 2) * 2; // Làm tròn lên số chẵn

    // Tính lại a thực tế
    const a_star = 0.25 * p * (
      xc - 0.5 * (z1 + z2) + Math.sqrt(
        Math.pow(xc - 0.5 * (z1 + z2), 2) - 2 * Math.pow(diff_z / Math.PI, 2)
      )
    );
    const a = a_star - 0.002 * a_star;

    // 4. Đường kính đĩa xích
    const d1 = p / Math.sin(Math.PI / z1);
    const d2 = p / Math.sin(Math.PI / z2);
    
    const da1 = p * (0.5 + 1 / Math.tan(Math.PI / z1)); // cot = 1/tan
    const da2 = p * (0.5 + 1 / Math.tan(Math.PI / z2));

    const r = 0.5025 * selectedChain.dl + 0.05;
    const df1 = d1 - 2 * r;
    const df2 = d2 - 2 * r;

    // 5. Kiểm nghiệm độ bền
    const v = (z1 * p * n3) / 60000;
    const Ft = (1000 * P3) / v;
    const Fv = selectedChain.q * Math.pow(v, 2);
    const F0 = 9.81 * 4 * selectedChain.q * a / 1000; // kf ~ 4

    const s = selectedChain.Q / (CHAIN_USE_FACTORS.kd * Ft + F0 + Fv);
    const s_min_data = SAFETY_FACTOR_TABLE.find(x => x.p === p) || { s_min: 8.5 };

    // 6. Kiểm nghiệm tiếp xúc
    const kr1 = 1.0; // Hệ số phụ thuộc z
    const kr2 = 0.8; 
    const Fvd = 13e-7 * n3 * Math.pow(p, 3) * 1; // 1 dãy
    
    // σH = 0.47 * sqrt(kr * (Ft*Kd + Fvd) * E / (A * kd))
    const calcSigmaH = (kr: number) => {
      const insideSqrt = (kr * (Ft * CHAIN_USE_FACTORS.kd + Fvd) * ELASTIC_MODULUS) / (selectedChain.A * 1);
      return 0.47 * Math.sqrt(insideSqrt);
    };

    const sigmaH1 = calcSigmaH(kr1);
    const sigmaH2 = calcSigmaH(kr2);

    // 7. Lực lên trục
    const kx = 1.15; // bộ truyền nằm ngang
    const Fr = kx * Ft;

    const chainParams: ChainParams = {
      z1, z2, p, B: selectedChain.B, dc: selectedChain.dc, xc, a, 
      d1, d2, da1, da2, df1, df2, Fr
    };

    const strength: ChainStrengthCheck = {
      v_chain: v, Ft, Fv, F0, s, 
      s_min: s_min_data.s_min,
      passed: s >= s_min_data.s_min,
      sigmaH1, sigmaH2, 
      sigmaH_allow: CONTACT_STRESS_ALLOW,
      contactPassed: sigmaH1 <= CONTACT_STRESS_ALLOW && sigmaH2 <= CONTACT_STRESS_ALLOW
    };

    return { chainParams, strength };
  }
}
