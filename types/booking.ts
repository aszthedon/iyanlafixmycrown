export type Slot = { date: string; start: string; end: string };

export type BookingTotals = { total: number; deposit: number; remaining: number };

export type BookingPayload = {
  serviceId: string;
  variantId?: string | null;
  addonIds: string[];
  slot: Slot;
  client: { name: string; phone: string; email: string; notes?: string };
  totals: BookingTotals;
  policyAck: boolean;
};
