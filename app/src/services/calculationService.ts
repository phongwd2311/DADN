// Service tính toán thiết kế hệ dẫn động băng tải

import { SAMPLE_MOTORS } from "../data/sampleComponents";

export const calculateMotorPower = (inputData: any) => {
  // F: Lực vòng (N), v: Vận tốc (m/s)
  const { F, v } = inputData;
  if (!F || !v) return 0;

  // Công suất làm việc Plv = F * v / 1000
  // Giả sử hiệu suất chung hệ thống khoảng 0.85
  const effSystem = 0.85;
  const Plv = (F * v) / 1000;
  const motorPowerNeeded = Plv / effSystem;

  // Tìm động cơ phù hợp trong mảng mẫu (Mock lookup)
  // Lấy động cơ có công suất >= công suất cần thiết
  const suggestedMotor =
    SAMPLE_MOTORS.find((m) => m.power >= motorPowerNeeded) ||
    SAMPLE_MOTORS[SAMPLE_MOTORS.length - 1];

  return {
    calculatedPower: Plv, // Công suất trên trục tang
    requiredPower: motorPowerNeeded, // Công suất cần thiết của động cơ
    suggestedMotor: suggestedMotor,
  };
};

export const calculateTransmission = (
  motorSpeed: number,
  drumSpeed: number,
) => {
  if (!drumSpeed) return 0;
  // Tỷ số truyền chung = n_dongco / n_truc_tang
  return motorSpeed / drumSpeed;
};
