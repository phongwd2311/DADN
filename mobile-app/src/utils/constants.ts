// Các hằng số dùng chung

export const APP_NAME = "Conveyor Design App";

// Hiệu suất các bộ truyền (CT 2.3)
export const EFFICIENCY = {
  chain: 0.93,    // ηx – bộ truyền xích
  gear: 0.97,     // ηbr – bộ truyền bánh răng
  bearing: 0.99,  // ηol – cặp ổ lăn
  coupling: 1.0,  // ηkn – khớp nối trục đàn hồi
};

// Tỷ số truyền sơ bộ (bảng 3.1, trang 43)
export const GEAR_RATIO_SB = {
  ux: 2.5,   // Tỷ số truyền xích sơ bộ (1.5 - 3)
  uh: 10,    // Tỷ số hộp giảm tốc 2 cấp (8-40)
  u1: 4.0,   // Cấp nhanh (HGT khai triển)
  u2: 2.5,   // Cấp chậm (HGT khai triển)
};

// Bảng Phụ lục P1.2 – Động cơ điện (một số mẫu phổ biến 4P – 1450rpm)
export const MOTOR_TABLE = [
  { id: 'DK.41-4',  power: 0.55, speed: 1450, type: '4P', Tk_Tdn: 2.0 },
  { id: 'DK.42-4',  power: 0.75, speed: 1450, type: '4P', Tk_Tdn: 2.0 },
  { id: 'DK.51-4',  power: 1.1,  speed: 1450, type: '4P', Tk_Tdn: 2.0 },
  { id: 'DK.52-4',  power: 1.5,  speed: 1420, type: '4P', Tk_Tdn: 2.0 },
  { id: 'DK.61-4',  power: 2.2,  speed: 1430, type: '4P', Tk_Tdn: 2.0 },
  { id: 'DK.62-4',  power: 3.0,  speed: 1430, type: '4P', Tk_Tdn: 2.0 },
  { id: 'DK.71-4',  power: 4.0,  speed: 1440, type: '4P', Tk_Tdn: 2.0 },
  { id: 'DK.72-4',  power: 5.5,  speed: 1440, type: '4P', Tk_Tdn: 2.0 },
  { id: 'DK.81-4',  power: 7.5,  speed: 1450, type: '4P', Tk_Tdn: 2.0 },
  { id: 'DK.82-4',  power: 10,   speed: 1450, type: '4P', Tk_Tdn: 2.0 },
  { id: 'DK.91-4',  power: 13,   speed: 1460, type: '4P', Tk_Tdn: 2.0 },
  { id: 'DK.92-4',  power: 15,   speed: 1460, type: '4P', Tk_Tdn: 2.0 },
];

// Bảng 5.5 – Bước xích ống con lăn (p, Q phá hỏng, q khối lượng/m, A diện tích bản lề)
export const CHAIN_TABLE = [
  { p: 12.7,  Q: 18200,  q: 0.71,  A: 39.6,  dc: 4.45,  B: 5.80,  dl: 8.51 },
  { p: 15.875,Q: 22700,  q: 0.90,  A: 54.8,  dc: 5.08,  B: 6.48,  dl: 10.16 },
  { p: 19.05, Q: 31800,  q: 1.52,  A: 105.8, dc: 5.96,  B: 12.70, dl: 11.91 },
  { p: 25.4,  Q: 56700,  q: 2.57,  A: 179.7, dc: 7.94,  B: 15.88, dl: 15.88 },
  { p: 31.75, Q: 88500,  q: 3.73,  A: 262,   dc: 9.55,  B: 19.05, dl: 19.05 },
  { p: 38.1,  Q: 127000, q: 5.52,  A: 394,   dc: 11.10, B: 25.40, dl: 22.23 },
  { p: 44.45, Q: 172400, q: 7.50,  A: 473,   dc: 12.70, B: 25.40, dl: 25.40 },
  { p: 50.8,  Q: 226800, q: 9.70,  A: 646,   dc: 14.29, B: 31.75, dl: 28.58 },
];

// Bảng 5.5 – Công suất cho phép [P] (kW) theo n01 và bước xích p
// Cột: { n01, values: [p=12.7, p=15.875, p=19.05, p=25.4, ...] }
export const CHAIN_POWER_TABLE = [
  { n01: 50,   values: [0.18, 0.38, 0.63, 1.41, 2.49, 4.05, 5.71, 8.30] },
  { n01: 100,  values: [0.33, 0.69, 1.16, 2.57, 4.54, 7.34, 10.3, 15.0] },
  { n01: 200,  values: [0.60, 1.27, 2.12, 4.67, 8.22, 13.2, 18.5, 26.8] },
  { n01: 300,  values: [0.84, 1.78, 2.96, 6.51, 11.4, 18.3, 25.6, 37.1] },
  { n01: 400,  values: [1.07, 2.25, 3.74, 8.22, 14.4, 23.0, 32.1, 46.4] },
  { n01: 500,  values: [1.29, 2.70, 4.48, 9.84, 17.2, 27.5, 38.3, 55.3] },
  { n01: 600,  values: [1.49, 3.12, 5.18, 11.3, 19.8, 31.6, 43.9, 63.3] },
  { n01: 800,  values: [1.86, 3.89, 6.45, 14.1, 24.6, 39.0, 54.1, 77.8] },
  { n01: 1000, values: [2.20, 4.59, 7.60, 16.5, 28.8, 45.7, 63.2, 90.8] },
  { n01: 1200, values: [2.50, 5.22, 8.63, 18.7, 32.5, 51.4, 71.1, 102]  },
  { n01: 1600, values: [3.03, 6.32, 10.4, 22.4, 38.8, 61.0, 84.0, 120]  },
  { n01: 2000, values: [3.46, 7.20, 11.9, 25.4, 43.9, 68.9, 94.5, 135]  },
];

// Bảng 5.10 – Hệ số an toàn cho phép [s] theo bước xích p
export const SAFETY_FACTOR_TABLE = [
  { p: 12.7,   s_min: 7.0 },
  { p: 15.875, s_min: 7.8 },
  { p: 19.05,  s_min: 8.5 },
  { p: 25.4,   s_min: 9.3 },
  { p: 31.75,  s_min: 9.7 },
  { p: 38.1,   s_min: 10.2 },
  { p: 44.45,  s_min: 10.5 },
  { p: 50.8,   s_min: 10.8 },
];

// Bảng 5.11 – Ứng suất tiếp xúc cho phép [σH] (MPa)
export const CONTACT_STRESS_ALLOW = 600; // Gang xám tôi, ram

// Hệ số sử dụng xích (k mặc định)
export const CHAIN_USE_FACTORS = {
  k0: 1,    // Bộ truyền nằm ngang (nghiêng < 40°)
  ka: 1,    // a = 40p
  kdc: 1,   // Điều chỉnh được lực căng
  kbt: 1.3, // Bôi trơn nhỏ giọt
  kd: 1.2,  // Tải trọng va đập nhẹ
  kc: 1,    // Làm việc 1 ca
};

// Module đàn hồi (E) cho thép-thép
export const ELASTIC_MODULUS = 2.1e5; // MPa
