import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, BarChart3, Clock, MessageCircle, Sparkles, Table2, Wrench, Zap } from "lucide-react";

import { PageHero, StatsGrid } from "@/components/common/page";
import { sessionUser } from "@/features/session/constants/session-user";
import {
  fetchProductionOverview,
  getProductionSimulationChartData,
  getProductionSimulationTimeline,
  saveProductionRegistration,
  runProductionSimulation,
  type ProductionItem,
  type ProductionSimulationResponse,
} from "@/lib/api";

type ProductionSku = {
  id: string;
  name: string;
  current: number;
  forecast: number;
  avgFirstQty: number;
  avgSecondQty: number;
  avgFirstTime: string;
  avgSecondTime: string;
  status: "danger" | "warning" | "safe";
  chanceLossSaving: number;
  speedAlert?: boolean;
  materialAlert?: boolean;
};

function parseQty(prodStr: string): number {
  const match = prodStr.match(/(\d+)개/);
  return match ? parseInt(match[1]) : 0;
}

function parseTime(prodStr: string): string {
  const match = prodStr.match(/(\d{2}:\d{2})/);
  return match ? match[1] : "08:00";
}

function toProductionSku(item: ProductionItem): ProductionSku {
  return {
    id: item.sku_id,
    name: item.name,
    current: item.current,
    forecast: item.forecast,
    avgFirstQty: parseQty(item.prod1) || item.recommended,
    avgSecondQty: parseQty(item.prod2) || Math.round(item.recommended * 0.75),
    avgFirstTime: parseTime(item.prod1),
    avgSecondTime: parseTime(item.prod2),
    status: item.status,
    chanceLossSaving: item.status === "danger" ? 15 : item.status === "warning" ? 8 : 2,
    speedAlert: item.status === "danger" && item.forecast <= Math.round(item.current * 0.25),
    materialAlert: false,
  };
}

