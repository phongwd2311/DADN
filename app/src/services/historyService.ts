// historyService.ts — Wrapper (backward compatibility)
// Logic thực sự đã được chuyển đến data/repositories/historyRepository.ts
// Giữ file này để không breaking các import hiện tại

export { HistoryRepository } from '../data/historyRepository';

/** @deprecated Dùng HistoryRepository.save() thay thế */
export const saveCalculationHistory = async (input: any, output: any) => {
  const { LocalDb } = await import('../data/localDb');
  const record = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    input,
    output,
  };
  return LocalDb.save('history', record);
};

/** @deprecated Dùng HistoryRepository.getAll() thay thế */
export const getHistory = async () => {
  const { LocalDb } = await import('../data/localDb');
  return LocalDb.getAll('history');
};
