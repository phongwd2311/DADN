import { MotorInfo, ShaftTable } from "../../types/result";

export class GearRatioDistributor {
  /**
   * Phân phối tỷ số truyền và tính toán số liệu trên các trục
   */
  distribute(
    motor: MotorInfo,
    nlv: number,
    Plv: number,
    eta: number
  ): { ut: number; uh: number; ux: number; u1: number; u2: number; shaftTable: ShaftTable } {
    
    // 1. Tỷ số truyền hệ dẫn động
    const ut = motor.speed / nlv;

    // 2. Phân phối tỷ số truyền
    // Tạm dùng u1=4, u2=2.5 như cấu hình chuẩn cho HGT 2 cấp
    const u1 = 4.0;
    const u2 = 2.5;
    const uh = u1 * u2;
    const ux = ut / uh;

    // 3. Tính công suất trên các trục
    // Plv -> P3 -> P2 -> P1 -> Pđc'
    // Hiệu suất từng cấp
    const eta_x = 0.93; // xích
    const eta_br = 0.97; // bánh răng
    const eta_ol = 0.99; // ổ lăn
    const eta_kn = 1.0; // khớp nối

    const P3 = Plv / (eta_x * eta_ol);
    const P2 = P3 / (eta_br * eta_ol);
    const P1 = P2 / (eta_br * eta_ol);
    const Pdc_phay = P1 / (eta_kn * eta_ol);

    // 4. Tính số vòng quay
    const n_dc = motor.speed;
    const n1 = n_dc / 1.0; // u_kn = 1
    const n2 = n1 / u1;
    const n3 = n2 / u2;
    const n_ct = n3 / ux;

    // 5. Tính Momen xoắn (T = 9.55 * 10^6 * P / n)
    const calcT = (p: number, n: number) => (9.55 * 1000000 * p) / n;

    const Tdc = calcT(Pdc_phay, n_dc);
    const T1 = calcT(P1, n1);
    const T2 = calcT(P2, n2);
    const T3 = calcT(P3, n3);
    const Tct = calcT(Plv, n_ct);

    const shaftTable: ShaftTable = {
      dc:    { P: Pdc_phay, u: 1.0, n: n_dc, T: Tdc },
      truc1: { P: P1, u: u1, n: n1, T: T1 },
      truc2: { P: P2, u: u2, n: n2, T: T2 },
      truc3: { P: P3, u: ux, n: n3, T: T3 },
      ct:    { P: Plv, u: 0, n: n_ct, T: Tct }
    };

    return { ut, uh, ux, u1, u2, shaftTable };
  }
}
