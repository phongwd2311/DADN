// FR-CAL-008: Facade Design Pattern
// Class này đóng vai trò là đầu mối duy nhất để UI gọi xuống tầng xử lý nghiệp vụ
// Giúp giảm sự phụ thuộc giữa giao diện và các module tính toán phức tạp.

import { MotorCalculation } from "../calculations/MotorCalc";
import { GearRatioDistributor } from "../calculations/GearRatio";
import { ChainDriveDesign } from "../calculations/ChainDesign";
import { ExpertSystem } from "../../expert_system/ExpertSystem";

export class DesignFacade {
  private motorCalc: MotorCalculation;
  private gearDistributor: GearRatioDistributor;
  private chainDesigner: ChainDriveDesign;
  private expertSystem: ExpertSystem;

  constructor() {
    this.motorCalc = new MotorCalculation();
    this.gearDistributor = new GearRatioDistributor();
    this.chainDesigner = new ChainDriveDesign();
    this.expertSystem = new ExpertSystem();
  }

  /**
   * Thực hiện quy trình tính toán toàn vẹn
   * @param inputData Dữ liệu nhập từ User
   */
  public async performFullDesign(inputData: any) {
    // 1. Tính toán chọn động cơ (FR-CAL-001)
    const motorSpecs = this.motorCalc.calculatePower(inputData);

    // 2. Gợi ý linh kiện động cơ (System Expert)
    const suggestedMotors = await this.expertSystem.suggestMotors(motorSpecs);

    // 3. Phân phối tỷ số truyền (FR-CAL-004)
    const transmission = this.gearDistributor.distribute(
      motorSpecs,
      suggestedMotors[0],
    );

    // 4. Thiết kế bộ truyền xích (FR-CAL-006)
    const chainDesign = this.chainDesigner.design(transmission);

    return {
      motorSpecs,
      suggestedMotors,
      transmission,
      chainDesign,
    };
  }
}
