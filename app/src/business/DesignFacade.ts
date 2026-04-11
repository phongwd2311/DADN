import { MotorCalculation } from "./MotorCalc";
import { GearRatioDistributor } from "./GearRatio";
import { ChainDriveDesign } from "./ChainDesign";
import { ExpertSystem } from "./ExpertSystem";
import { InputParams } from "../types/input";
import { CalculationResult } from "../types/result";

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
   */
  public async performFullDesign(inputData: InputParams): Promise<CalculationResult> {
    // 1. Tính toán chọn động cơ (FR-CAL-001)
    const { Plv, Ptd, eta, Pct, nlv, nsb } = this.motorCalc.calculatePower(inputData);
    const motor = this.motorCalc.selectMotor(Pct, nsb);

    // 2. Gợi ý linh kiện động cơ (Expert System - Placeholder logic thêm nếu cần)
    // Tạm thời bỏ qua expertSystem vì selectMotor đã chọn cái tốt nhất từ MOTOR_TABLE

    // 3. Phân phối tỷ số truyền (FR-CAL-004)
    const { ut, uh, ux, u1, u2, shaftTable } = this.gearDistributor.distribute(
      motor, nlv, Plv, eta
    );

    // 4. Thiết kế bộ truyền xích (FR-CAL-006)
    // Lấy P3, n3 từ mảng shaft để tính xích
    const P3 = shaftTable.truc3.P;
    const n3 = shaftTable.truc3.n;
    const { chainParams, strength } = this.chainDesigner.design(P3, n3, ux);

    return {
      Plv, Ptd, eta, Pct, nlv, nsb,
      motor,
      shaftTable,
      chainParams,
      chainStrength: strength
    };
  }
}
