import apiClient from "./client";
import { CalculationResult } from "../types/result";

export type GearboxType = "KHAI_TRIEN" | "PHAN_DOI";

export interface CalculatePayload {
  F: number;
  v: number;
  D: number;
  t1: number;
  T1_ratio: number;
  t2: number;
  T2_ratio: number;
  uh: number;
  gearbox_type: GearboxType;
  tmm_t1_ratio: number;
}

interface BackendCalculateResponse {
  result: any;
  motor: {
    motor: {
      model: string;
      rated_power: number | null;
      rated_speed: number | null;
      tk_tdn: number | null;
    } | null;
  } | null;
}

const normalizeResult = (data: BackendCalculateResponse): CalculationResult => {
  const backendResult = data.result;
  const selectedMotor = data.motor?.motor;

  return {
    ...backendResult,
    motor: {
      id: selectedMotor?.model ?? "N/A",
      power: selectedMotor?.rated_power ?? 0,
      speed: selectedMotor?.rated_speed ?? 0,
      type: "Standard",
      Tk_Tdn: selectedMotor?.tk_tdn ?? undefined,
    },
  };
};

export const calculateApi = {
  calculate: async (payload: CalculatePayload): Promise<CalculationResult> => {
    const response = await apiClient.post("/calculate", payload);
    return normalizeResult(response.data);
  },
};

