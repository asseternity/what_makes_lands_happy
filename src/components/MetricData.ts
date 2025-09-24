export default class MetricData {
  MetricName: string;
  ActualValue: number; // normalized 0..1
  ExpectedValue: number; // normalized 0..1
  Difference: number;
  Weight: number; // signed correlation (weight_signed)
  WeightMagnitude: number; // optional magnitude

  constructor(metricName: string, actualValue: number, expectedValue: number) {
    this.MetricName = metricName;
    this.ActualValue = actualValue;
    this.ExpectedValue = expectedValue;
    this.Difference = this.ActualValue - this.ExpectedValue;
    this.Weight = 0;
    this.WeightMagnitude = 0;
  }

  // percent away from expected (signed)
  get PercentAwayFromExpected(): number {
    // avoid huge percents when expected ~ 0
    const safeDenom = Math.max(Math.abs(this.ExpectedValue), 0.05); // 5% floor
    return (this.Difference / safeDenom) * 100;
  }

  // effective percent for ranking strengths: accounts for correlation sign
  get EffectivePercent(): number {
    return this.PercentAwayFromExpected * Math.sign(this.Weight);
  }

  // final weighted score (use magnitude to scale importance)
  get WeightedDifference(): number {
    return (
      this.EffectivePercent * Math.abs(this.WeightMagnitude || this.Weight)
    );
  }
}
