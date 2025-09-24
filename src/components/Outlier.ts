export default class OutlierData {
  IsStrength: boolean;
  IsWeakness: boolean;
  MetricName: string;
  DisplayPercent: number; // signed percent for UI
  Score: number; // WeightedDifference for ranking

  constructor(
    isStrength: boolean,
    isWeakness: boolean,
    metricName: string,
    displayPercent: number,
    score: number
  ) {
    this.IsStrength = isStrength;
    this.IsWeakness = isWeakness;
    this.MetricName = metricName;
    this.DisplayPercent = displayPercent;
    this.Score = score;
  }
}
