export interface InputParams {
  F: number;    // Lực vòng trên băng tải (N)
  v: number;    // Vận tốc băng tải (m/s)
  D: number;    // Đường kính trục tang (mm)
  L?: number;   // Tuổi thọ (giờ)
  t1?: number;  // Thời gian làm việc chế độ 1 (%)
  T1_ratio?: number; // T1/T ratio (mặc định = 1)
  t2?: number;  // Thời gian làm việc chế độ 2 (%)
  T2_ratio?: number; // T2/T ratio (mặc định = 0.65)
}

// Giới hạn validation
export const INPUT_LIMITS = {
  F:  { min: 1, max: 50000, label: 'Lực kéo F' },
  v:  { min: 0.01, max: 5, label: 'Vận tốc v' },
  D:  { min: 50, max: 1000, label: 'Đường kính D' },
  L:  { min: 1, max: 100000, label: 'Tuổi thọ L' },
  t1: { min: 1, max: 100, label: 't₁' },
  T1_ratio: { min: 0, max: 5, label: 'T₁' },
  t2: { min: 1, max: 100, label: 't₂' },
  T2_ratio: { min: 0, max: 5, label: 'T₂' },
} as const;