function StatusBadge({ status }: { status: ProductionSku["status"] }) {
  const map = {
    danger: "border border-red-200 bg-red-50 text-red-600",
    warning: "border border-orange-200 bg-orange-50 text-orange-600",
    safe: "border border-green-200 bg-green-50 text-green-600",
  };
  const label = { danger: "위험", warning: "주의", safe: "안전" };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${map[status]}`}>
      {label[status]}
    </span>
  );
}

function formatMetricValue(value: number) {
  return value.toLocaleString("ko-KR");
}

function getSimulationMetaValue(metadata: Record<string, unknown>, key: string) {
  const value = metadata[key];
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? value : null;
}

function getBarWidth(value: number, maxValue: number) {
  if (maxValue <= 0) {
    return 0;
  }
  return Math.max(6, Math.round((value / maxValue) * 100));
}

export function ProductionPage() {
  const queryClient = useQueryClient();
  const [activeSku, setActiveSku] = useState<ProductionSku | null>(null);
  const [qty, setQty] = useState("48");
  const [showChat, setShowChat] = useState(false);
  const [simulationResult, setSimulationResult] = useState<ProductionSimulationResponse | null>(null);

  const { data: overview, isLoading, isError } = useQuery({
    queryKey: ["production-overview"],
    queryFn: fetchProductionOverview,
    refetchInterval: 5 * 60 * 1000,
  });

  const skus = useMemo<ProductionSku[]>(
    () => (overview?.items ?? []).map(toProductionSku),
    [overview],
  );

  const registerMutation = useMutation({
    mutationFn: saveProductionRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["production-overview"] });
      setActiveSku(null);
    },
  });

  const simulationMutation = useMutation({
    mutationFn: runProductionSimulation,
    onSuccess: (result) => setSimulationResult(result),
  });

  const simulationSeries = useMemo(() => getProductionSimulationChartData(simulationResult), [simulationResult]);
  const simulationTimeline = useMemo(() => getProductionSimulationTimeline(simulationResult), [simulationResult]);
  const simulationPeak = useMemo(
    () => simulationSeries.reduce((max, point) => Math.max(max, point.actual_stock, point.ai_guided_stock), 0),
    [simulationSeries],
  );

  const stats = useMemo(() => {
    const danger = skus.filter((s) => s.status === "danger").length;
    const warning = skus.filter((s) => s.status === "warning").length;
    const safe = skus.filter((s) => s.status === "safe").length;
    const avgChanceLoss =
      skus.length > 0
        ? Math.round(skus.reduce((sum, s) => sum + s.chanceLossSaving, 0) / skus.length)
        : 0;
    return [
      { label: "품절 위험", value: `${danger}개`, tone: "danger" as const },
      { label: "주의 필요", value: `${warning}개`, tone: "primary" as const },
      { label: "안전 재고", value: `${safe}개`, tone: "success" as const },
      { label: "찬스 로스 절감", value: `${avgChanceLoss}%`, tone: "default" as const },
    ];
  }, [skus]);

  const openRegister = (sku: ProductionSku) => {
    setActiveSku(sku);
    setQty(String(sku.avgFirstQty));
    setSimulationResult(null);
    simulationMutation.reset();
    simulationMutation.mutate({
      store_id: sessionUser.storeId,
      item_id: sku.id,
      simulation_date: new Date().toISOString().split("T")[0],
    });
  };

  const handleRegisterConfirm = () => {
    if (!activeSku) return;
    registerMutation.mutate({
      sku_id: activeSku.id,
      qty: parseInt(qty) || activeSku.avgFirstQty,
      registered_by: sessionUser.role,
      store_id: sessionUser.storeId,
    });
  };

  const dangerItem = skus.find((s) => s.status === "danger");
  const speedItem = skus.find((s) => s.speedAlert && s.status !== "danger");
  const materialItem = skus.find((s) => s.materialAlert);

  const updatedAt = overview?.updated_at ?? "";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHero
          title="생산관리"
          description="5분 단위 자동 갱신 재고와 1시간 후 예측, 4주 평균 생산 패턴을 기준으로 생산 필요 시점을 자동 감지합니다."
        />
        <div className="rounded-[28px] border border-border bg-white px-6 py-10 text-center text-sm text-slate-400 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          재고 현황 불러오는 중...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHero
          title="생산관리"
          description="5분 단위 자동 갱신 재고와 1시간 후 예측, 4주 평균 생산 패턴을 기준으로 생산 필요 시점을 자동 감지합니다."
        />
        <div className="rounded-[28px] border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-600">
          재고 현황을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHero
        title="생산관리"
        description="5분 단위 자동 갱신 재고와 1시간 후 예측, 4주 평균 생산 패턴을 기준으로 생산 필요 시점을 자동 감지합니다."
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-4 py-2 text-sm font-semibold text-[#2454C8]">
            <Clock className="h-4 w-4" />
            {updatedAt ? `마지막 갱신 ${updatedAt} · ` : ""}5분 단위 자동 갱신
          </div>
          <button
            type="button"
            onClick={() => setShowChat((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-[#dce4f3] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-[#bfd1ed] hover:text-[#2454C8]"
          >
            <MessageCircle className="h-4 w-4" />
            AI 질문하기
          </button>
        </div>
      </PageHero>

      {showChat ? (
        <section className="rounded-[28px] border border-[#dbe6fb] bg-white px-6 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <p className="text-sm font-bold text-slate-900">생산 관련 빠른 질문</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["지금 생산해야 할 품목은?", "찬스 로스를 어떻게 줄이나요?", "1시간 후 재고 예측 기준은?", "4주 평균 패턴은 어떻게 계산하나요?"].map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-full border border-[#dce4f3] bg-[#f7faff] px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-[#eef4ff] hover:text-[#2454C8]"
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        {dangerItem ? (
          <article className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-bold text-red-700">
                  긴급: {dangerItem.name} 재고 소진 {dangerItem.forecast <= 0 ? "임박" : `1시간 전`}
                </p>
                <p className="mt-1 text-sm text-red-600">
                  현재 {dangerItem.current}개, 1시간 후 {dangerItem.forecast}개 예상. 지금 생산하면 찬스 로스 {dangerItem.chanceLossSaving}% 감소 가능
                </p>
              </div>
              <button
                type="button"
                onClick={() => openRegister(dangerItem)}
                className="rounded-2xl bg-[#2454C8] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#1d44a8]"
              >
                생산하기
              </button>
            </div>
          </article>
        ) : null}

        {speedItem ? (
          <article className="rounded-[24px] border border-orange-200 bg-orange-50 px-5 py-4 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
            <div className="flex items-start gap-3">
              <Zap className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
              <div>
                <p className="text-base font-bold text-orange-700">
                  오늘 {speedItem.name} 소진 속도가 평소보다 빠릅니다
                </p>
                <p className="mt-1 text-sm text-orange-600">추가 생산 검토를 권장합니다.</p>
              </div>
            </div>
          </article>
        ) : null}

        {materialItem ? (
          <article className="rounded-[24px] border border-yellow-200 bg-yellow-50 px-5 py-4 shadow-[0_10px_24px_rgba(16,32,51,0.06)]">
            <div className="flex items-start gap-3">
              <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
              <div>
                <p className="text-base font-bold text-yellow-700">{materialItem.name} 재료 소진 주의</p>
                <p className="mt-1 text-sm text-yellow-700">생산 등록 전에 재료 주문 상태를 함께 확인하세요.</p>
              </div>
            </div>
          </article>
        ) : null}
      </section>

      <StatsGrid stats={stats} />

      <section className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="border-b border-border/60 px-6 py-5">
          <p className="text-lg font-bold text-slate-900">SKU별 생산 현황</p>
          <p className="mt-1 text-sm text-slate-500">현재 재고 · 1시간 후 예측 · 4주 평균 1차/2차 생산 패턴을 한눈에 확인합니다.</p>
        </div>
        {skus.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-slate-500">
            조회된 품목이 없습니다. 필터 조건이나 백엔드 응답을 확인해주세요.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-[#f8fbff] text-left">
                  <th className="px-6 py-3 text-xs font-bold text-slate-500">상태</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">품목명</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">현재 재고</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">1시간 후 예측</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">4주 평균 1차</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">4주 평균 2차</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">찬스 로스 절감</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500">알림</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-500"></th>
                </tr>
              </thead>
              <tbody>
                {skus.map((sku) => (
                  <tr
                    key={sku.id}
                    className={`border-b border-border/30 last:border-0 ${sku.status === "danger" ? "bg-red-50/30" : "hover:bg-[#f8fbff]"}`}
                  >
                    <td className="px-6 py-4"><StatusBadge status={sku.status} /></td>
                    <td className="px-4 py-4 font-semibold text-slate-800">{sku.name}</td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-900">{sku.current}개</div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-[#2454C8]" style={{ width: `${Math.min((sku.current / 60) * 100, 100)}%` }} />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`font-bold ${sku.status === "danger" ? "text-red-600" : sku.status === "warning" ? "text-orange-600" : "text-green-600"}`}>
                        {sku.forecast}개
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-800">{sku.avgFirstQty}개</div>
                      <div className="text-xs text-slate-400">{sku.avgFirstTime}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-800">{sku.avgSecondQty}개</div>
                      <div className="text-xs text-slate-400">{sku.avgSecondTime}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-[#2454C8]">-{sku.chanceLossSaving}%</div>
                      <div className="mt-1 text-[11px] text-slate-400">1시간 후 재고 예측 및 4주 평균 손실률 기준</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {sku.speedAlert ? <span className="rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-[11px] font-bold text-orange-600">속도↑</span> : null}
                        {sku.materialAlert ? <span className="rounded-full border border-yellow-200 bg-yellow-50 px-2 py-1 text-[11px] font-bold text-yellow-700">재료</span> : null}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => openRegister(sku)}
                        className={`rounded-2xl px-4 py-2 text-sm font-bold transition-colors ${
                          sku.status === "danger"
                            ? "bg-[#2454C8] text-white hover:bg-[#1d44a8]"
                            : "border border-[#dce4f3] bg-[#f7faff] text-slate-700 hover:bg-[#eef4ff] hover:text-[#2454C8]"
                        }`}
                      >
                        생산
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {activeSku ? (
        <section className="rounded-[28px] border border-[#dbe6fb] bg-white px-6 py-6 shadow-[0_18px_36px_rgba(16,32,51,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-bold text-slate-900">생산 등록</p>
              <p className="mt-1 text-sm text-slate-500">추천 수량은 4주 평균 생산 패턴을 기준으로 계산했습니다.</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveSku(null)}
              className="rounded-2xl border border-[#dce4f3] bg-[#f7faff] px-3 py-2 text-sm font-semibold text-slate-600"
            >
              닫기
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[#f8fbff] px-4 py-4">
              <p className="text-xs font-bold text-slate-400">품목</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{activeSku.name}</p>
            </div>
            <div className="rounded-2xl bg-[#f8fbff] px-4 py-4">
              <p className="text-xs font-bold text-slate-400">생산 수량</p>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#dce4f3] bg-white px-4 py-3 text-base font-semibold text-slate-800 outline-none focus:border-[#2454C8]"
              />
              <p className="mt-2 text-xs text-slate-500">추천 수량 {activeSku.avgFirstQty}개 · 4주 평균 1차 생산 기준</p>
            </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4">
              <p className="text-xs font-bold text-red-500">현재 재고 / 1시간 후 예측</p>
              <p className="mt-1 text-sm text-red-700">{activeSku.current}개 → {activeSku.forecast}개 예상</p>
            </div>
            <div className="rounded-2xl border border-[#dbe6fb] bg-[#edf4ff] px-4 py-4">
              <p className="text-xs font-bold text-[#2454C8]">찬스 로스 감소 효과</p>
              {simulationMutation.isPending ? (
                <p className="mt-1 text-sm text-slate-400">AI 분석 중...</p>
              ) : simulationResult ? (
                <>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    순이익 변화{" "}
                    <span className={simulationResult.summary_metrics.net_profit_change >= 0 ? "text-[#2454C8]" : "text-red-600"}>
                      {simulationResult.summary_metrics.net_profit_change >= 0 ? "+" : ""}
                      {formatMetricValue(simulationResult.summary_metrics.net_profit_change)}원
                    </span>
                  </p>
                  {simulationResult.summary_metrics.chance_loss_reduction != null ? (
                    <p className="mt-1 text-xs text-slate-500">
                      찬스로스 회복 가능액 {formatMetricValue(simulationResult.summary_metrics.chance_loss_reduction)}원
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="mt-1 text-sm text-slate-700">지금 생산 시 {activeSku.chanceLossSaving}% 감소 예상</p>
              )}
              <p className="mt-2 text-xs text-slate-500">산출 기준: 1시간 후 재고 소진 예측률 및 4주 평균 판매 기회 손실률 비교</p>
            </div>
          </div>

          {activeSku.materialAlert ? (
            <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm text-yellow-800">
              재료 부족 경고가 있습니다. 생산 등록 전에 재료 주문 상태를 함께 확인하세요.
            </div>
          ) : null}

          {simulationMutation.isError ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  시뮬레이션 실행에 실패했습니다.
                  {simulationMutation.error instanceof Error && simulationMutation.error.message ? ` ${simulationMutation.error.message}` : " 잠시 후 다시 시도해주세요."}
                </p>
              </div>
            </div>
          ) : null}

          {registerMutation.isError ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  생산 등록에 실패했습니다.
                  {registerMutation.error instanceof Error && registerMutation.error.message ? ` ${registerMutation.error.message}` : " 다시 시도해주세요."}
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-6 rounded-[24px] border border-[#dbe6fb] bg-[#f8fbff] px-5 py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-base font-bold text-slate-900">시뮬레이션 결과</p>
                <p className="mt-1 text-sm text-slate-500">실재고와 AI 가이드 시나리오를 표와 간단 시각 블록으로 비교합니다.</p>
              </div>
              {simulationResult ? (
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                    simulationResult.summary_metrics.performance_status === "POSITIVE"
                      ? "border border-green-200 bg-green-50 text-green-700"
                      : "border border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {simulationResult.summary_metrics.performance_status === "POSITIVE" ? "개선 시나리오" : "주의 시나리오"}
                </span>
              ) : null}
            </div>

            {simulationMutation.isPending ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {["분석 중", "차트 생성", "손익 비교", "액션 정리"].map((item) => (
                  <div key={item} className="animate-pulse rounded-2xl border border-[#dce4f3] bg-white px-4 py-4">
                    <div className="h-3 w-16 rounded-full bg-slate-100" />
                    <div className="mt-3 h-6 w-20 rounded-full bg-slate-100" />
                    <div className="mt-2 h-3 w-24 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : simulationResult ? (
              <>
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-[#dce4f3] bg-white px-4 py-4">
                    <p className="text-xs font-bold text-slate-400">추가 판매 수량</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{formatMetricValue(simulationResult.summary_metrics.additional_sales_qty)}</p>
                  </div>
                  <div className="rounded-2xl border border-[#dce4f3] bg-white px-4 py-4">
                    <p className="text-xs font-bold text-slate-400">추가 이익</p>
                    <p className="mt-2 text-xl font-bold text-[#2454C8]">+{formatMetricValue(simulationResult.summary_metrics.additional_profit_amt)}원</p>
                  </div>
                  <div className="rounded-2xl border border-[#dce4f3] bg-white px-4 py-4">
                    <p className="text-xs font-bold text-slate-400">추가 폐기</p>
                    <p className="mt-2 text-xl font-bold text-red-600">+{formatMetricValue(simulationResult.summary_metrics.additional_waste_qty)}</p>
                    <p className="mt-1 text-xs text-slate-500">폐기 비용 {formatMetricValue(simulationResult.summary_metrics.additional_waste_cost)}원</p>
                  </div>
                  <div className="rounded-2xl border border-[#dce4f3] bg-white px-4 py-4">
                    <p className="text-xs font-bold text-slate-400">순이익 변화</p>
                    <p className={`mt-2 text-xl font-bold ${simulationResult.summary_metrics.net_profit_change >= 0 ? "text-[#2454C8]" : "text-red-600"}`}>
                      {simulationResult.summary_metrics.net_profit_change >= 0 ? "+" : ""}
                      {formatMetricValue(simulationResult.summary_metrics.net_profit_change)}원
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]">
                  <div className="rounded-2xl border border-[#dce4f3] bg-white px-4 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900">시각 블록</p>
                        <p className="text-xs text-slate-500">시간대별 실재고와 AI 가이드 재고를 비교합니다.</p>
                      </div>
                      <BarChart3 className="h-4 w-4 text-[#2454C8]" />
                    </div>

                    {simulationSeries.length > 0 ? (
                      <div className="mt-4 space-y-3">
                        {simulationSeries.map((point) => (
                          <div key={`${point.time}-${point.actual_stock}-${point.ai_guided_stock}`} className="space-y-2 rounded-2xl bg-[#f8fbff] px-3 py-3">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                              <span>{point.time}</span>
                              <span className="text-slate-400">실재고 / AI 가이드</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="w-12 text-[11px] font-bold text-slate-400">실재고</span>
                              <div className="h-2 flex-1 rounded-full bg-slate-100">
                                <div
                                  className="h-2 rounded-full bg-slate-400"
                                  style={{ width: `${getBarWidth(point.actual_stock, simulationPeak)}%` }}
                                />
                              </div>
                              <span className="w-12 text-right text-xs font-semibold text-slate-700">{formatMetricValue(point.actual_stock)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="w-12 text-[11px] font-bold text-[#2454C8]">AI</span>
                              <div className="h-2 flex-1 rounded-full bg-[#e6efff]">
                                <div
                                  className="h-2 rounded-full bg-[#2454C8]"
                                  style={{ width: `${getBarWidth(point.ai_guided_stock, simulationPeak)}%` }}
                                />
                              </div>
                              <span className="w-12 text-right text-xs font-semibold text-[#2454C8]">{formatMetricValue(point.ai_guided_stock)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-2xl border border-dashed border-[#dce4f3] bg-[#fbfdff] px-4 py-8 text-center text-sm text-slate-500">
                        시각화할 시뮬레이션 데이터가 없습니다.
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-[#dce4f3] bg-white px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#2454C8]" />
                        <p className="text-sm font-bold text-slate-900">메타 정보</p>
                      </div>
                      <dl className="mt-3 space-y-2 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-slate-500">매장</dt>
                          <dd className="font-semibold text-slate-800">{getSimulationMetaValue(simulationResult.metadata, "store_id") ?? sessionUser.storeId}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-slate-500">품목</dt>
                          <dd className="font-semibold text-slate-800">{getSimulationMetaValue(simulationResult.metadata, "item_name") ?? activeSku.name}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-slate-500">기준일</dt>
                          <dd className="font-semibold text-slate-800">{getSimulationMetaValue(simulationResult.metadata, "date") ?? "-"}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-slate-500">상태</dt>
                          <dd className="font-semibold text-slate-800">{getSimulationMetaValue(simulationResult.metadata, "stub") ? "스텁 응답" : "실제 응답"}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="rounded-2xl border border-[#dce4f3] bg-white px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Table2 className="h-4 w-4 text-[#2454C8]" />
                        <p className="text-sm font-bold text-slate-900">액션 타임라인</p>
                      </div>
                      {simulationTimeline.length > 0 ? (
                        <ul className="mt-3 space-y-2">
                          {simulationTimeline.map((item) => (
                            <li key={item} className="rounded-2xl bg-[#f8fbff] px-3 py-2 text-sm text-slate-700">
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="mt-3 rounded-2xl border border-dashed border-[#dce4f3] bg-[#fbfdff] px-4 py-6 text-center text-sm text-slate-500">
                          액션 로그가 없습니다.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-[#dce4f3] bg-white">
                  <div className="border-b border-[#dce4f3] px-4 py-3">
                    <p className="text-sm font-bold text-slate-900">시뮬레이션 표</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-[720px] w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#e8eef8] bg-[#f8fbff] text-left text-xs font-bold text-slate-500">
                          <th className="px-4 py-3">시간</th>
                          <th className="px-4 py-3">실재고</th>
                          <th className="px-4 py-3">AI 가이드 재고</th>
                          <th className="px-4 py-3">차이</th>
                          <th className="px-4 py-3">해석</th>
                        </tr>
                      </thead>
                      <tbody>
                        {simulationSeries.map((point) => {
                          const gap = point.ai_guided_stock - point.actual_stock;
                          return (
                            <tr key={`${point.time}-table`} className="border-b border-[#eef3fb] last:border-0">
                              <td className="px-4 py-3 font-semibold text-slate-800">{point.time}</td>
                              <td className="px-4 py-3 text-slate-700">{formatMetricValue(point.actual_stock)}</td>
                              <td className="px-4 py-3 text-[#2454C8]">{formatMetricValue(point.ai_guided_stock)}</td>
                              <td className={`px-4 py-3 font-semibold ${gap >= 0 ? "text-[#2454C8]" : "text-red-600"}`}>
                                {gap >= 0 ? "+" : ""}
                                {formatMetricValue(gap)}
                              </td>
                              <td className="px-4 py-3 text-slate-500">
                                {gap >= 0 ? "AI 가이드가 재고를 더 확보합니다." : "실재고가 AI 가이드보다 높습니다."}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-[#dce4f3] bg-white px-4 py-8 text-center text-sm text-slate-500">
                품목을 선택하면 시뮬레이션 결과가 이 영역에 표시됩니다.
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveSku(null)}
              className="rounded-2xl border border-[#dce4f3] bg-[#f7faff] px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-[#eef4ff] hover:text-[#2454C8]"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleRegisterConfirm}
              disabled={registerMutation.isPending}
              className="rounded-2xl bg-[#2454C8] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1d44a8] disabled:opacity-60"
            >
              {registerMutation.isPending ? "저장 중..." : "생산 등록"}
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
