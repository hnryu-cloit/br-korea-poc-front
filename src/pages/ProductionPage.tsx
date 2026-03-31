import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle, Clock, TrendingDown } from "lucide-react";

import { productionStats } from "@/data/page-content";
import { SectionHint } from "@/components/ui/SectionHint";
import { PageHero, StatsGrid } from "@/pages/shared";
import { useDemoSession } from "@/contexts/useDemoSession";
import {
  fetchProductionRegistrationHistory,
  fetchProductionOverview,
  saveProductionRegistration,
  type ProductionItem,
  type ProductionRegistrationResponse,
} from "@/lib/api";

type StockStatus = "danger" | "warning" | "safe";

const statusConfig: Record<StockStatus, { label: string; className: string }> = {
  danger: { label: "지금 만들어야 해요", className: "bg-red-50 text-red-600 border border-red-100" },
  warning: { label: "곧 필요해요", className: "bg-orange-50 text-orange-600 border border-orange-100" },
  safe: { label: "충분해요", className: "bg-green-50 text-green-600 border border-green-100" },
};

type RegisteredItem = {
  skuId: string;
  qty: number;
  registeredAt: string;
  feedbackMessage: string;
};

function formatRegisteredAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ProductionPage() {
  const { user } = useDemoSession();
  const [registered, setRegistered] = useState<RegisteredItem[]>([]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [qty, setQty] = useState<string>("40");
  const productionQuery = useQuery({
    queryKey: ["production-overview"],
    queryFn: fetchProductionOverview,
  });
  const registrationHistoryQuery = useQuery({
    queryKey: ["production-registration-history"],
    queryFn: () => fetchProductionRegistrationHistory(20),
  });

  const registrationMutation = useMutation({
    mutationFn: saveProductionRegistration,
    onSuccess: (data: ProductionRegistrationResponse) => {
      const now = new Date();
      const registeredAt = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      setRegistered((current) => [
        ...current.filter((item) => item.skuId !== data.sku_id),
        {
          skuId: data.sku_id,
          qty: data.qty,
          registeredAt,
          feedbackMessage: data.feedback_message,
        },
      ]);
      setActiveModal(null);
    },
  });

  useEffect(() => {
    if (registered.length > 0 || !registrationHistoryQuery.data) {
      return;
    }

    setRegistered(
      registrationHistoryQuery.data.items.map((entry) => ({
        skuId: entry.sku_id,
        qty: entry.qty,
        registeredAt: formatRegisteredAt(entry.registered_at),
        feedbackMessage: entry.feedback_message,
      })),
    );
  }, [registered.length, registrationHistoryQuery.data]);

  const items = productionQuery.data?.items ?? [];
  const activeSku = useMemo(
    () => items.find((item) => item.sku_id === activeModal),
    [activeModal, items],
  );

  const isRegistered = (id: string) => registered.some((entry) => entry.skuId === id);

  const dangerCount = items.filter((item) => item.status === "danger" && !isRegistered(item.sku_id)).length;

  const handleRegister = () => {
    if (!activeModal || registrationMutation.isPending) {
      return;
    }
    const parsedQty = Number(qty);
    if (!Number.isFinite(parsedQty) || parsedQty < 1) {
      return;
    }
    registrationMutation.mutate({
      sku_id: activeModal,
      qty: parsedQty,
      registered_by: user.role,
    });
  };

  const openModal = (sku: ProductionItem) => {
    setQty(String(sku.recommended));
    setActiveModal(sku.sku_id);
  };

  if (productionQuery.isLoading) {
    return (
      <div className="space-y-6">
        <PageHero
          title="생산 현황을 불러오고 있습니다."
          description="백엔드에서 재고와 생산 추천 데이터를 조회 중입니다."
        />
        <section className="rounded-[28px] border border-border bg-white px-8 py-10 text-sm text-slate-500 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          생산 데이터를 가져오는 중입니다...
        </section>
      </div>
    );
  }

  if (productionQuery.isError) {
    return (
      <div className="space-y-6">
        <PageHero
          title="생산 현황을 불러오지 못했습니다."
          description="백엔드 연결 상태를 확인한 뒤 다시 시도해 주세요."
        />
        <section className="rounded-[28px] border border-red-200 bg-red-50 px-8 py-8 text-sm text-red-600 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          {(productionQuery.error as Error).message}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHero
        title="생산 현황"
        description="지금 만들어야 할 도넛을 한눈에 확인하세요."
      >
        {dangerCount > 0 ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
            <AlertTriangle className="h-4 w-4" />
            지금 바로 만들어야 할 품목이 {dangerCount}개 있어요
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-600">
            <CheckCircle className="h-4 w-4" />
            모든 품목 재고가 충분해요
          </div>
        )}
      </PageHero>

      <StatsGrid stats={productionStats} />

      <section className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 px-6 py-5">
          <p className="text-base font-bold text-slate-900">품목별 재고 현황</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-[#dce4f3] bg-[#f7faff] px-3 py-1.5 text-xs font-medium text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              {productionQuery.data?.production_lead_time_minutes}분 단위 판단 · {productionQuery.data?.updated_at} 기준
            </div>
            <SectionHint questions={[
              { q: "왜 빨간색으로 표시되나요?", a: "1시간 뒤에 재고가 거의 다 떨어질 것 같은 품목이에요. 지금 만들기 시작해야 제 시간에 진열할 수 있어요.", data: ["생산하는 데 보통 약 1시간이 걸려요", "재고가 0이 되면 손님이 못 사가요"] },
              { q: "1시간 뒤 예상은 어떻게 계산하나요?", a: "오늘 판매 속도를 보고 앞으로 1시간 동안 얼마나 팔릴지 계산해요. 날씨나 요일 패턴도 반영돼요.", data: ["오늘 판매 속도 기반", "최근 4주 같은 요일 평균 참고"] },
              { q: "생산 등록은 어떻게 하나요?", a: "빨간색 품목 오른쪽에 있는 '생산 등록' 버튼을 누르시면 돼요. 수량은 자동으로 추천해 드려요." },
            ]} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-[#f8fbff]">
                <th className="px-6 py-3 text-left text-[12px] font-semibold text-slate-500">품목</th>
                <th className="px-4 py-3 text-right text-[12px] font-semibold text-slate-500">지금 재고</th>
                <th className="px-4 py-3 text-right text-[12px] font-semibold text-slate-500">1시간 뒤 예상</th>
                <th className="px-4 py-3 text-center text-[12px] font-semibold text-slate-500">소진 예상 시각</th>
                <th className="px-4 py-3 text-center text-[12px] font-semibold text-slate-500">상태</th>
                <th className="px-4 py-3 text-center text-[12px] font-semibold text-slate-500"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((sku) => {
                const reg = registered.find((entry) => entry.skuId === sku.sku_id);
                const cfg = statusConfig[sku.status];
                return (
                  <tr key={sku.sku_id} className={`border-b border-border/30 transition-colors last:border-0 ${sku.status === "danger" && !reg ? "bg-red-50/30" : "hover:bg-[#f8fbff]"}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        {sku.status === "danger" && !reg ? (
                          <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                        ) : reg ? (
                          <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                        <div>
                          <span className="font-semibold text-slate-800">{sku.name}</span>
                          {sku.status === "danger" && !reg && sku.alert_message ? (
                            <p className="mt-0.5 text-xs text-red-500">{sku.alert_message}</p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-lg font-bold text-slate-800">{sku.current}개</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={`text-lg font-bold ${sku.status === "danger" ? "text-red-600" : sku.status === "warning" ? "text-orange-500" : "text-slate-700"}`}>
                        {sku.forecast}개
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {sku.depletion_time !== "-" ? (
                        <span className="font-semibold text-red-500">{sku.depletion_time}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${reg ? "border border-green-100 bg-green-50 text-green-600" : cfg.className}`}>
                        {reg ? "등록 완료" : cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {sku.status !== "safe" && !reg ? (
                        <button
                          type="button"
                          onClick={() => openModal(sku)}
                          className="rounded-xl bg-[#2454C8] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#1d44a8]"
                        >
                          생산 등록
                        </button>
                      ) : reg ? (
                        <div className="text-sm font-medium text-green-600">{reg.qty}개 · {reg.registeredAt}</div>
                      ) : (
                        <span className="text-xs text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-bold text-slate-900">최근 4주 생산 패턴</p>
              <p className="mt-1 text-sm text-slate-400">오늘 판매 속도가 평소보다 12% 빠릅니다</p>
            </div>
            <SectionHint questions={[
              { q: "1차, 2차 생산이 뭔가요?", a: "하루에 보통 두 번 도넛을 만들어요. 오전에 한 번(1차), 오후에 한 번(2차)이에요. 시간과 수량은 지난 4주 평균이에요." },
              { q: "오늘 왜 더 빨리 팔리나요?", a: "오늘 판매 속도가 평소 같은 요일보다 12% 빠르게 팔리고 있어요. 날씨나 근처 행사 영향일 수 있어요." },
            ]} />
          </div>
          <div className="mt-5 space-y-3">
            {items.filter((item) => item.status !== "safe").map((sku) => (
              <div key={sku.sku_id} className="rounded-2xl bg-[#f8fbff] px-4 py-3">
                <p className="text-sm font-bold text-slate-800">{sku.name}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500">
                  <div className="rounded-xl bg-white px-3 py-2">
                    <span className="text-slate-400">1차 생산</span>
                    <p className="mt-0.5 font-semibold text-slate-700">{sku.prod1}</p>
                  </div>
                  <div className="rounded-xl bg-white px-3 py-2">
                    <span className="text-slate-400">2차 생산</span>
                    <p className="mt-0.5 font-semibold text-slate-700">{sku.prod2}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-bold text-slate-900">생산 등록 결과</p>
              <p className="mt-1 text-sm text-slate-400">재고가 떨어지기 전에 등록하면 매출 손실을 줄일 수 있어요</p>
            </div>
            <SectionHint questions={[
              { q: "매출 손실이 뭔가요?", a: "도넛이 다 떨어졌을 때 사러 오신 손님이 그냥 가시면 그만큼 못 번 돈이에요. 제때 만들면 이 손실을 줄일 수 있어요." },
              { q: "10%는 어떻게 계산되나요?", a: "재고가 없어서 못 판 수량을 기준으로 계산해요. 시간에 맞게 생산 등록하시면 이 숫자가 줄어들어요." },
            ]} />
          </div>
          <div className="mt-5 space-y-3">
            {registered.length === 0 ? (
              <div className="rounded-2xl bg-[#f8fbff] px-4 py-8 text-center">
                <TrendingDown className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-400">생산 등록 후 결과가 여기에 표시돼요</p>
              </div>
            ) : (
              registered.map((entry) => {
                const sku = items.find((item) => item.sku_id === entry.skuId);
                return (
                  <div key={entry.skuId} className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-bold text-green-800">{sku?.name}</span>
                      </div>
                      <span className="text-sm font-bold text-green-600">매출 손실 10% 감소</span>
                    </div>
                    <p className="mt-1 text-xs text-green-600">{entry.registeredAt} 등록 · {entry.qty}개 · {entry.feedbackMessage}</p>
                  </div>
                );
              })
            )}
          </div>
        </article>
      </section>

      {activeModal && activeSku ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
            aria-label="닫기"
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-[380px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_32px_80px_rgba(16,32,51,0.18)]">
            <div className="bg-[linear-gradient(135deg,#1f4dbb_0%,#55a0ff_100%)] px-6 py-5 text-white">
              <p className="text-sm font-semibold text-white/70">{activeSku.name} 생산 등록</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-white/10 px-3 py-2.5">
                  <p className="text-xs text-white/60">지금 재고</p>
                  <p className="text-lg font-bold">{activeSku.current}개</p>
                </div>
                <div className="rounded-xl bg-white/10 px-3 py-2.5">
                  <p className="text-xs text-white/60">1시간 뒤 예상</p>
                  <p className="text-lg font-bold text-red-200">{activeSku.forecast}개</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 px-6 py-5">
              {activeSku.alert_message ? (
                <div className="flex items-start gap-2 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-orange-500 mt-0.5" />
                  <p className="text-xs leading-5 text-orange-700">{activeSku.alert_message}</p>
                </div>
              ) : null}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  몇 개 만들까요?
                </label>
                <p className="mb-3 text-xs text-slate-400">AI가 추천한 수량이에요. 바꾸셔도 됩니다.</p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQty((current) => String(Math.max(1, Number(current) - 4)))}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#dce4f3] bg-[#f7faff] text-xl font-bold text-slate-600 hover:bg-[#eef4ff]"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={qty}
                    onChange={(event) => setQty(event.target.value)}
                    className="flex-1 rounded-xl border border-[#dce4f3] bg-[#f7faff] px-4 py-3 text-center text-xl font-bold text-slate-800 focus:border-primary focus:outline-none"
                    min="1"
                  />
                  <button
                    type="button"
                    onClick={() => setQty((current) => String(Number(current) + 4))}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#dce4f3] bg-[#f7faff] text-xl font-bold text-slate-600 hover:bg-[#eef4ff]"
                  >
                    +
                  </button>
                </div>
              </div>
              {registrationMutation.isError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {(registrationMutation.error as Error).message}
                </div>
              ) : null}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 rounded-xl border border-[#dce4f3] bg-[#f7faff] py-3.5 text-sm font-semibold text-slate-600 hover:bg-[#eef4ff]"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={registrationMutation.isPending}
                  className="flex-1 rounded-xl bg-[#2454C8] py-3.5 text-sm font-bold text-white hover:bg-[#1d44a8] disabled:opacity-50"
                >
                  {registrationMutation.isPending ? "등록 중..." : "등록 완료"}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
