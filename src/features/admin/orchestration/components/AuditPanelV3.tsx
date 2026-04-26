import { InfoPopover } from "@/commons/components/info/InfoPopover";
import { FIELD_CAPTIONS } from "@/commons/constants/field-captions";
import { useAuditPanel } from "@/features/admin/orchestration/hooks/useAuditPanel";
import type { OrchestrationAgent } from "@/features/admin/orchestration/types/orchestration";

export function AuditPanelV3() {
  const {
    filteredRows,
    searchText,
    setSearchText,
    resultFilter,
    setResultFilter,
    agentFilter,
    setAgentFilter,
    allowedCount,
    blockedCount,
  } = useAuditPanel();

  const totalCount = allowedCount + blockedCount;
  const allowedRate = totalCount > 0 ? ((allowedCount / totalCount) * 100).toFixed(1) : "0.0";
  const blockedRate = totalCount > 0 ? ((blockedCount / totalCount) * 100).toFixed(1) : "0.0";

  return (
    <section>
      <div className="pgh">
        <div className="pgh-l">
          <div className="inline-flex items-center gap-1.5">
            <h1>대화 감사 로그</h1>
            <InfoPopover caption={FIELD_CAPTIONS["page:settings_audit_logs"]} side="bottom" align="left" />
          </div>
          <p>질의 처리 경로 · 차단 이력 · Agent별 통계 · 이상 감지</p>
        </div>
        <div className="pgh-r">
          <button type="button" className="btn btn-g btn-sm">
            CSV 내보내기
          </button>
        </div>
      </div>

      <div className="g4" style={{ marginBottom: 12 }}>
        <div className="metric !bg-white">
          <div className="ml">오늘 총 질의</div>
          <div className="mv">
            {totalCount}
            <span>건</span>
          </div>
          <div className="ms">
            <span className="b bb">최근 1시간 기준</span>
          </div>
        </div>
        <div className="metric !bg-white">
          <div className="ml">허용</div>
          <div className="mv">
            {allowedCount}
            <span>건</span>
          </div>
          <div className="ms">
            <span className="b bg">{allowedRate}%</span>
          </div>
        </div>
        <div className="metric !bg-white">
          <div className="ml">차단</div>
          <div className="mv">
            {blockedCount}
            <span>건</span>
          </div>
          <div className="ms">
            <span className="b br">{blockedRate}%</span>
          </div>
        </div>
        <div className="metric !bg-white">
          <div className="ml">평균 응답시간</div>
          <div className="mv">
            1.7<span>초</span>
          </div>
          <div className="ms">
            <span className="b ba">P95: 4.8초</span>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "var(--red-lt)",
          border: "1px solid #FFCECE",
          borderRadius: 10,
          padding: "9px 14px",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--red)", flex: 1 }}>
          ⚠ 이상 감지 — store_owner 역할 타 매장 질의 시도 급증 (172.16.5.99 · 7건 차단)
        </span>
        <button
          type="button"
          className="btn btn-g btn-sm"
          style={{ color: "var(--red)", borderColor: "#FFCECE" }}
        >
          상세 조회
        </button>
      </div>

      <div className="card" style={{ marginBottom: 0 }}>
        <div className="ch">
          <span className="ct">상세 로그</span>
        </div>
        <div className="sb">
          <input
            className="si"
            placeholder="ID, 사용자, 도메인 검색..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <select
            className="sel"
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value as "" | "허용" | "차단")}
          >
            <option value="">전체 결과</option>
            <option value="허용">허용</option>
            <option value="차단">차단</option>
          </select>
          <select
            className="sel"
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value as "" | OrchestrationAgent)}
          >
            <option value="">전체 Agent</option>
            <option value="생산관리">생산관리</option>
            <option value="주문관리">주문관리</option>
            <option value="매출관리">매출관리</option>
          </select>
        </div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>감사 ID</th>
                <th>시각</th>
                <th>사용자</th>
                <th>역할</th>
                <th>Agent</th>
                <th>경로</th>
                <th>골든쿼리</th>
                <th>소요</th>
                <th>결과</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 600 }}>{row.id}</td>
                  <td className="sub">{row.time}</td>
                  <td className="sub">{row.user}</td>
                  <td>
                    <span
                      className={row.role === "hq_admin" ? "b bo" : "b bb"}
                      style={{ fontSize: 9.5 }}
                    >
                      {row.role}
                    </span>
                  </td>
                  <td className="sub">{row.agent}</td>
                  <td>{row.route}</td>
                  <td>
                    <span
                      className={row.goldenHit === "HIT" ? "b bg" : "b bgy"}
                      style={{ fontSize: 9.5 }}
                    >
                      {row.goldenHit}
                    </span>
                  </td>
                  <td className="sub">{row.duration}</td>
                  <td>
                    <span className={row.result === "허용" ? "b bg" : "b br"}>{row.result}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
