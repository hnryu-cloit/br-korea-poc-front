import { useNavigate } from "react-router-dom";

import type { DemoRole } from "@/commons/components/layout/menu";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

type RoleCard = {
  role: DemoRole;
  title: string;
  subtitle: string;
  description: string;
  targetPath: string;
  bulletPoints: string[];
  icon: string;
};

const roleCards: RoleCard[] = [
  {
    role: "store_owner",
    title: "점주",
    subtitle: "매장 운영 중심 화면",
    description: "생산, 주문, 손익을 매장 기준으로 빠르게 확인하고 바로 실행합니다.",
    targetPath: "/dashboard",
    bulletPoints: ["오늘 할 일 대시보드", "주문/생산 실행", "매출 질의 분석"],
    icon: "storefront",
  },
  {
    role: "hq_admin",
    title: "본사",
    subtitle: "담당 매장 모니터링 화면",
    description: "매장별 점검과 코칭 지표를 확인하고 이상 시그널에 선제 대응합니다.",
    targetPath: "/settings",
    bulletPoints: ["시스템 현황 모니터링", "매출 시그널 감지", "설정 및 접근 제어"],
    icon: "apartment",
  },
];

export function RoleSelectionPage() {
  const navigate = useNavigate();
  const { user, setRole } = useDemoSession();

  const handleSelectRole = (role: DemoRole, targetPath: string) => {
    setRole(role);
    navigate(targetPath);
  };

  return (
    <section className="mx-auto w-full max-w-[1080px]">
      <div className="grid gap-5 md:grid-cols-2">
        {roleCards.map((card) => {
          const isCurrentRole = user.role === card.role;
          return (
            <article
              key={card.role}
              className={`group relative mx-auto flex aspect-square w-full max-w-[460px] flex-col overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition-all ${isCurrentRole ? "border-[#2c61d6] shadow-[0_16px_44px_rgba(44,97,214,0.16)]" : "border-border hover:border-[#bfcced]"}`}
            >
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#2c61d6]">{card.subtitle}</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">{card.title}</h2>
                  </div>
                  <span className="material-symbols-outlined rounded-xl bg-[#eef4ff] p-2 text-[#2c61d6]">
                    {card.icon}
                  </span>
                </div>
                <div className="mt-4 transition-opacity duration-200 group-hover:opacity-0">
                  <p className="text-sm leading-relaxed text-slate-600">{card.description}</p>
                  <ul className="mt-4 space-y-2">
                    {card.bulletPoints.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-sm text-slate-700">
                        <span className="material-symbols-outlined text-[18px] text-[#2c61d6]">
                          check_circle
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pointer-events-none absolute inset-x-0 top-[102px] px-6 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="rounded-2xl border border-[#d8e5ff] bg-[#f6f9ff] p-4">
                    <p className="text-sm font-semibold text-slate-900">{card.title} 모드로 전환</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      이 역할 기준 메뉴와 데이터 범위로 바로 이동합니다.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectRole(card.role, card.targetPath)}
                  className={`mt-auto inline-flex w-full items-center justify-center gap-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${isCurrentRole ? "bg-[#2c61d6] text-white hover:bg-[#214faf]" : "bg-[#edf3ff] text-[#2c61d6] hover:bg-[#deebff]"}`}
                >
                  {isCurrentRole ? "현재 역할로 이동" : "들어가기"}
                  <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
