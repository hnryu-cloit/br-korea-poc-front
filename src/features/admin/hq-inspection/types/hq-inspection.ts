export type StoreInspectionItem = {
  store: string;
  region: string;
  alert_response_rate: number;
  production_registered: number;
  production_total: number;
  chance_loss_change: string;
  status: "compliant" | "partial" | "noncompliant";
};

export type HQInspectionResponse = {
  items: StoreInspectionItem[];
};
