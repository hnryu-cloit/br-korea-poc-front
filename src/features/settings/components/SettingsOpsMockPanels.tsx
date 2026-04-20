import { Database, History, MessageSquare, Users } from "lucide-react";

type ConnectorStatus = "Healthy" | "Warning" | "Idle";

type DataConnector = {
  name: string;
  status: ConnectorStatus;
  scope: string;
  schemaCount: number;
  lastSyncAt: string;
  note: string;
};

type MemberAccess = {
  role: string;
  members: number;
  accessRange: string;
  policy: string;
};

type ConversationAuditLog = {
  id: string;
  occurredAt: string;
  actor: string;
  domain: string;
  route: string;
  result: string;
};

type QualityArchiveItem = {
  batch: string;
  target: string;
  qualityScore: number;
  issues: string;
  status: "통과" | "주의" | "검토";
};

export const settingOverviewCards = [
  {
    title: "데이터 커넥터",
    description: "원천 데이터 연동 상태와 스키마 동기화 이력을 점검합니다.",
    to: "/settings/connectors",
    icon: Database,
  },
  {
    title: "멤버 & 접근 제어",
    description: "역할별 접근 범위와 권한 정책을 관리합니다.",
    to: "/settings/access",
    icon: Users,
  },
  {
    title: "대화 감사 로그",
    description: "대화 처리 경로와 차단 이력을 감사합니다.",
    to: "/settings/audit-logs",
    icon: MessageSquare,
  },
  {
    title: "품질 검증 아카이브",
    description: "배치별 품질 점수와 검증 이슈를 보관합니다.",
    to: "/settings/quality-archive",
    icon: History,
  },
  {
    title: "프롬프트 설정",
    description: "도메인별 시스템 프롬프트와 빠른 질문을 수정합니다.",
    to: "/settings/prompts",
    icon: MessageSquare,
  },
] as const;

const dataConnectors: DataConnector[] = [
  {
    name: "매출 원천 커넥터",
    status: "Healthy",
    scope: "raw_daily_store_item / raw_daily_store_online",
    schemaCount: 24,
    lastSyncAt: "2026-04-20 09:10 KST",
    note: "전일 매출 적재 완료",
  },
  {
    name: "주문·생산 커넥터",
    status: "Healthy",
    scope: "raw_order_extract / raw_production_extract",
    schemaCount: 18,
    lastSyncAt: "2026-04-20 09:08 KST",
    note: "SKU 기준 키 정합성 확인",
  },
  {
    name: "상권·유동인구 커넥터",
    status: "Warning",
    scope: "서울시 유동인구 월 집계 + 내부 상권 인덱스",
    schemaCount: 7,
    lastSyncAt: "2026-04-19 23:30 KST",
    note: "최신 월 데이터 지연 1건",
  },
];

const memberAccessControls: MemberAccess[] = [
  {
    role: "본사 관리자 (hq_admin)",
    members: 4,
    accessRange: "전국 매장 / HQ 메뉴 전체",
    policy: "민감 데이터 마스킹 + 감사 로그 필수",
  },
  {
    role: "가맹점주 (store_owner)",
    members: 132,
    accessRange: "본인 매장만 접근",
    policy: "점포 범위 강제 + 타매장 접근 차단",
  },
  {
    role: "운영 파트너 (viewer)",
    members: 9,
    accessRange: "읽기 전용 대시보드",
    policy: "다운로드 제한 + 개인식별정보 비노출",
  },
];

const conversationAuditLogs: ConversationAuditLog[] = [
  {
    id: "AUD-20260420-0012",
    occurredAt: "2026-04-20 10:14",
    actor: "hq_admin",
    domain: "signals",
    route: "SQL + 정책필터",
    result: "허용",
  },
  {
    id: "AUD-20260420-0009",
    occurredAt: "2026-04-20 10:05",
    actor: "store_owner",
    domain: "sales",
    route: "AI + 근거요약",
    result: "허용",
  },
  {
    id: "AUD-20260420-0007",
    occurredAt: "2026-04-20 09:57",
    actor: "store_owner",
    domain: "sales",
    route: "민감질의 차단",
    result: "차단",
  },
  {
    id: "AUD-20260420-0003",
    occurredAt: "2026-04-20 09:43",
    actor: "hq_admin",
    domain: "hq/inspection",
    route: "API 조회",
    result: "허용",
  },
];

