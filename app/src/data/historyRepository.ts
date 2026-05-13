// Repository Pattern: Xử lý toàn bộ thao tác dữ liệu lịch sử tính toán
// Đây là nguồn dữ liệu duy nhất cho HistoryScreen — không gọi LocalDb trực tiếp từ UI

import { LocalDb } from './localDb';
import { InputParams } from '../types/input';
import { CalculationResult } from '../types/result';
import { sessionApi } from '../api/sessionApi';

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

    // Đồng bộ lên Backend (try-catch để không sập app nếu mất mạng)
    try {
      const backendInput = {
        force_f: input.F,
        velocity_v: input.v,
        diameter_d: input.D,
        lifespan_l: input.L,
      };

      const backendResult = {
        equivalent_power: result.motor?.power,
        total_ratio_ut: result.shaftTable?.truc1?.u, // Lấy tạm u1
      };

      const sessionName = `Hệ dẫn động ${new Date().toLocaleDateString('vi-VN')}`;
      await sessionApi.create(sessionName, backendInput, backendResult);
    } catch (error) {
      console.log("Lỗi đồng bộ mây, chỉ lưu local:", error);
    }

    return LocalDb.save('history', record);
  },

  /**
   * Lấy toàn bộ lịch sử tính toán
   */
  getAll: async (): Promise<HistoryRecord[]> => { try { const response = await sessionApi.getAll(); return response.sessions.map((s: any) => ({ id: s.id.toString(), timestamp: s.created_at, input: { F: s.input_data?.force_f, v: s.input_data?.velocity_v, D: s.input_data?.diameter_d, L: s.input_data?.lifespan_l }, output: { motorPower: s.result_data?.equivalent_power || 0, transmissionRatio: s.result_data?.total_ratio_ut || 0, chainParams: { pitch: 0 } } })); } catch (e) { return LocalDb.getAll('history'); } }, delete: async (id: string): Promise<boolean> => { try { await sessionApi.delete(Number(id)); return true; } catch (e) { return false; } },
};
