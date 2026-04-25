export function QualityPanelV3() {
  return (
    <section>
      <div className="pgh">
        <div className="pgh-l">
          <h1>품질 검증 아카이브</h1>
          <p>Agent별 품질 점수 · SLA 달성률 · 이슈 트래커</p>
        </div>
        <div className="pgh-r">
          <button type="button" className="btn btn-p btn-sm">
            + 배치 검증 실행
          </button>
        </div>
      </div>

      <div className="g3" style={{ marginBottom: 12 }}>
        <div className="metric" style={{ background: "#fff", borderColor: "var(--border2)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700 }}>생산관리</span>
            <span className="b bg">정상</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--teal)" }}>
            91<span style={{ fontSize: 12, color: "var(--t2)" }}>/100</span>
          </div>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span className="sub">NL2SQL</span>
              <span style={{ fontWeight: 600 }}>91%</span>
            </div>
            <div className="pw">
              <div className="pb g" style={{ width: "91%" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span className="sub">RAG</span>
              <span style={{ fontWeight: 600 }}>88%</span>
            </div>
            <div className="pw">
              <div className="pb g" style={{ width: "88%" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span className="sub">SLA</span>
              <span style={{ fontWeight: 600 }}>97%</span>
            </div>
            <div className="pw">
              <div className="pb g" style={{ width: "97%" }} />
            </div>
          </div>
        </div>

        <div className="metric" style={{ background: "#fff", borderColor: "var(--border2)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700 }}>주문관리</span>
            <span className="b ba">주의</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--amber)" }}>
            87<span style={{ fontSize: 12, color: "var(--t2)" }}>/100</span>
          </div>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span className="sub">NL2SQL</span>
              <span style={{ fontWeight: 600 }}>89%</span>
            </div>
            <div className="pw">
              <div className="pb a" style={{ width: "89%" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span className="sub">RAG</span>
              <span style={{ fontWeight: 600 }}>85%</span>
            </div>
            <div className="pw">
              <div className="pb a" style={{ width: "85%" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span className="sub">SLA</span>
              <span style={{ fontWeight: 600 }}>91%</span>
            </div>
            <div className="pw">
              <div className="pb a" style={{ width: "91%" }} />
            </div>
          </div>
        </div>

        <div className="metric" style={{ background: "#fff", borderColor: "#FFCECE" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700 }}>매출관리</span>
            <span className="b br">검토 필요</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--red)" }}>
            82<span style={{ fontSize: 12, color: "var(--t2)" }}>/100</span>
          </div>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span className="sub">NL2SQL</span>
              <span style={{ fontWeight: 600, color: "var(--red)" }}>86%</span>
            </div>
            <div className="pw">
              <div className="pb r" style={{ width: "86%" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span className="sub">RAG</span>
              <span style={{ fontWeight: 600, color: "var(--red)" }}>82%</span>
            </div>
            <div className="pw">
              <div className="pb r" style={{ width: "82%" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span className="sub">SLA</span>
              <span style={{ fontWeight: 600, color: "var(--amber)" }}>88%</span>
            </div>
            <div className="pw">
              <div className="pb a" style={{ width: "88%" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 0 }}>
        <div className="ch">
          <span className="ct">이슈 트래커</span>
          <span className="b br" style={{ marginLeft: "auto" }}>
            미해결 3건
          </span>
        </div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>이슈 ID</th>
                <th>발생일</th>
                <th>Agent</th>
                <th>이슈</th>
                <th>우선순위</th>
                <th>담당</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600 }}>ISS-0042</td>
                <td className="sub">2026-04-22</td>
                <td className="sub">매출관리</td>
                <td className="sub">전년 대비 쿼리 정확도 68% — 스키마 미매핑 8건</td>
                <td>
                  <span className="b br">긴급</span>
                </td>
                <td className="sub">김지훈</td>
                <td>
                  <span className="b ba">진행 중</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>ISS-0041</td>
                <td className="sub">2026-04-20</td>
                <td className="sub">주문관리</td>
                <td className="sub">발주 이력 RAG 정확도 하락 (87%)</td>
                <td>
                  <span className="b ba">높음</span>
                </td>
                <td className="sub">이수진</td>
                <td>
                  <span className="b ba">진행 중</span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>ISS-0039</td>
                <td className="sub">2026-04-19</td>
                <td className="sub">전체</td>
                <td className="sub">상권 커넥터 지연 — RAG 인덱스 미갱신</td>
                <td>
                  <span className="b ba">높음</span>
                </td>
                <td className="sub">미배정</td>
                <td>
                  <span className="b bgy">대기</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
