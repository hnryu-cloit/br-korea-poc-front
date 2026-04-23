import type { SettingsModalKey } from "@/features/admin/orchestration/types/orchestration";

type Props = {
  onOpenModal: (key: SettingsModalKey) => void;
};

export function OrchPipelinePanel({ onOpenModal }: Props) {
  return (
    <section>
      <div className="pgh">
        <div className="pgh-l">
          <h1>오케스트레이션</h1>
          <p>멀티 에이전트 라우팅 파이프라인 · 핸드오프 규칙 · Fallback 체인</p>
        </div>
        <div className="pgh-r">
          <button type="button" className="btn btn-g btn-sm">
            파이프라인 이력
          </button>
          <button type="button" className="btn btn-p btn-sm">
            설정 저장
          </button>
        </div>
      </div>

      <div className="card">
        <div className="ch">
          <span className="ct">질의 처리 파이프라인</span>
          <span className="b bb" style={{ marginLeft: "auto" }}>
            실시간 적용
          </span>
        </div>
        <div className="pipeline">
          <div className="pipe-node active-node">
            <div className="pipe-label">진입점</div>
            <div className="pipe-name">질의 수신</div>
            <div style={{ fontSize: 10, color: "var(--t2)", marginTop: 3 }}>
              역할 판별 + 범위 설정
            </div>
          </div>
          <div className="pipe-arrow">→</div>
          <div className="pipe-node active-node">
            <div className="pipe-label">라우터</div>
            <div className="pipe-name">의도 분류기</div>
            <div style={{ fontSize: 10, color: "var(--t2)", marginTop: 3 }}>
              NLP 기반 도메인 분류
            </div>
          </div>
          <div className="pipe-arrow">→</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="pipe-node" style={{ minWidth: 110 }}>
              <div className="pipe-label">Agent A</div>
              <div className="pipe-name">생산관리</div>
            </div>
            <div className="pipe-node" style={{ minWidth: 110 }}>
              <div className="pipe-label">Agent B</div>
              <div className="pipe-name">주문관리</div>
            </div>
            <div className="pipe-node" style={{ minWidth: 110 }}>
              <div className="pipe-label">Agent C</div>
              <div className="pipe-name">매출관리</div>
            </div>
          </div>
          <div className="pipe-arrow">→</div>
          <div className="pipe-node active-node">
            <div className="pipe-label">처리</div>
            <div className="pipe-name">NL2SQL / RAG</div>
            <div style={{ fontSize: 10, color: "var(--t2)", marginTop: 3 }}>
              골든 쿼리 우선 매칭
            </div>
          </div>
          <div className="pipe-arrow">→</div>
          <div className="pipe-node active-node">
            <div className="pipe-label">후처리</div>
            <div className="pipe-name">정책 필터</div>
            <div style={{ fontSize: 10, color: "var(--t2)", marginTop: 3 }}>
              PII 마스킹 + 감사 기록
            </div>
          </div>
          <div className="pipe-arrow">→</div>
          <div className="pipe-node active-node">
            <div className="pipe-label">응답</div>
            <div className="pipe-name">응답 생성</div>
            <div style={{ fontSize: 10, color: "var(--t2)", marginTop: 3 }}>근거 요약 포함</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
          <div className="pipe-node fallback" style={{ minWidth: "auto", padding: "6px 12px" }}>
            <div className="pipe-label">Fallback</div>
            <div className="pipe-name" style={{ fontSize: 11 }}>
              RAG 재시도 → 오류 안내
            </div>
          </div>
          <div className="pipe-node fallback" style={{ minWidth: "auto", padding: "6px 12px" }}>
            <div className="pipe-label">Cross-Agent</div>
            <div className="pipe-name" style={{ fontSize: 11 }}>
              도메인 초과 시 핸드오프
            </div>
          </div>
        </div>
      </div>

      <div className="g2">
        <div className="card">
          <div className="ch">
            <span className="ct">라우팅 규칙</span>
          </div>
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>조건 키워드</th>
                  <th>라우팅 대상</th>
                  <th>우선순위</th>
                  <th>활성</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mono">재고, 생산, 폐기, 품질</td>
                  <td>
                    <span className="b bg">생산관리 Agent</span>
                  </td>
                  <td className="sub">1</td>
                  <td className="sub">On</td>
                </tr>
                <tr>
                  <td className="mono">주문, 발주, 마감, 추천량</td>
                  <td>
                    <span className="b bb">주문관리 Agent</span>
                  </td>
                  <td className="sub">1</td>
                  <td className="sub">On</td>
                </tr>
                <tr>
                  <td className="mono">매출, 손익, 마진, 달성</td>
                  <td>
                    <span className="b bo">매출관리 Agent</span>
                  </td>
                  <td className="sub">1</td>
                  <td className="sub">On</td>
                </tr>
                <tr>
                  <td className="mono">기타 / 분류 불가</td>
                  <td>
                    <span className="b bgy">Fallback → RAG</span>
                  </td>
                  <td className="sub">9</td>
                  <td className="sub">On</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="btn btn-g btn-sm"
            style={{ marginTop: 8 }}
            onClick={() => onOpenModal("add-rule")}
          >
            + 규칙 추가
          </button>
        </div>

        <div className="card">
          <div className="ch">
            <span className="ct">핸드오프 & Fallback 설정</span>
          </div>
          <div className="tr">
            <div>
              <div className="tl">Cross-Agent 핸드오프 허용</div>
              <div className="td">도메인 초과 질의를 타 Agent로 위임</div>
            </div>
            <span className="b bg">ON</span>
          </div>
          <div className="tr">
            <div>
              <div className="tl">골든 쿼리 우선 매칭</div>
              <div className="td">임베딩된 골든 쿼리 캐시 우선 조회</div>
            </div>
            <span className="b bg">ON</span>
          </div>
          <div className="tr">
            <div>
              <div className="tl">SQL 실패 시 RAG 자동 전환</div>
              <div className="td">NL2SQL 실패 후 RAG 검색으로 재시도</div>
            </div>
            <span className="b bg">ON</span>
          </div>
          <div className="tr">
            <div>
              <div className="tl">멀티턴 컨텍스트 유지</div>
              <div className="td">이전 대화 컨텍스트를 다음 질의에 전달</div>
            </div>
            <span className="b bgy">OFF</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <label className="sub" style={{ fontSize: 11, fontWeight: 700 }}>
              최대 핸드오프 횟수
            </label>
            <select className="sel" style={{ width: "100%", marginTop: 4 }} defaultValue="2회">
              <option>1회</option>
              <option>2회</option>
              <option>3회</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 10 }}>
        <div className="ch">
          <span className="ct">최근 라우팅 로그</span>
          <button type="button" className="btn btn-g btn-sm" style={{ marginLeft: "auto" }}>
            전체 보기
          </button>
        </div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>시각</th>
                <th>질의 요약</th>
                <th>분류 결과</th>
                <th>라우팅 경로</th>
                <th>핸드오프</th>
                <th>소요</th>
                <th>결과</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="sub">10:22</td>
                <td>지금 생산해야 할 품목은?</td>
                <td>
                  <span className="b bg">생산관리</span>
                </td>
                <td className="mono">SQL → 응답</td>
                <td className="sub">없음</td>
                <td className="sub">1.2s</td>
                <td>
                  <span className="b bg">성공</span>
                </td>
              </tr>
              <tr>
                <td className="sub">10:18</td>
                <td>오늘 추천 주문량과 마감 상품은?</td>
                <td>
                  <span className="b bb">주문관리</span>
                </td>
                <td className="mono">골든쿼리 HIT → 응답</td>
                <td className="sub">없음</td>
                <td className="sub">0.3s</td>
                <td>
                  <span className="b bg">성공</span>
                </td>
              </tr>
              <tr>
                <td className="sub">10:11</td>
                <td>이번 주 매출과 재고 비교해줘</td>
                <td>
                  <span className="b bo">매출관리</span>
                </td>
                <td className="mono">SQL → 매출관리 핸드오프</td>
                <td>
                  <span className="b ba">생산→매출</span>
                </td>
                <td className="sub">2.8s</td>
                <td>
                  <span className="b ba">부분</span>
                </td>
              </tr>
              <tr>
                <td className="sub">09:57</td>
                <td>타 매장 매출 알려줘</td>
                <td>
                  <span className="b bo">매출관리</span>
                </td>
                <td className="mono">정책 차단</td>
                <td className="sub">없음</td>
                <td className="sub">0.2s</td>
                <td>
                  <span className="b br">차단</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
