import { Clock3, Radar, Users } from "lucide-react";

import type {
  CustomerProfileResponse,
  SalesTrendResponse,
  StoreProfileResponse,
} from "@/features/analytics/types/analytics";
import {
  getCompetitionLevel,
  getTopDowLabels,
  getTopHourLabels,
  getTopSegment,
} from "@/features/analytics/utils/market";

type Props = {
  storeProfile?: StoreProfileResponse;
  customerProfile?: CustomerProfileResponse;
  salesTrend?: SalesTrendResponse;
  isLoading: boolean;
};

const CARD_CLASS =
  "rounded-2xl border border-border/70 bg-white px-5 py-4 shadow-[0_8px_20px_rgba(16,32,51,0.05)]";

export function MarketInsightBoardSection({
  storeProfile,
  customerProfile,
  salesTrend,
  isLoading,
}: Props) {
  const competition = getCompetitionLevel(storeProfile?.peer_count ?? 0);
  const topSegment = getTopSegment(customerProfile?.customer_segments ?? []);
  const topHours = getTopHourLabels(salesTrend?.hour_points ?? []);
  const topDows = getTopDowLabels(salesTrend?.dow_points ?? []);

  return (
    <section className="space-y-3">
      <div>
        <p className="text-base font-bold text-slate-900">핵심 인사이트 보드</p>
        <p className="mt-1 text-sm text-slate-500">
          상권 경쟁도와 고객·시간대 포인트를 한 번에 확인합니다.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-3 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${CARD_CLASS} h-[128px] animate-pulse bg-slate-100`} />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-3">
          <article className={CARD_CLASS}>
            <div className="mb-2 flex items-center gap-2 text-slate-500">
              <Radar className="h-4 w-4" />
              <p className="text-xs font-semibold tracking-[0.08em]">상권 경쟁 강도</p>
            </div>
            <p className="text-lg font-bold text-slate-900">{competition.label}</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2454C8] to-[#5B8BFF]"
                style={{ width: `${competition.score}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">{competition.description}</p>
          </article>

          <article className={CARD_CLASS}>
            <div className="mb-2 flex items-center gap-2 text-slate-500">
              <Users className="h-4 w-4" />
              <p className="text-xs font-semibold tracking-[0.08em]">핵심 고객 타겟</p>
            </div>
            <p className="text-lg font-bold text-slate-900">
              {topSegment?.segmentName ?? "데이터 없음"}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {topSegment
                ? `전체 고객군 중 ${topSegment.ratioPct}% 비중`
                : "활성 고객 세그먼트 데이터가 아직 없습니다."}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {topSegment
                ? "이 고객군 중심으로 메시지/쿠폰을 우선 노출하세요."
                : "캠페인 마스터/고객 세그먼트 적재 여부를 확인하세요."}
            </p>
          </article>

          <article className={CARD_CLASS}>
            <div className="mb-2 flex items-center gap-2 text-slate-500">
              <Clock3 className="h-4 w-4" />
              <p className="text-xs font-semibold tracking-[0.08em]">집중 운영 시간</p>
            </div>
            <p className="text-lg font-bold text-slate-900">
              {topHours.length > 0 ? topHours.join(" · ") : "-"}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {topDows.length > 0 ? `강한 요일: ${topDows.join(", ")}` : "요일 데이터 없음"}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              피크 시간 전 60~90분 구간에 인력/생산을 선배치하면 대기 손실을 줄일 수 있습니다.
            </p>
          </article>
        </div>
      )}
    </section>
  );
}
