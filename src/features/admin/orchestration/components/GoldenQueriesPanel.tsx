import { MOCK_RECOMMENDED_GOLDEN_QUERIES } from "@/features/admin/orchestration/mockdata/mock-orchestration";
import { useGoldenQueriesPanel } from "@/features/admin/orchestration/hooks/useGoldenQueriesPanel";
import type { SettingsModalKey } from "@/features/admin/orchestration/types/orchestration";

type Props = {
  onOpenModal: (key: SettingsModalKey) => void;
};

function getAgentBadge(agent: string) {
  if (agent === "생산관리") return "b bg";
  if (agent === "주문관리") return "b bb";
  if (agent === "매출관리") return "b bo";
  return "b bgy";
}

export function GoldenQueriesPanel({ onOpenModal }: Props) {
  const { goldenQueries, filteredQueries, searchText, setSearchText, addQuery, removeQuery } =
    useGoldenQueriesPanel();

  return (
    <section>
      <div className="pgh">
        <div className="pgh-l">
          <h1>골든 쿼리 관리</h1>
          <p>자주 사용되는 질의를 배치 임베딩하여 빠른 응답을 제공합니다</p>
        </div>
        <div className="pgh-r">
          <button
            type="button"
            className="btn btn-g btn-sm"
            onClick={() => onOpenModal("embed-schedule")}
          >
            배치 스케줄 설정
          </button>
          <button
            type="button"
            className="btn btn-p btn-sm"
            onClick={() => onOpenModal("embed-now")}
          >
            즉시 임베딩 실행
          </button>
        </div>
      </div>

      <div className="g4 mb-[12px]">
        <div className="metric !bg-white">
          <div className="ml">등록된 골든 쿼리</div>
          <div className="mv">
            {goldenQueries.length}
            <span>개</span>
          </div>
          <div className="ms">
            <span className="b bg">3개 Agent</span>
          </div>
        </div>
        <div className="metric !bg-white">
          <div className="ml">오늘 캐시 히트율</div>
          <div className="mv">
            38<span>%</span>
          </div>
          <div className="ms">
            <span className="b bb">▲ 5% 전주</span>
          </div>
        </div>
        <div className="metric !bg-white">
          <div className="ml">마지막 배치 임베딩</div>
          <div className="mv text-[15px]">
            02:00<span className="text-[11px]"> KST</span>
          </div>
          <div className="ms text-[11px] text-[var(--t3)]">2026-04-22 · 소요 4m22s</div>
        </div>
        <div className="metric !bg-white">
          <div className="ml">다음 배치 예정</div>
          <div className="mv text-[15px]">
            02:00<span className="text-[11px]"> KST</span>
          </div>
          <div className="ms text-[11px] text-[var(--t3)]">2026-04-23 (내일)</div>
        </div>
      </div>

      <div className="g2">
        <div className="card mb-0">
          <div className="ch">
            <span className="ct">감사 로그 기반 추천</span>
            <span className="b ba">등록 대기 7건</span>
            <button type="button" className="btn btn-p btn-sm ml-auto">
              전체 등록
            </button>
          </div>
          <p className="cd">최근 7일 감사 로그에서 5회 이상 반복된 질의를 자동 감지합니다.</p>
          <div className="tw mt-0">
            {MOCK_RECOMMENDED_GOLDEN_QUERIES.map((item, index) => (
              <div
                key={`${item.query}-${item.agent}`}
                className="flex items-start gap-[10px] border-b border-[var(--border2)] px-3 py-[9px]"
              >
                <span className="w-[22px] shrink-0 pt-[1px] text-[13px] font-bold text-[var(--t3)]">
                  #{index + 1}
                </span>
                <div className="flex-1">
                  <div className="mb-[3px] text-[12.5px] font-semibold text-[var(--text)]">
                    {item.query}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="sub text-[11px]">📊 {item.agent}</span>
                    <span className="sub text-[11px]">{Math.max(item.hits - 10, 0)}회/주</span>
                    <span className="sub text-[11px]">평균 1.{index + 1}s</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-p btn-sm"
                  onClick={() => addQuery(item.query, item.agent)}
                >
                  등록
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card mb-0">
          <div className="ch">
            <span className="ct">등록된 골든 쿼리</span>
            <span className="b bg">{goldenQueries.length}개 등록됨</span>
            <input
              className="si ml-auto max-w-[130px]"
              placeholder="검색..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="tw mt-0" id="gq-list">
            {filteredQueries.length === 0 ? (
              <div className="px-3 py-6 text-center text-[12px] text-[var(--t3)]">
                일치하는 골든 쿼리가 없습니다.
              </div>
            ) : (
              filteredQueries.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-[10px] border-b border-[var(--border2)] px-3 py-[9px]"
                >
                  <span
                    className={`w-[22px] shrink-0 pt-[1px] text-[13px] font-bold ${item.embedded ? "text-[var(--orange)]" : "text-[var(--t3)]"}`}
                  >
                    {item.embedded ? "★" : "☆"}
                  </span>
                  <div className="flex-1">
                    <div className="mb-[3px] text-[12.5px] font-semibold text-[var(--text)]">
                      {item.query}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`${getAgentBadge(item.agent)} text-[9.5px]`}>
                        {item.agent}
                      </span>
                      <span className="sub text-[11px]">히트율 {item.hits}%</span>
                      <span
                        className={`text-[11px] ${item.embedded ? "text-[var(--teal)]" : "text-[var(--amber)]"}`}
                      >
                        {item.embedded ? "임베딩 완료" : "재임베딩 필요"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-g btn-sm border-[#FFCECE] text-[var(--red)]"
                    onClick={() => removeQuery(item.id)}
                  >
                    삭제
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
