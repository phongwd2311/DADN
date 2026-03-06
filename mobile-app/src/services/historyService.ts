// Service quản lý lịch sử tính toán (Lưu trữ cục bộ)

import { LocalDb } from "../data/localDb";

export const saveCalculationHistory = async (input, output) => {
  const record = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    input,
    output,
  };
  // Giả lập lưu vào DB
  return LocalDb.save("history", record);
};

export const getHistory = async () => {
  return LocalDb.getAll("history");
};
