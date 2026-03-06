// Pattern: Strategy Pattern
// FR-REC-005: Lựa chọn chiến lược gợi ý

export interface ISuggestionStrategy {
  score(component: any, requirements: any): number;
}

export class CostOptimizationStrategy implements ISuggestionStrategy {
  score(component: any, requirements: any): number {
    // Logic chấm điểm ưu tiên giá thành rẻ
    return 0; // Implement logic here
  }
}

export class DurabilityStrategy implements ISuggestionStrategy {
  score(component: any, requirements: any): number {
    // Logic chấm điểm ưu tiên độ bền
    return 0; // Implement logic here
  }
}

export class ContextEvaluator {
  private strategy: ISuggestionStrategy;

  constructor(strategy: ISuggestionStrategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: ISuggestionStrategy) {
    this.strategy = strategy;
  }

  public evaluate(components: any[], requirements: any) {
    return components
      .map((c) => ({
        component: c,
        score: this.strategy.score(c, requirements),
      }))
      .sort((a, b) => b.score - a.score);
  }
}
