/**
 * Định nghĩa các Model dữ liệu cho linh kiện (Entities)
 */

export interface Motor {
  id: string;
  type: string;
  power: number; // kW
  speed: number; // rpm
  efficiency: number;
  price?: number;
}

export interface ChainKey {
  id: string;
  pitch: number; // Bước xích (mm)
  strength: number; // Tải trọng phá hủy (kN)
}

export interface CalculationResult {
  id: string;
  date: Date;
  inputs: any;
  outputs: any;
}
