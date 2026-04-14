import type {
  ProductionAlert,
  ProductionAlertItem,
  ProductionOverviewItem,
  ProductionRegistrationForm,
  ProductionSkuItem,
  ProductionStatus,
  ProductionSummaryStat,
} from "@/features/production/types/production";

const DEFAULT_BASIS_TEXT = "산출 기준: 1시간 후 재고 소진 예측률 및 4주 평균 판매 기회 손실률 비교";

const parseProductionSlot = (slot: string) => {
  const [timeRaw, qtyRaw] = slot.split("/");
  const time = (timeRaw ?? "").trim() || "08:00";
  const qty = Number.parseInt((qtyRaw ?? "").replace(/[^0-9]/g, ""), 10);
  return {
    time,
    qty: Number.isFinite(qty) ? qty : 0,
  };
};

const toStatus = (status: string): ProductionStatus => {
  if (status === "danger" || status === "warning" || status === "safe") {
    return status;
  }
  return "safe";
};

const toChanceLossPct = (status: ProductionStatus, current: number, forecast: number) => {
  const gap = Math.max(forecast - current, 0);
  if (status === "danger") return Math.max(12, Math.min(25, gap * 3));
  if (status === "warning") return Math.max(5, Math.min(14, gap * 2));
  return 2;
};

const toSalesVelocity = (current: number, forecast: number) => {
  if (current <= 0) return 1;
  return Number((forecast / current).toFixed(2));
};

export const mapOverviewToSkuItems = (items: ProductionOverviewItem[]): ProductionSkuItem[] => {
  return items.map((item) => {
    const status = toStatus(item.status);
    const first = parseProductionSlot(item.prod1);
    const second = parseProductionSlot(item.prod2);
    const chanceLoss = toChanceLossPct(status, item.current, item.forecast);
    const salesVelocity = toSalesVelocity(item.current, item.forecast);
    const speedAlert = status !== "safe" && salesVelocity >= 0.7;
    const materialAlert = item.name.includes("초코") || item.name.toLowerCase().includes("choco");
    const tags = [
      ...(speedAlert ? ["속도↑"] : []),
      ...(materialAlert ? ["재료"] : []),
    ];

    return {
      sku_id: item.sku_id,
      sku_name: item.name,
      current_stock: item.current,
      forecast_stock_1h: item.forecast,
      avg_first_production_qty_4w: first.qty || item.recommended,
      avg_first_production_time_4w: first.time,
      avg_second_production_qty_4w: second.qty || Math.max(Math.round(item.recommended * 0.7), 0),
      avg_second_production_time_4w: second.time || "14:00",
      status,
      chance_loss_saving_pct: chanceLoss,
      speed_alert: speedAlert,
      speed_alert_message: speedAlert ? "평소 대비 판매 속도 상승 감지" : undefined,
      material_alert: materialAlert,
      material_alert_message: materialAlert ? `${item.name} 재료 소진 위험이 있습니다.` : undefined,
      recommended_production_qty: item.recommended,
      chance_loss_basis_text: DEFAULT_BASIS_TEXT,
      decision: {
        risk_level_label: status === "danger" ? "즉시생산" : status === "warning" ? "주의" : "정상",
        sales_velocity: salesVelocity,
        tags,
        alert_message:
          status === "danger"
            ? "1시간 내 품절 가능성이 높아 즉시 생산이 필요합니다."
            : status === "warning"
              ? "판매 속도가 높아 추가 생산 검토가 필요합니다."
              : "현재 재고가 안정적입니다.",
        can_produce: true,
        predicted_stockout_time: item.depletion_time === "-" ? null : item.depletion_time,
        suggested_production_qty: item.recommended,
        chance_loss_prevented_amount: chanceLoss > 0 ? chanceLoss * 3000 : null,
      },
    };
  });
};

export const mapSkuItemsToSummaryStats = (items: ProductionSkuItem[]): ProductionSummaryStat[] => {
  const dangerCount = items.filter((item) => item.status === "danger").length;
  const warningCount = items.filter((item) => item.status === "warning").length;
  const safeCount = items.filter((item) => item.status === "safe").length;
  const risky = items.filter((item) => item.status !== "safe");
  const avgChanceLoss =
    risky.length > 0 ? Math.round(risky.reduce((sum, item) => sum + item.chance_loss_saving_pct, 0) / risky.length) : 0;

  return [
    { key: "danger_count", label: "품절 위험", value: `${dangerCount}개`, tone: "danger" },
    { key: "warning_count", label: "주의 필요", value: `${warningCount}개`, tone: "primary" },
    { key: "safe_count", label: "안전 재고", value: `${safeCount}개`, tone: "success" },
    { key: "chance_loss_saving_total", label: "찬스 로스 절감", value: `${avgChanceLoss}%`, tone: "default" },
  ];
};

export const mapAlertsToUiAlerts = (
  items: ProductionSkuItem[],
  alerts: ProductionAlert[],
): ProductionAlertItem[] => {
  const converted: ProductionAlertItem[] = alerts.map((alert, index) => {
    const severity = alert.severity === "danger" ? "high" : "medium";
    const type = alert.severity === "danger" ? "inventory_risk" : "speed_risk";
    return {
      id: `alert-${alert.sku_id}-${index}`,
      type,
      severity,
      title: alert.push_title,
      description: alert.push_message,
      sku_id: alert.sku_id,
    };
  });

  const materialSku = items.find((item) => item.material_alert);
  if (materialSku) {
    converted.push({
      id: `alert-material-${materialSku.sku_id}`,
      type: "material_risk",
      severity: "medium",
      title: `${materialSku.sku_name} 재료 소진 위험`,
      description: materialSku.material_alert_message ?? "재료 주문 상태를 확인해 주세요.",
      sku_id: materialSku.sku_id,
      ingredient_id: "material",
    });
  }

  return converted;
};

export const mapSkuToRegistrationForm = (sku: ProductionSkuItem): ProductionRegistrationForm => ({
  sku_id: sku.sku_id,
  sku_name: sku.sku_name,
  current_stock: sku.current_stock,
  forecast_stock_1h: sku.forecast_stock_1h,
  recommended_qty: sku.recommended_production_qty ?? sku.avg_first_production_qty_4w,
  chance_loss_saving_pct: sku.chance_loss_saving_pct,
  chance_loss_basis_text: sku.chance_loss_basis_text ?? DEFAULT_BASIS_TEXT,
  predicted_stockout_time: sku.decision.predicted_stockout_time,
  can_produce: sku.decision.can_produce,
  sales_velocity: sku.decision.sales_velocity,
  tags: sku.decision.tags,
  alert_message: sku.decision.alert_message,
  material_alert: sku.material_alert,
  material_alert_message: sku.material_alert_message,
});
