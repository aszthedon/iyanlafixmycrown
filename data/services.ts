export type ServiceVariant = { id: string; name: string; price: number; durationMin?: number; };

export type Service = {
  id: string;
  name: string;
  category: string;
  baseDurationMin: number;
  startingPrice?: number;
  description?: string;
  variants?: ServiceVariant[];
  addonsHint?: string;
};

export const categories = [
  "Loc Maintenance",
  "Starter Locs",
  "Braids",
  "Natural Styles",
  "Kids Services",
  "Take Downs",
] as const;

export const services: Service[] = [
  {
    id: "loc-retwist",
    name: "Loc Retwist",
    category: "Loc Maintenance",
    baseDurationMin: 150,
    variants: [
      { id: "begin", name: "Beginner Length", price: 80 },
      { id: "shoulder-midback", name: "Shoulder–Mid Back", price: 100 },
      { id: "midback", name: "Mid Back", price: 120 },
      { id: "buttlength", name: "Butt Length", price: 160 },
    ],
  },
  {
    id: "kids-loc-retwist",
    name: "Kids Loc Retwist",
    category: "Kids Services",
    baseDurationMin: 150,
    variants: [
      { id: "begin", name: "Beginner Length", price: 70 },
      { id: "shoulder-midback", name: "Shoulder–Mid Back", price: 90 },
      { id: "midback", name: "Mid Back", price: 110 },
      { id: "buttlength", name: "Butt Length", price: 150 },
    ],
  },
  {
    id: "starter-locs",
    name: "Starter Locs",
    category: "Starter Locs",
    baseDurationMin: 180,
    startingPrice: 115,
    description: "I do not provide Micros or sister/brother Locs!",
  },
  {
    id: "kids-starter-locs",
    name: "Kids Starter Locs",
    category: "Kids Services",
    baseDurationMin: 180,
    startingPrice: 100,
  },
  {
    id: "knotless-braids",
    name: "Knotless Braids",
    category: "Braids",
    baseDurationMin: 390,
    variants: [
      { id: "jumbo", name: "Jumbo", price: 90 },
      { id: "large", name: "Large", price: 110 },
      { id: "medium", name: "Medium", price: 130 },
      { id: "small", name: "Small", price: 150 },
    ],
    addonsHint: "Hair provided, Boho options",
  },
  {
    id: "kids-knotless-braids",
    name: "Kids Knotless Braids",
    category: "Kids Services",
    baseDurationMin: 390,
    variants: [
      { id: "jumbo", name: "Jumbo", price: 60 },
      { id: "large", name: "Large", price: 80 },
      { id: "medium", name: "Medium", price: 100 },
      { id: "small", name: "Small", price: 120 },
    ],
    addonsHint: "Hair provided, Boho options",
  },
  {
    id: "box-braids",
    name: "Box Braids",
    category: "Braids",
    baseDurationMin: 390,
    variants: [
      { id: "jumbo", name: "Jumbo", price: 80 },
      { id: "large", name: "Large", price: 100 },
      { id: "medium", name: "Medium", price: 120 },
      { id: "small", name: "Small", price: 140 },
    ],
    addonsHint: "Hair provided, Boho options",
  },
  {
    id: "kids-box-braids",
    name: "Kids Box Braids",
    category: "Kids Services",
    baseDurationMin: 390,
    variants: [
      { id: "jumbo", name: "Jumbo", price: 50 },
      { id: "large", name: "Large", price: 70 },
      { id: "medium", name: "Medium", price: 90 },
      { id: "small", name: "Small", price: 110 },
    ],
    addonsHint: "Hair provided, Boho options",
  },
  {
    id: "singles",
    name: "Singles",
    category: "Natural Styles",
    baseDurationMin: 150,
    variants: [
      { id: "large", name: "Large", price: 50 },
      { id: "medium", name: "Medium", price: 70 },
      { id: "small", name: "Small", price: 90 },
    ],
    addonsHint: "Triangle parts +$15",
  },
  {
    id: "kids-singles",
    name: "Kids Singles",
    category: "Kids Services",
    baseDurationMin: 150,
    variants: [
      { id: "large", name: "Large", price: 30 },
      { id: "medium", name: "Medium", price: 50 },
      { id: "small", name: "Small", price: 70 },
    ],
    addonsHint: "Triangle parts +$15",
  },
  {
    id: "two-strand-twist",
    name: "Two-strand Twist",
    category: "Natural Styles",
    baseDurationMin: 150,
    variants: [
      { id: "large", name: "Large", price: 60 },
      { id: "medium", name: "Medium", price: 80 },
      { id: "small", name: "Small", price: 100 },
    ],
    addonsHint: "Triangle parts +$15",
  },
  {
    id: "braided-styles",
    name: "Braided Styles",
    category: "Natural Styles",
    baseDurationMin: 90,
    startingPrice: 80,
    description: "No hair added, straight backs.",
    addonsHint: "Style upgrade +$10",
  },
  {
    id: "kids-braided-styles",
    name: "Kids Braided Styles",
    category: "Kids Services",
    baseDurationMin: 90,
    startingPrice: 60,
    description: "No hair added, straight backs.",
    addonsHint: "Style upgrade +$10",
  },
  {
    id: "2-braids",
    name: "2 Braids",
    category: "Natural Styles",
    baseDurationMin: 60,
    startingPrice: 50,
    description: "No hair added.",
  },
  {
    id: "kids-2-braids",
    name: "Kids 2 Braids",
    category: "Kids Services",
    baseDurationMin: 60,
    startingPrice: 40,
  },
  {
    id: "takedown-locs",
    name: "Take Downs (Locs)",
    category: "Take Downs",
    baseDurationMin: 480,
    description: "Shoulder length $200, Mid-back $350, Butt length $500. Includes natural style after take down.",
  },
  {
    id: "takedown-knotless",
    name: "Take Down (Knotless)",
    category: "Take Downs",
    baseDurationMin: 180,
    variants: [
      { id: "jumbo", name: "Jumbo", price: 60 },
      { id: "medium", name: "Medium", price: 70 },
      { id: "small", name: "Small", price: 80 },
    ],
  },
  {
    id: "takedown-french-braids",
    name: "Take Downs (French Braids)",
    category: "Take Downs",
    baseDurationMin: 120,
    startingPrice: 60,
  },
];
