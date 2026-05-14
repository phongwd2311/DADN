import { LocalDb } from './localDb';
import { InputParams } from '../types/input';
import { CalculationResult } from '../types/result';
import { sessionApi } from '../api/sessionApi';

export interface HistoryRecord {
  id: string;
  timestamp: string;
  sessionName?: string;
  input: Partial<InputParams>;
  resultData?: CalculationResult;
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

    try {
      const backendInput = {
        F: Number(input.F ?? 0),
        v: Number(input.v ?? 0),
        D: Number(input.D ?? 0),
        t1: 60,
        T1_ratio: 1,
        t2: 40,
        T2_ratio: 0.65,
        uh: 10,
        gearbox_type: 'KHAI_TRIEN',
        tmm_t1_ratio: 1.4,
      };
      const sessionName = `He dan dong ${new Date().toISOString()}`;
      await sessionApi.create(sessionName, backendInput, result);
    } catch (error) {
      console.log('Sync backend failed, keep local only:', error);
    }

    return LocalDb.save('history', record);
  },

  getAll: async (): Promise<HistoryRecord[]> => {
    try {
      const response = await sessionApi.getAll();
      const sessions = Array.isArray(response?.sessions) ? response.sessions : [];

      return sessions.map((s: any) => {
        const input = s?.input_json ?? {};
        const result = s?.result_json ?? {};
        const chainParams = result?.chainParams ?? {};

        return {
          id: String(s.session_id),
          timestamp: s.created_at ?? new Date().toISOString(),
          sessionName: s.session_name ?? `Session ${s.session_id}`,
          input: {
            F: input.F ?? 0,
            v: input.v ?? 0,
            D: input.D ?? 0,
            L: input.L ?? undefined,
          },
          resultData: result as CalculationResult,
          output: {
            motorPower: result.Pct ?? 0,
            transmissionRatio: result.ut ?? 0,
            chainParams: {
              pitch: chainParams.p ?? 0,
              z1: chainParams.z1,
              z2: chainParams.z2,
            },
          },
        };
      });
    } catch (e) {
      return LocalDb.getAll('history');
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await sessionApi.delete(Number(id));
      return true;
    } catch (e) {
      return false;
    }
  },
};
