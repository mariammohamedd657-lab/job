import type { Config } from "./config";
import { solve, type Figures } from "./solver";

export type QuantificationStatus = "default" | "incomplete" | "complete";

// Completion measures the problem itself, not every optional calculation.
// Use resolved figures (including valid calculated values) and never treat blanks as zero.
export function quantificationStatus(config: Config, figures: Figures, confirmed: boolean): QuantificationStatus {
  if (!confirmed) return "default";
  const result = solve(config, figures);
  if (result.errors.length || result.blocked.size) return "incomplete";
  const has = (key: string) => Number.isFinite(result.values[key]) && !result.blocked.has(key);
  const positive = (key: string) => has(key) && result.values[key] > 0;
  // Overload is directly measured by required versus available employee hours.
  if (config.id === "problem-28") return has("hours") && has("target") ? "complete" : "incomplete";
  // A count is meaningful with a known population or observation period.
  const quantity = has("affected") && (has("total") || positive("days"));
  // Duration in months, comparison targets, and redundant percentages are optional.
  const time = !config.timePopulation || has(config.actualKey === "averageMinutes" ? "averageMinutes" : "hours");
  const money = !config.moneyPopulation || has("moneyTotal");
  return quantity && time && money ? "complete" : "incomplete";
}