const qualityArchives: QualityArchiveItem[] = [
  {
    batch: "QA-2026-04-20-01",
    target: "상권 인텔리전스(3km/경쟁/유동)",
    qualityScore: 92,
    issues: "지연 데이터 1건(유동인구 월 집계)",
    status: "주의",
  },
  {
    batch: "QA-2026-04-19-03",
    target: "주문 코칭 데이터셋",
    qualityScore: 96,
    issues: "중복 레코드 0건",
    status: "통과",
  },
  {
    batch: "QA-2026-04-18-04",
    target: "매출 질의 응답 로그",
    qualityScore: 89,
    issues: "차단 규칙 예외 케이스 2건 검토",
    status: "검토",
  },
];

function statusStyle(status: ConnectorStatus): string {
  if (status === "Healthy") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "Warning") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

function qualityStyle(status: QualityArchiveItem["status"]): string {
  if (status === "통과") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "주의") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

export function SettingsConnectorsPanel() {
  return (
    <section className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5 text-[#2454C8]" />
        <p className="text-base font-semibold text-slate-900">데이터 커넥터</p>
        <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#2454C8]">
          목업 시연
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        소스별 상태, 스키마 범위, 마지막 동기화 시점을 운영자가 확인합니다.
      </p>
      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        {dataConnectors.map((connector) => (
          <article
            key={connector.name}
            className="rounded-2xl border border-border bg-[#f8fbff] p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{connector.name}</p>
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusStyle(connector.status)}`}
              >
                {connector.status}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">{connector.scope}</p>
            <div className="mt-3 space-y-1 text-xs text-slate-600">
              <p>스키마 수: {connector.schemaCount}개</p>
              <p>최근 동기화: {connector.lastSyncAt}</p>
              <p>메모: {connector.note}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function SettingsAccessControlPanel() {
  return (
    <section className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-[#2454C8]" />
        <p className="text-base font-semibold text-slate-900">멤버 & 접근 제어</p>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        역할별 접근 범위와 민감정보 정책 적용 상태를 확인합니다.
      </p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
        <table className="min-w-full bg-white text-left text-xs">
          <thead className="bg-[#f7faff] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">역할</th>
              <th className="px-4 py-3 font-semibold">멤버 수</th>
              <th className="px-4 py-3 font-semibold">접근 범위</th>
              <th className="px-4 py-3 font-semibold">통제 정책</th>
            </tr>
          </thead>
          <tbody>
            {memberAccessControls.map((item) => (
              <tr key={item.role} className="border-t border-border text-slate-700">
                <td className="px-4 py-3 font-semibold">{item.role}</td>
                <td className="px-4 py-3">{item.members.toLocaleString()}명</td>
                <td className="px-4 py-3">{item.accessRange}</td>
                <td className="px-4 py-3">{item.policy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function SettingsAuditLogsPanel() {
  return (
    <section className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-[#2454C8]" />
        <p className="text-base font-semibold text-slate-900">대화 감사 로그</p>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        질의 처리 경로와 차단 결과를 최근 실행 순으로 추적합니다.
      </p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
        <table className="min-w-full bg-white text-left text-xs">
          <thead className="bg-[#f7faff] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">감사 ID</th>
              <th className="px-4 py-3 font-semibold">시각</th>
              <th className="px-4 py-3 font-semibold">사용자 역할</th>
              <th className="px-4 py-3 font-semibold">도메인</th>
              <th className="px-4 py-3 font-semibold">처리 경로</th>
              <th className="px-4 py-3 font-semibold">결과</th>
            </tr>
          </thead>
          <tbody>
            {conversationAuditLogs.map((log) => (
              <tr key={log.id} className="border-t border-border text-slate-700">
                <td className="px-4 py-3 font-semibold">{log.id}</td>
                <td className="px-4 py-3">{log.occurredAt}</td>
                <td className="px-4 py-3">{log.actor}</td>
                <td className="px-4 py-3">{log.domain}</td>
                <td className="px-4 py-3">{log.route}</td>
                <td className="px-4 py-3">{log.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function SettingsQualityArchivePanel() {
  return (
    <section className="rounded-[28px] border border-border bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-[#2454C8]" />
        <p className="text-base font-semibold text-slate-900">품질 검증 아카이브</p>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        배치 단위 품질 점수와 이슈 이력을 보관해 재현 가능성을 확보합니다.
      </p>
      <div className="mt-4 space-y-3">
        {qualityArchives.map((item) => (
          <article key={item.batch} className="rounded-2xl border border-border bg-[#f8fbff] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">{item.batch}</p>
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${qualityStyle(item.status)}`}
              >
                {item.status}
              </span>
              <span className="ml-auto rounded-full bg-[#eef4ff] px-2 py-0.5 text-[11px] font-semibold text-[#2454C8]">
                품질 점수 {item.qualityScore}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600">검증 대상: {item.target}</p>
            <p className="mt-1 text-xs text-slate-500">이슈: {item.issues}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
