export type StoreOrderItem = {
  store: string;
  region: string;
  option: string;
  basis: string;
  reason: string;
  submitted_at: string;
  status: "normal" | "review" | "risk";
};

export type CoachingTip = {
  store: string;
  tip: string;
};

export type HQCoachingResponse = {
  store_orders: StoreOrderItem[];
  coaching_tips: CoachingTip[];
};
