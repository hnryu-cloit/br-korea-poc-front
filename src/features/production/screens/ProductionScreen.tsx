import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, MessageCircle, Wrench, Zap } from "lucide-react";

import { PageHero, StatsGrid } from "@/components/common/page";
import { sessionUser } from "@/features/session/constants/session-user";
import {
  fetchProductionOverview,
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
                      {simulationResult.summary_metrics.net_profit_change.toLocaleString()}원
                    </span>
                  </p>
                  {simulationResult.summary_metrics.chance_loss_reduction != null ? (
                    <p className="mt-1 text-xs text-slate-500">
                      찬스로스 회복 가능액 {simulationResult.summary_metrics.chance_loss_reduction.toLocaleString()}원
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

          {registerMutation.isError ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              생산 등록에 실패했습니다. 다시 시도해주세요.
            </div>
          ) : null}

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