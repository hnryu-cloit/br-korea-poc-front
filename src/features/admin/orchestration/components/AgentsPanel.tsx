import { useNavigate } from "react-router-dom";

import { PANEL_PATH_MAP } from "@/features/admin/orchestration/constants/orchestration";
import type { SettingsModalKey } from "@/features/admin/orchestration/types/orchestration";

type Props = {
  onOpenModal: (key: SettingsModalKey) => void;
};

type AgentCard = {
  name: string;
  id: string;
  statusLabel: string;
  statusClass: string;
  version: string;
  model: string;
  tools: string[];
  accuracy: number;
  calls: number;
  trendText?: string;
  urgent?: boolean;
};

const AGENT_CARDS: AgentCard[] = [
  {
    name: "생산관리 Agent",
    id: "production-agent",
    statusLabel: "운영 중",
    statusClass: "bg",
    version: "v3.2.1",
    model: "Claude 3.5 Sonnet",
    tools: ["NL2SQL", "RAG"],
    accuracy: 91,
    calls: 148,
  },
  {
    name: "주문관리 Agent",
    id: "ordering-agent",
    statusLabel: "운영 중",
    statusClass: "bg",
    version: "v3.2.0",
    model: "Claude 3 Haiku",
    tools: ["NL2SQL", "RAG", "Forecast"],
    accuracy: 89,
    calls: 203,
  },
  {
    name: "매출관리 Agent",
    id: "sales-agent",
    statusLabel: "점검 필요",
    statusClass: "br",
    version: "v3.1.5",
    model: "Claude 3.5 Sonnet",
    tools: ["NL2SQL", "RAG"],
    accuracy: 86,
    calls: 312,
    trendText: "⚠ 스키마 미매핑 8건 — 즉시 점검 필요",
    urgent: true,
  },
];

export function AgentsPanel({ onOpenModal }: Props) {
  const navigate = useNavigate();

  return (
    <section>
      <div className="pgh">
        <div className="pgh-l">
          <h1>Agent 레지스트리</h1>
          <p>배포된 Agent 현황 관리 · 신규 Agent 생성 · 버전 배포</p>
        </div>
        <div className="pgh-r">
          <button type="button" className="btn btn-g btn-sm" onClick={() => onOpenModal("sync-log")}>
            배포 이력
          </button>
          <button type="button" className="btn btn-p btn-sm" onClick={() => onOpenModal("new-agent")}>
            + 신규 Agent 생성
          </button>
        </div>
      </div>

      <div className="g4 mb-[12px]">
        <div className="metric">
          <div className="ml">전체 Agent</div>
          <div className="mv">
            3<span>개</span>
          </div>
          <div className="ms">
            <span className="b bg">전체 운영 중</span>
          </div>
        </div>
        <div className="metric">
          <div className="ml">최근 배포</div>
          <div className="mv text-[15px]">
            v3.2<span className="text-[11px]"> 생산관리</span>
          </div>
          <div className="ms mt-1 text-[11px] text-[var(--t3)]">
            2026-04-18 14:20
          </div>
        </div>
        <div className="metric">
          <div className="ml">오늘 총 호출</div>
          <div className="mv">
            663<span>회</span>
          </div>
          <div className="ms">
            <span className="b bb">▲ 12% 전일</span>
          </div>
        </div>
        <div className="metric">
          <div className="ml">평균 정확도</div>
          <div className="mv">
            89<span>%</span>
          </div>
          <div className="ms">
            <span className="b ba">매출관리 하락 주의</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
        {AGENT_CARDS.map((card, idx) => {
          const barClass = card.urgent ? "pb r" : card.accuracy >= 90 ? "pb g" : "pb a";
          const iconBoxClass =
            idx === 0
              ? "bg-[var(--teal-lt)]"
              : idx === 1
                ? "bg-[var(--blue-lt)]"
                : "bg-[var(--orange-lt)]";
          const iconColorClass =
            idx === 0
              ? "text-[var(--teal)]"
              : idx === 1
                ? "text-[var(--blue)]"
                : "text-[var(--orange)]";
          const accuracyColorClass = card.urgent
            ? "text-[var(--red)]"
            : card.accuracy >= 90
              ? "text-[var(--teal)]"
              : "text-[var(--amber)]";
          return (
            <div
              key={card.id}
              className={`card mb-0 ${card.urgent ? "border-[#ffcece]" : ""}`}
            >
              <div className="mb-[10px] flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-[7px]">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-[8px] ${iconBoxClass}`}>
                      <span className={`material-symbols-outlined text-[16px] ${iconColorClass}`}>
                        {idx === 0 ? "grid_view" : idx === 1 ? "receipt_long" : "show_chart"}
                      </span>
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[var(--text)]">{card.name}</div>
                      <div className="text-[11px] text-[var(--t3)]">{card.id}</div>
                    </div>
                  </div>
                </div>
                <span className={`b ${card.statusClass}`}>{card.statusLabel}</span>
              </div>

              <div className="mb-[10px] flex flex-wrap gap-[5px]">
                <span className="b bb">{card.version}</span>
                <span className="b bgy">{card.model}</span>
                {card.tools.map((tool) => (
                  <span key={tool} className="b bgy">
                    {tool}
                  </span>
                ))}
              </div>

              <div
                className={`mb-[10px] rounded-[7px] px-[10px] py-2 ${
                  card.urgent
                    ? "border border-[#FFCECE] bg-[var(--red-lt)]"
                    : "bg-[var(--bg)]"
                }`}
              >
                <div className="mb-1 flex justify-between">
                  <span className="text-[11px] text-[var(--t3)]">NL2SQL 정확도</span>
                  <span className={`text-[11px] font-bold ${accuracyColorClass}`}>
                    {card.accuracy}%
                  </span>
                </div>
                <div className="pw">
                  <div className={barClass} style={{ width: `${card.accuracy}%` }} />
                </div>
                <div className="mb-1 mt-[5px] flex justify-between">
                  <span className="text-[11px] text-[var(--t3)]">오늘 호출</span>
                  <span className="text-[11px] font-bold text-[var(--text)]">{card.calls}회</span>
                </div>
                {card.trendText ? (
                  <div className="mt-[5px] text-[10.5px] text-[var(--red)]">{card.trendText}</div>
                ) : null}
              </div>

              <div className="flex gap-[6px]">
                <button
                  type="button"
                  className="btn btn-g btn-sm flex-1"
                  onClick={() => navigate(PANEL_PATH_MAP.prompts)}
                >
                  프롬프트
                </button>
                <button
                  type="button"
                  className={`${card.urgent ? "btn btn-danger btn-sm" : "btn btn-p btn-sm"} flex-1`}
                  onClick={() => onOpenModal("agent-config")}
                >
                  {card.urgent ? "긴급 점검" : "설정"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
