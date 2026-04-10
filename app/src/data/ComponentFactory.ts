// Pattern: Factory Method
// Mục đích: Khởi tạo các đối tượng linh kiện từ dữ liệu thô (Raw Data từ DB)

import { Motor, ChainKey } from "./Components";

export class ComponentFactory {
  static createMotor(data: any): Motor {
    return {
      id: data.id,
      power: data.P,
      speed: data.n,
      efficiency: data.eff,
      type: data.type || "standard",
    };
  }

  static createChain(data: any): ChainKey {
    return {
      id: data.id,
      pitch: data.t,
      strength: data.Q,
      // mapping other fields
    };
  }
}
