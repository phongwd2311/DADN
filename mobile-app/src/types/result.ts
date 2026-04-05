/** Kết quả tính trên 1 trục */
export interface ShaftData {
  P: number;  // Công suất (kW)
  u: number;  // Tỷ số truyền
  n: number;  // Số vòng quay (vòng/phút)
  T: number;  // Momen xoắn (N.mm)
}

/** Bảng 1.2 – Số liệu động học & động lực học */
export interface ShaftTable {
  dc:    ShaftData; // Trục động cơ
  truc1: ShaftData; // Trục I
  truc2: ShaftData; // Trục II
  truc3: ShaftData; // Trục III
  ct:    ShaftData; // Trục công tác
}

/** Thông số bộ truyền xích – Bảng 3.2 */
export interface ChainParams {
  z1: number;   // Số răng đĩa dẫn
  z2: number;   // Số răng đĩa bị dẫn
  p: number;    // Bước xích (mm)
  B: number;    // Chiều dài ống lót (mm)
  dc: number;   // Đường kính chốt (mm)
  xc: number;   // Số mắt xích
  a: number;    // Khoảng cách trục (mm)
  d1: number;   // Đường kính vòng chia đĩa dẫn (mm)
  d2: number;   // Đường kính vòng chia đĩa bị dẫn (mm)
  da1: number;  // Đường kính vòng đỉnh đĩa dẫn (mm)
  da2: number;  // Đường kính vòng đỉnh đĩa bị dẫn (mm)
  df1: number;  // Đường kính vòng chân đĩa dẫn (mm)
  df2: number;  // Đường kính vòng chân đĩa bị dẫn (mm)
  Fr: number;   // Lực tác dụng lên trục (N)
}

/** Kết quả kiểm nghiệm bền xích */
export interface ChainStrengthCheck {
  v_chain: number;  // Vận tốc xích (m/s)
  Ft: number;       // Lực vòng (N)
  Fv: number;       // Lực căng do li tâm (N)
  F0: number;       // Lực căng do trọng lượng (N)
  s: number;        // Hệ số an toàn tính được
  s_min: number;    // Hệ số an toàn cho phép [s]
  passed: boolean;  // s >= [s]
  sigmaH1: number;  // Ứng suất tiếp xúc đĩa 1
  sigmaH2: number;  // Ứng suất tiếp xúc đĩa 2
  sigmaH_allow: number; // [σH] cho phép
  contactPassed: boolean;
}

/** Thông tin động cơ được chọn */
export interface MotorInfo {
  id: string;
  power: number;   // kW
  speed: number;   // rpm
  type: string;
  Tk_Tdn?: number; // Tk/Tdn ratio
}

/** Kết quả tính toán toàn bộ */
export interface CalculationResult {
  // Chương 2
  Plv: number;               // Công suất làm việc (kW)
  Ptd: number;               // Công suất tương đương (kW)
  eta: number;               // Hiệu suất hệ thống
  Pct: number;               // Công suất cần thiết (kW)
  nlv: number;               // Số vòng quay trục công tác
  nsb: number;               // Số vòng quay sơ bộ
  motor: MotorInfo;           // Động cơ được chọn
  shaftTable: ShaftTable;     // Bảng số liệu trên các trục
  // Chương 3
  chainParams: ChainParams;  // Thông số bộ truyền xích
  chainStrength: ChainStrengthCheck; // Kiểm nghiệm bền
}
