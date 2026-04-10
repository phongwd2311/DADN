// Mock Local Database (Thay thế bằng SQLite/AsyncStorage sau này)

// Dữ liệu mẫu ban đầu để hiển thị lên UI (Mock Data)
const MOCK_HISTORY = [
  {
    id: "1",
    timestamp: "2023-11-01T08:30:00.000Z",
    input: { F: 2500, v: 1.2, D: 320 },
    output: {
      motorPower: 3.0,
      transmissionRatio: 18.5,
      chainParams: { z1: 21, z2: 63, pitch: 19.05 },
    },
  },
  {
    id: "2",
    timestamp: "2023-11-05T14:15:00.000Z",
    input: { F: 5000, v: 0.8, D: 400 },
    output: {
      motorPower: 4.5,
      transmissionRatio: 22.1,
      chainParams: { z1: 19, z2: 76, pitch: 25.4 },
    },
  },
];

const db: { [key: string]: any[] } = {
  history: [...MOCK_HISTORY], // Khởi tạo với dữ liệu mẫu
  users: [],
};

export const LocalDb = {
  save: async (table: string, record: any) => {
    if (!db[table]) db[table] = [];
    db[table].unshift(record); // Thêm vào đầu danh sách
    return true;
  },
  getAll: async (table: string) => {
    // Giả lập độ trễ mạng/đọc disk
    await new Promise((resolve) => setTimeout(resolve, 500));
    return db[table] || [];
  },
};
