import { InputParams } from "../../types/input";
import { MotorInfo } from "../../types/result";
import { EFFICIENCY, MOTOR_TABLE, GEAR_RATIO_SB } from "../../utils/constants";

export class MotorCalculation {
  /**
   * Tính công suất cần thiết của động cơ (Chương 2)
   */
  calculatePower(input: InputParams): { Plv: number; Ptd: number; eta: number; Pct: number; nlv: number; nsb: number } {
    const { F, v, D, t1 = 100, T1_ratio = 1, t2 = 0, T2_ratio = 1 } = input;

    // 1. Công suất làm việc trên trục công tác
    const Plv = (F * v) / 1000;

    // 2. Công suất tương đương
    let Ptd = Plv;
    if (t2 > 0) {
      const ms = t1 + t2;
      const ts = (t1 * Math.pow(T1_ratio, 2) + t2 * Math.pow(T2_ratio, 2)) / ms;
      Ptd = Plv * Math.sqrt(ts);
    }

    // 3. Hiệu suất hệ thống
    const eta = EFFICIENCY.chain * Math.pow(EFFICIENCY.gear, 2) * Math.pow(EFFICIENCY.bearing, 4) * EFFICIENCY.coupling;

    // 4. Công suất cần thiết
    const Pct = Ptd / eta;

    // 5. Số vòng quay trục công tác
    const nlv = (60000 * v) / (Math.PI * D);

    // 6. Số vòng quay sơ bộ
    const usb = GEAR_RATIO_SB.ux * GEAR_RATIO_SB.uh;
    const nsb = nlv * usb;

    return { Plv, Ptd, eta, Pct, nlv, nsb };
  }

  /**
   * Chọn động cơ từ bảng dựa trên Pct và nsb
   */
  selectMotor(Pct: number, nsb: number): MotorInfo {
    // Tìm động cơ có Pđc >= Pct và nđc gần nsb nhất
    const suitableMotors = MOTOR_TABLE.filter(m => m.power >= Pct);
    
    if (suitableMotors.length === 0) {
      // Nếu không có, lấy cái lớn nhất
      return MOTOR_TABLE[MOTOR_TABLE.length - 1];
    }

    // Sắp xếp theo độ gần với nsb
    suitableMotors.sort((a, b) => Math.abs(a.speed - nsb) - Math.abs(b.speed - nsb));
    return suitableMotors[0];
  }
}
