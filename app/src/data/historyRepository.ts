// Repository Pattern: Xử lý toàn bộ thao tác dữ liệu lịch sử tính toán
// Đây là nguồn dữ liệu duy nhất cho HistoryScreen — không gọi LocalDb trực tiếp từ UI

import { LocalDb } from './localDb';
import { InputParams } from '../types/input';
import { CalculationResult } from '../types/result';

export interface HistoryRecord {
  id: string;
  timestamp: string;
  input: Partial<InputParams>;
  output: {
    motorPower: number;
    transmissionRatio: number;
    chainParams: {
      pitch: number;
      z1?: number;
      z2?: number;
    };
  };
}

export const HistoryRepository = {
  /**
   * Lưu một kết quả tính toán mới vào lịch sử
   */
  save: async (input: Partial<InputParams>, result: CalculationResult): Promise<boolean> => {
    const record: HistoryRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      input,
      output: {
        motorPower: result.motor?.power ?? 0,
        transmissionRatio: result.shaftTable?.truc1?.u ?? 0,
        chainParams: {
          pitch: result.chainParams?.p ?? 0,
          z1: result.chainParams?.z1,
          z2: result.chainParams?.z2,
        },
      },
    };
    return LocalDb.save('history', record);
  },

  /**
   * Lấy toàn bộ lịch sử tính toán
   */
  getAll: async (): Promise<HistoryRecord[]> => {
    return LocalDb.getAll('history');
  },
};
