import type {
  AuditRow,
  NoticeItem,
  OrchestrationAgent,
  RbacMember,
} from "@/features/admin/orchestration/types/orchestration";

export type GoldenQuery = {
  id: string;
  query: string;
  agent: OrchestrationAgent;
  hits: number;
  embedded: boolean;
};

export const MOCK_RECOMMENDED_GOLDEN_QUERIES: Array<{
  query: string;
  agent: OrchestrationAgent;
  hits: number;
  tone: string;
}> = [
  { query: "지금 생산해야 할 품목은?", agent: "생산관리", hits: 68, tone: "emerald" },
  { query: "오늘 추천 주문량은?", agent: "주문관리", hits: 55, tone: "blue" },
  { query: "재고 부족 우려 상품 알려줘", agent: "생산관리", hits: 42, tone: "emerald" },
  { query: "마감 임박 상품 알려줘", agent: "주문관리", hits: 37, tone: "blue" },
  { query: "오늘 매출 현황은?", agent: "매출관리", hits: 46, tone: "orange" },
  { query: "오늘 폐기 예상 비용 상위 품목은?", agent: "생산관리", hits: 33, tone: "emerald" },
  { query: "주문 누락 위험이 높은 품목은?", agent: "주문관리", hits: 31, tone: "blue" },
  { query: "할인 영향 제외 순매출 추이는?", agent: "매출관리", hits: 29, tone: "orange" },
];

export const MOCK_INITIAL_GOLDEN_QUERIES: GoldenQuery[] = [
  { id: "gq-1", query: "지금 생산해야 할 품목은?", agent: "생산관리", hits: 68, embedded: true },
  { id: "gq-2", query: "오늘 추천 주문량은?", agent: "주문관리", hits: 55, embedded: true },
  {
    id: "gq-3",
    query: "이번 주 폐기량이 높은 제품은?",
    agent: "생산관리",
    hits: 42,
    embedded: true,
  },
  { id: "gq-4", query: "마진이 낮은 상품은?", agent: "매출관리", hits: 38, embedded: true },
  { id: "gq-5", query: "공급사별 납기 현황은?", agent: "주문관리", hits: 21, embedded: false },
  {
    id: "gq-6",
    query: "시간대별 객단가 하락 원인은?",
    agent: "매출관리",
    hits: 34,
    embedded: true,
  },
  {
    id: "gq-7",
    query: "오늘 주문 마감 전 긴급 발주 품목은?",
    agent: "주문관리",
    hits: 30,
    embedded: true,
  },
  {
    id: "gq-8",
    query: "내일 아침 생산 선행 품목은?",
    agent: "생산관리",
    hits: 27,
    embedded: false,
  },
  {
    id: "gq-9",
    query: "캠페인 기간 매출 리프트는?",
    agent: "매출관리",
    hits: 24,
    embedded: false,
  },
];

export const MOCK_NOTICES: NoticeItem[] = [
  {
    title: "[안내] 4/24(금) 02:00~02:30 시스템 점검",
    desc: "점검 시간 동안 일부 커넥터 동기화가 지연될 수 있습니다.",
    date: "2026-04-22",
  },
  {
    title: "[공지] 골든 쿼리 자동 추천 기능 베타 오픈",
    desc: "반복 질의를 자동 감지해 추천 목록에 제안합니다.",
    date: "2026-04-21",
  },
  {
    title: "[업데이트] RBAC 권한 매트릭스 템플릿 개선",
    desc: "store_owner 범위 정책 검증 항목이 추가되었습니다.",
    date: "2026-04-20",
  },
  {
    title: "[안내] 주문 커넥터 재연결 점검 예정",
    desc: "04/27 00:30~01:00 동안 주문 집계 지연이 발생할 수 있습니다.",
    date: "2026-04-19",
  },
  {
    title: "[업데이트] 프롬프트 테스트 콘솔 로그 포맷 통일",
    desc: "프롬프트 입력/출력 캡처 항목이 표준화되었습니다.",
    date: "2026-04-18",
  },
  {
    title: "[안내] 상권 API 장애 대응 지침 배포",
    desc: "외부 API 지연 시 대체 데이터 fallback 절차를 안내합니다.",
    date: "2026-04-17",
  },
];

export const MOCK_AUDIT_LOGS = [
  {
    id: "AUD-001",
    occurredAt: "10:14",
    actor: "hq_admin",
    domain: "signals",
    route: "SQL + 정책필터",
    result: "허용",
    resultClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "AUD-002",
    occurredAt: "10:05",
    actor: "store_owner",
    domain: "sales",
    route: "AI + 근거요약",
    result: "허용",
    resultClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "AUD-003",
    occurredAt: "09:57",
    actor: "store_owner",
    domain: "sales",
    route: "민감질의 차단",
    result: "차단",
    resultClass: "bg-red-100 text-red-700",
  },
  {
    id: "AUD-004",
    occurredAt: "09:43",
    actor: "hq_admin",
    domain: "hq/inspection",
    route: "API 조회",
    result: "허용",
    resultClass: "bg-emerald-100 text-emerald-700",
  },
];

