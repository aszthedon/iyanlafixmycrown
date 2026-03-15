import type { Config } from "@/lib/config";

export function computeDepositFromConfig(config: Config, total: number): number {
  // tiers should be sorted descending by minTotal; we'll handle safely
  const tiers = [...config.depositTiers].sort((a, b) => b.minTotal - a.minTotal);
  for (const t of tiers) {
    if (total >= t.minTotal) return t.deposit;
  }
  return 0;
}
