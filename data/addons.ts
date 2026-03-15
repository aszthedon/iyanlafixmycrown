export type Addon = { id: string; name: string; price: number; note?: string; };

export const addonsCatalog: Addon[] = [
  { id: "hair-provided", name: "Hair Provided", price: 20 },
  { id: "boho-added", name: "Boho Added", price: 20 },
  { id: "boho-provided", name: "Boho Provided", price: 40 },
  { id: "triangle-parts", name: "Triangle Parts", price: 15 },
  { id: "style-upgrade", name: "Style Upgrade", price: 10 },
];