export const MOCK_AUDIT_ROWS: AuditRow[] = [
  {
    id: "AUD-0031",
    time: "10:22",
    user: "hyunseok.park",
    role: "store_owner",
    agent: "주문관리",
    route: "골든쿼리 매칭",
    goldenHit: "HIT",
    duration: "0.3s",
    result: "허용",
  },
  {
    id: "AUD-0028",
    time: "10:14",
    user: "unknown",
    role: "store_owner",
    agent: "매출관리",
    route: "타매장 차단",
    goldenHit: "MISS",
    duration: "0.2s",
    result: "차단",
  },
  {
    id: "AUD-0025",
    time: "10:09",
    user: "jihun.kim",
    role: "hq_admin",
    agent: "생산관리",
    route: "SQL → 응답",
    goldenHit: "MISS",
    duration: "1.2s",
    result: "허용",
  },
  {
    id: "AUD-0021",
    time: "10:05",
    user: "mina.choi",
    role: "store_owner",
    agent: "주문관리",
    route: "AI + 요약",
    goldenHit: "MISS",
    duration: "1.9s",
    result: "허용",
  },
  {
    id: "AUD-0019",
    time: "09:58",
    user: "sujin.lee",
    role: "hq_admin",
    agent: "매출관리",
    route: "SQL → 정책필터",
    goldenHit: "HIT",
    duration: "0.8s",
    result: "허용",
  },
  {
    id: "AUD-0017",
    time: "09:54",
    user: "store_0078",
    role: "store_owner",
    agent: "생산관리",
    route: "PII 차단",
    goldenHit: "MISS",
    duration: "0.4s",
    result: "차단",
  },
  {
    id: "AUD-0015",
    time: "09:49",
    user: "jiwon.kang",
    role: "store_owner",
    agent: "주문관리",
    route: "골든쿼리 매칭",
    goldenHit: "HIT",
    duration: "0.3s",
    result: "허용",
  },
  {
    id: "AUD-0012",
    time: "09:42",
    user: "ops.team",
    role: "hq_admin",
    agent: "매출관리",
    route: "AI + 요약",
    goldenHit: "MISS",
    duration: "2.1s",
    result: "허용",
  },
  {
    id: "AUD-0010",
    time: "09:37",
    user: "unknown",
    role: "store_owner",
    agent: "매출관리",
    route: "타매장 차단",
    goldenHit: "MISS",
    duration: "0.2s",
    result: "차단",
  },
  {
    id: "AUD-0008",
    time: "09:31",
    user: "jihun.kim",
    role: "hq_admin",
    agent: "생산관리",
    route: "SQL → 응답",
    goldenHit: "HIT",
    duration: "0.9s",
    result: "허용",
  },
  {
    id: "AUD-0006",
    time: "09:24",
    user: "mirae.han",
    role: "store_owner",
    agent: "주문관리",
    route: "권한 정책 차단",
    goldenHit: "MISS",
    duration: "0.3s",
    result: "차단",
  },
];

export const MOCK_RBAC_MEMBERS: RbacMember[] = [
  {
    name: "김지훈",
    email: "jihun.kim@brdunkin.co.kr",
    role: "hq_admin",
    scope: "매장 전체",
    lastLogin: "오늘 09:41",
    status: "활성",
  },
  {
    name: "이수진",
    email: "sujin.lee@brdunkin.co.kr",
    role: "hq_admin",
    scope: "매장 전체",
    lastLogin: "오늘 08:15",
    status: "활성",
  },
  {
    name: "박현석",
    email: "hyunseok.park@brdunkin.co.kr",
    role: "store_owner",
    scope: "영등포구01점",
    lastLogin: "오늘 07:52",
    status: "활성",
  },
  {
    name: "최민아",
    email: "mina.choi@brdunkin.co.kr",
    role: "store_owner",
    scope: "마포구01점",
    lastLogin: "어제 22:10",
    status: "활성",
  },
  {
    name: "한미래",
    email: "mirae.han@partner.co.kr",
    role: "ops_partner",
    scope: "매장 전체",
    lastLogin: "어제 16:30",
    status: "활성",
  },
  {
    name: "강지원",
    email: "jiwon.kang@brdunkin.co.kr",
    role: "store_owner",
    scope: "강서구01점",
    lastLogin: "오늘 06:48",
    status: "활성",
  },
  {
    name: "오세훈",
    email: "sehun.oh@brdunkin.co.kr",
    role: "store_owner",
    scope: "노원구01점",
    lastLogin: "오늘 08:02",
    status: "활성",
  },
  {
    name: "권다은",
    email: "daeun.kwon@brdunkin.co.kr",
    role: "hq_admin",
    scope: "매장 전체",
    lastLogin: "어제 21:05",
    status: "활성",
  },
  {
    name: "유민재",
    email: "minjae.yu@partner.co.kr",
    role: "ops_partner",
    scope: "리포트 전용",
    lastLogin: "어제 17:22",
    status: "활성",
  },
  {
    name: "정하늘",
    email: "haneul.jung@brdunkin.co.kr",
    role: "store_owner",
    scope: "광명시01점",
    lastLogin: "2일 전 19:14",
    status: "비활성",
  },
  {
    name: "이찬우",
    email: "chanwoo.lee@brdunkin.co.kr",
    role: "store_owner",
    scope: "강릉시01점",
    lastLogin: "오늘 07:36",
    status: "활성",
  },
  {
    name: "신예린",
    email: "yerin.shin@brdunkin.co.kr",
    role: "hq_admin",
    scope: "매장 전체",
    lastLogin: "오늘 09:02",
    status: "활성",
  },
];

export const MOCK_SYNC_LOG_ROWS = [
  ["04-20 09:10", "매출 원천", "성공", "1분 42초", "482,104"],
  ["04-20 09:08", "주문·생산", "성공", "58초", "127,330"],
  ["04-19 23:30", "상권·유동인구", "실패", "타임아웃", "0"],
] as const;
