export interface CalculationResult {
  motorPower: number; // Công suất động cơ (kW)
  transmissionRatio: number; // Tỷ số truyền chung
  chainParams: {
    z1: number;
    z2: number;
    pitch: number;
  };
}
