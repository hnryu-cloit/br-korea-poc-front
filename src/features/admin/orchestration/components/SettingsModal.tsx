import { MOCK_SYNC_LOG_ROWS } from "@/features/admin/orchestration/mockdata/mock-orchestration";
import { usePromptTestConsole } from "@/features/admin/orchestration/hooks/usePromptTestConsole";
import type {
  NoticeItem,
  SettingsModalKey,
} from "@/features/admin/orchestration/types/orchestration";

type Props = {
  activeModal: SettingsModalKey | null;
  selectedNotice: NoticeItem | null;
  onClose: () => void;
};

const MODAL_TITLES: Record<SettingsModalKey, string> = {
  "new-agent": "신규 Agent 생성",
  "agent-config": "Agent 설정",
  "add-rule": "라우팅 규칙 추가",
  "sync-log": "동기화 이력",
  "perm-matrix": "역할별 권한 매트릭스",
  "invite-member": "멤버 초대",
  "prompt-test": "프롬프트 테스트 콘솔",
  "embed-schedule": "배치 임베딩 스케줄 설정",
  "embed-now": "즉시 임베딩 실행",
  "notice-detail": "공지 상세",
};

export function SettingsModal({ activeModal, selectedNotice, onClose }: Props) {
  const { testInput, setTestInput, testOutput, runTest } = usePromptTestConsole();

  if (!activeModal) return null;

  const renderBody = () => {
    if (activeModal === "new-agent") {
      return (
        <div className="flex flex-col gap-[10px]">
          <div>
            <label className="sub text-[11px] font-bold">Agent 이름</label>
            <input className="si" placeholder="예: 고객분석 Agent" />
          </div>
          <div>
            <label className="sub text-[11px] font-bold">도메인 ID</label>
            <input className="si" placeholder="예: customer-agent" />
          </div>
          <div>
            <label className="sub text-[11px] font-bold">담당 도메인</label>
            <select className="sel w-full">
              <option>신규 도메인 정의</option>
              <option>생산관리</option>
              <option>주문관리</option>
              <option>매출관리</option>
            </select>
          </div>
          <div>
            <label className="sub text-[11px] font-bold">기반 LLM 모델</label>
            <select className="sel w-full">
              <option>Gemini 3.1 Pro</option>
              <option>Gemini 3 Flash</option>
              <option>Claude 4.6 Sonnet</option>
              <option>Claude 4.7 Opus</option>
            </select>
          </div>
        </div>
      );
    }

    if (activeModal === "agent-config") {
      return (
        <div className="flex flex-col gap-[10px]">
          <div>
            <label className="sub text-[11px] font-bold">LLM 모델</label>
            <select className="sel w-full">
              <option>Claude 3.5 Sonnet</option>
              <option>Claude 3 Haiku</option>
            </select>
          </div>
          <div>
            <label className="sub text-[11px] font-bold">최대 토큰 (응답)</label>
            <select className="sel w-full">
              <option>1,024</option>
              <option>2,048</option>
              <option>4,096</option>
            </select>
          </div>
          <div className="tr">
            <div className="tl">할루시네이션 경고 표시</div>
            <span className="b bg">ON</span>
          </div>
          <div className="tr">
            <div className="tl">응답 재생성 허용</div>
            <span className="b bg">ON</span>
          </div>
        </div>
      );
    }

    if (activeModal === "add-rule") {
      return (
        <div className="flex flex-col gap-[10px]">
          <div>
            <label className="sub text-[11px] font-bold">매칭 키워드 (쉼표 구분)</label>
            <input className="si" placeholder="예: 고객, 리뷰, 피드백" />
          </div>
          <div>
            <label className="sub text-[11px] font-bold">라우팅 대상 Agent</label>
            <select className="sel w-full">
              <option>생산관리 Agent</option>
              <option>주문관리 Agent</option>
              <option>매출관리 Agent</option>
            </select>
          </div>
          <div>
            <label className="sub text-[11px] font-bold">우선순위</label>
            <select className="sel w-full">
              <option>1 (최우선)</option>
              <option>2</option>
              <option>3</option>
              <option>9 (Fallback)</option>
            </select>
          </div>
        </div>
      );
    }

    if (activeModal === "sync-log") {
      return (
        <div className="tw mt-0">
          <table>
            <thead>
              <tr>
                <th>일시</th>
                <th>커넥터</th>
                <th>결과</th>
                <th>소요</th>
                <th>레코드</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SYNC_LOG_ROWS.map((row) => (
                <tr key={row[0]}>
                  <td className="sub">{row[0]}</td>
                  <td className="font-semibold">{row[1]}</td>
                  <td>
                    <span className={row[2] === "성공" ? "b bg" : "b br"}>{row[2]}</span>
                  </td>
                  <td className="sub">{row[3]}</td>
                  <td className="sub">{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeModal === "perm-matrix") {
      return (
        <div>
          <div className="tw mt-0">
            <table>
              <thead>
                <tr>
                  <th>기능/리소스</th>
                  <th>hq_admin</th>
                  <th>store_owner</th>
                  <th>ops_partner</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold">전체 Agent 사용</td>
                  <td>✓</td>
                  <td>~</td>
                  <td>✗</td>
                </tr>
                <tr>
                  <td className="font-semibold">타 매장 데이터 조회</td>
                  <td>✓</td>
                  <td>✗</td>
                  <td>✗</td>
                </tr>
                <tr>
                  <td className="font-semibold">시스템 설정 변경</td>
                  <td>✓</td>
                  <td>✗</td>
                  <td>✗</td>
                </tr>
                <tr>
                  <td className="font-semibold">골든 쿼리 관리</td>
                  <td>✓</td>
                  <td>✗</td>
                  <td>✗</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="sub mt-2 text-[11px]">✓ 허용 · ~ 제한적 · ✗ 차단</div>
        </div>
      );
    }

    if (activeModal === "invite-member") {
      return (
        <div className="flex flex-col gap-[10px]">
          <div>
            <label className="sub text-[11px] font-bold">이메일</label>
            <input className="si" placeholder="email@brdunkin.co.kr" />
          </div>
          <div>
            <label className="sub text-[11px] font-bold">역할</label>
            <select className="sel w-full">
              <option>hq_admin</option>
              <option>store_owner</option>
              <option>ops_partner</option>
            </select>
          </div>
          <div>
            <label className="sub text-[11px] font-bold">담당 매장 (store_owner 한정)</label>
            <input className="si" placeholder="매장 ID 입력" />
          </div>
        </div>
      );
    }

    if (activeModal === "prompt-test") {
      return (
        <div>
          <label className="sub text-[11px] font-bold">테스트 질의</label>
          <textarea
            className="si min-h-[70px] resize-y"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="질의를 입력하세요..."
          />
          <div className="my-2 flex gap-[7px]">
            <button type="button" className="btn btn-p btn-sm" onClick={runTest}>
              실행
            </button>
            <select className="sel">
              <option>영등포구01점</option>
              <option>마포구01점</option>
              <option>강서구01점</option>
            </select>
          </div>
          <pre className="min-h-[80px] whitespace-pre-wrap rounded-[7px] border border-[var(--border2)] bg-[var(--bg)] p-[10px] text-[12px] text-[var(--t2)]">
            {testOutput}
          </pre>
        </div>
      );
    }

    if (activeModal === "embed-schedule") {
      return (
        <div className="flex flex-col gap-[10px]">
          <div>
            <label className="sub text-[11px] font-bold">실행 주기</label>
            <select className="sel w-full">
              <option>매일</option>
              <option>매주</option>
            </select>
          </div>
          <div>
            <label className="sub text-[11px] font-bold">실행 시각 (KST)</label>
            <input className="si" defaultValue="02:00" />
          </div>
          <div>
            <label className="sub text-[11px] font-bold">임베딩 모델</label>
            <select className="sel w-full">
              <option>text-embedding-3-large</option>
              <option>bge-m3 (로컬)</option>
            </select>
          </div>
        </div>
      );
    }

    if (activeModal === "embed-now") {
      return (
        <p className="text-[12px] leading-[1.7] text-[var(--t2)]">
          현재 등록된 골든 쿼리 17개를 즉시 임베딩합니다. 예상 소요 시간: 약 3~5분. 임베딩 중에는
          기존 캐시가 그대로 유지됩니다.
        </p>
      );
    }

    return (
      <div>
        <p className="text-[12px] font-bold text-[var(--text)]">
          {selectedNotice?.title ?? "공지사항"}
        </p>
        <p className="mt-[6px] text-[12px] text-[var(--t2)]">
          {selectedNotice?.desc ?? "상세 내용을 확인하세요."}
        </p>
        <p className="mt-[6px] text-[11px] text-[var(--t3)]">
          {selectedNotice?.date ?? "2026-04-22"}
        </p>
      </div>
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35"
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="max-h-[85vh] w-[520px] max-w-[calc(100vw-40px)] overflow-y-auto rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lg)]"
      >
        <div className="mb-[14px] flex items-center justify-between">
          <span className="text-[14px] font-bold text-[var(--text)]">
            {MODAL_TITLES[activeModal]}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border-0 bg-transparent p-[2px] text-[18px] leading-none text-[var(--t3)]"
          >
            ×
          </button>
        </div>

        {renderBody()}

        <div className="mt-[14px] flex gap-[7px]">
          <button type="button" className="btn btn-g btn-sm" onClick={onClose}>
            취소
          </button>
          <button type="button" className="btn btn-p btn-sm" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
