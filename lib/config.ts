import fs from "node:fs/promises";
import path from "node:path";

export type Config = {
  meta: { brandName: string; tagline: string; timezone: string };
  depositTiers: { minTotal: number; deposit: number }[];
  schedule: {
    bufferMinutes: number;
    slotStepMinutes: number;
    weeklyHours: Record<string, { start: string; end: string } | null>;
    blockedDates: string[];
  };
  addons: { id: string; name: string; price: number }[];
  services: any[];
  categories: string[];
};

const CONFIG_PATH = path.join(process.cwd(), "data", "config.json");

export async function readConfig(): Promise<Config> {
  const raw = await fs.readFile(CONFIG_PATH, "utf-8");
  return JSON.parse(raw) as Config;
}

export async function writeConfig(cfg: Config): Promise<void> {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(cfg, null, 2), "utf-8");
}
