import { useRbacPanel } from "@/features/admin/orchestration/hooks/useRbacPanel";
import type {
  SettingsModalKey,
  UserRole,
} from "@/features/admin/orchestration/types/orchestration";

type Props = {
  onOpenModal: (key: SettingsModalKey) => void;
};

function getRoleBadge(role: UserRole) {
  if (role === "hq_admin") return "b bo";
  if (role === "store_owner") return "b bb";
  return "b bg";
}

export function RbacPanel({ onOpenModal }: Props) {
  const { filteredMembers, searchText, setSearchText, roleFilter, setRoleFilter } = useRbacPanel();

  return (
    <section>
      <div className="pgh">
        <div className="pgh-l">
          <h1>RBAC & 접근 제어</h1>
          <p>역할 기반 접근 통제 · 권한 매트릭스 · 데이터 범위 · 멤버 관리</p>
        </div>
        <div className="pgh-r">
          <button
            type="button"
            className="btn btn-g btn-sm"
            onClick={() => onOpenModal("perm-matrix")}
          >
            권한 매트릭스 전체 보기
          </button>
          <button
            type="button"
            className="btn btn-p btn-sm"
            onClick={() => onOpenModal("invite-member")}
          >
            + 멤버 초대
          </button>
        </div>
      </div>

      <div className="g3 mb-[12px]">
        <div className="card mb-0 border-t-[3px] border-t-[var(--orange)]">
          <div className="ch">
            <span className="ct">본사 관리자</span>
            <span className="b bgy">hq_admin</span>
          </div>
          <div className="mb-[10px] text-[11.5px] leading-[1.6] text-[var(--t2)]">
            전국 전체 매장 및 시스템 설정에 대한 완전한 접근 권한. Agent 설정, RBAC 변경, 감사 로그
            열람 가능.
          </div>
          <div className="flex flex-col gap-[5px]">
            <div className="flex justify-between text-[11.5px]">
              <span className="sub">데이터 범위</span>
              <span className="b bg">전국 전체</span>
            </div>
            <div className="flex justify-between text-[11.5px]">
              <span className="sub">Agent 접근</span>
              <span className="b bg">전체 Agent</span>
            </div>
            <div className="flex justify-between text-[11.5px]">
              <span className="sub">시스템 설정</span>
              <span className="b bg">변경 가능</span>
            </div>
            <div className="flex justify-between text-[11.5px]">
              <span className="sub">PII 접근</span>
              <span className="b ba">마스킹 적용</span>
            </div>
            <div className="flex justify-between text-[11.5px]">
              <span className="sub">현재 인원</span>
              <strong>4명</strong>
            </div>
          </div>
        </div>

        <div className="card mb-0 border-t-[3px] border-t-[var(--blue)]">
          <div className="ch">
            <span className="ct">가맹점주</span>
            <span className="b bgy">store_owner</span>
          </div>
          <div className="mb-[10px] text-[11.5px] leading-[1.6] text-[var(--t2)]">
            본인 매장 데이터에 한정된 접근. 생산·주문·매출 Agent 사용 가능. 타 매장 데이터 접근 시
            자동 차단.
          </div>
          <div className="flex flex-col gap-[5px]">
            <div className="flex justify-between text-[11.5px]">
              <span className="sub">데이터 범위</span>
              <span className="b bb">본인 매장만</span>
            </div>
            <div className="flex justify-between text-[11.5px]">
              <span className="sub">Agent 접근</span>
              <span className="b bb">3개 Agent</span>
            </div>
            <div className="flex justify-between text-[11.5px]">
              <span className="sub">시스템 설정</span>
              <span className="b br">불가</span>
            </div>
            <div className="flex justify-between text-[11.5px]">
              <span className="sub">PII 접근</span>
              <span className="b br">차단</span>
            </div>
            <div className="flex justify-between text-[11.5px]">
              <span className="sub">현재 인원</span>
              <strong>132명</strong>
            </div>
          </div>
        </div>

        <div className="card mb-0 border-t-[3px] border-t-[var(--teal)]">
          <div className="ch">
            <span className="ct">운영 파트너</span>
            <span className="b bgy">ops_partner</span>
          </div>
          <div className="mb-[10px] text-[11.5px] leading-[1.6] text-[var(--t2)]">
            읽기 전용 대시보드 접근. Agent 질의 불가, 집계 리포트만 열람. 개인식별정보 비노출.
          </div>
          <div className="flex flex-col gap-[5px]">
            <div className="flex justify-between text-[11.5px]">
              <span className="sub">데이터 범위</span>
              <span className="b bgy">집계 통계만</span>
            </div>
            <div className="flex justify-between text-[11.5px]">
              <span className="sub">Agent 접근</span>
              <span className="b br">불가</span>
            </div>
            <div className="flex justify-between text-[11.5px]">
              <span className="sub">시스템 설정</span>
              <span className="b br">불가</span>
            </div>
            <div className="flex justify-between text-[11.5px]">
              <span className="sub">다운로드</span>
              <span className="b br">차단</span>
            </div>
            <div className="flex justify-between text-[11.5px]">
              <span className="sub">현재 인원</span>
              <strong>9명</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-0">
        <div className="ch">
          <span className="ct">멤버 목록</span>
        </div>
        <div className="sb">
          <input
            className="si"
            placeholder="이름, 이메일 검색..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <select
            className="sel"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | "")}
          >
            <option value="">전체 역할</option>
            <option value="hq_admin">hq_admin</option>
            <option value="store_owner">store_owner</option>
            <option value="ops_partner">ops_partner</option>
          </select>
        </div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>이름</th>
                <th>이메일</th>
                <th>역할</th>
                <th>담당 범위</th>
                <th>마지막 로그인</th>
                <th>상태</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={`${member.email}-${member.role}`}>
                  <td className="font-semibold">{member.name}</td>
                  <td className="sub">{member.email}</td>
                  <td>
                    <span className={getRoleBadge(member.role)}>{member.role}</span>
                  </td>
                  <td className="sub">{member.scope}</td>
                  <td className="sub">{member.lastLogin}</td>
                  <td>
                    <span className={member.status === "활성" ? "b bg" : "b bgy"}>
                      {member.status}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="btn btn-g btn-sm">
                      편집
                    </button>
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
