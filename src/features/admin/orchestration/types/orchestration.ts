export type PromptDomainKey = "production" | "ordering" | "sales";

export interface PromptDomainSettings {
  quick_prompts: string[];
  system_instruction: string;
  query_prefix_template: string;
}

export interface PromptSettingsResponse {
  version: number;
  updated_at: string;
  updated_by: string;
  domains: Record<string, PromptDomainSettings>;
}

export interface PromptSettingsUpdateRequest {
  domains: Record<string, PromptDomainSettings>;
  updated_by?: string;
}

export type SettingsPanelKey =
  | "agents"
  | "orch"
  | "connectors"
  | "rbac"
  | "prompts"
  | "golden"
  | "audit"
  | "quality"
  | "notices";

export type SettingsModalKey =
  | "new-agent"
  | "agent-config"
  | "add-rule"
  | "sync-log"
  | "perm-matrix"
  | "invite-member"
  | "prompt-test"
  | "embed-schedule"
  | "embed-now"
  | "notice-detail";

export type NoticeItem = {
  title: string;
  desc: string;
  date: string;
};

export type OrchestrationAgent = "생산관리" | "주문관리" | "매출관리";

export type UserRole = "hq_admin" | "store_owner" | "ops_partner";

export type AuditResult = "허용" | "차단";

export type GoldenHitResult = "HIT" | "MISS";

export type AuditRow = {
  id: string;
  time: string;
  user: string;
  role: Extract<UserRole, "hq_admin" | "store_owner">;
  agent: OrchestrationAgent;
  route: string;
  goldenHit: GoldenHitResult;
  duration: string;
  result: AuditResult;
};

export type RbacMember = {
  name: string;
  email: string;
  role: UserRole;
  scope: string;
  lastLogin: string;
  status: "활성" | "비활성";
};
