import { useNavigate } from "react-router-dom";

import type { DemoRole } from "@/commons/components/layout/menu";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";
import admin from "@/assets/admin.svg";
import manager from "@/assets/manager.svg";
import { ArrowRightIcon } from "lucide-react";

type RoleCard = {
  role: DemoRole;
  title: string;
  descriptionLines: string[];
  targetPath: string;
  bulletPoints: string[];
  borderColor: string;
};

const roleCards: RoleCard[] = [
  {
    role: "store_owner",
    title: "점주 담당자",
    descriptionLines: [
      "매장 운영에 집중하세요.\n생산, 발주, 매출 현황을 한눈에 확인하고\n빠르게 실행할 수 있습니다.",
    ],
    targetPath: "/dashboard",
    bulletPoints: [
      "오늘의 할 일 관리",
      "실시간 매장 대시보드",
      "빠른 주문 및 생산 실행",
      "매출 및 손익 분석",
    ],
    borderColor: "#FF671F",
  },
  {
    role: "hq_admin",
    title: "본사 관리자",
    descriptionLines: [
      "전체 매장을 모니터링하세요.\n매장별 핵심 지표를 확인하고,\n이상 시그널에 선제적으로 대응할 수 있습니다.",
    ],
    targetPath: "/settings",
    bulletPoints: ["시스템 현황 모니터링", "매출 시그널 감지", "설정 및 접근 제어"],
    borderColor: "#D31F8A",
  },
];

export function RoleSelectionPage() {
  const navigate = useNavigate();
  const { setRole } = useDemoSession();

  const handleSelectRole = (role: DemoRole, targetPath: string) => {
    setRole(role);
    navigate(targetPath);
  };

  return (
    <section className="bg-[#F9F9F9] px-6 py-[72px]">
      <div className="mx-auto flex max-w-[1000px] flex-col items-center gap-10 xl:flex-row xl:items-start xl:justify-center xl:gap-[120px]">
        {roleCards.map((card) => (
          <article
            key={card.role}
            className="flex h-[512px] w-full max-w-[440px] flex-col gap-6 rounded-[16px] border-[3px] bg-white px-[40px] py-[32px] shadow-[0_20px_40px_rgba(17,24,39,0.08)] justify-between"
            style={{ borderColor: card.borderColor }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <img
                  src={card.role === "store_owner" ? manager : admin}
                  className="h-[72px] w-[72px]"
                />
                <h1 className="text-[30px] font-bold leading-[1.33] text-brown-700">
                  {card.title}
                </h1>
                <div className="text-[16px] leading-[1.5] text-brown-700 whitespace-pre-line">
                  {card.descriptionLines}
                </div>
              </div>

              <div>
                <div className="rounded-[8px] bg-[#E2E8F0CC] p-4 flex flex-col gap-2">
                  <p className="text-[16px] font-bold leading-6 text-brown-700">주요 기능</p>
                  <ul className="flex flex-col gap-1 pl-4 text-[14px] leading-5 text-brown-700 list-disc">
                    {card.bulletPoints.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                {card.role === "hq_admin" && (
                  <span className="text-xs text-[#E7000B]">
                    * 해당 페이지는 목업 구현 화면이며, 실제 데이터가 아닙니다.
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSelectRole(card.role, card.targetPath)}
              className="inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-[4px] bg-[linear-gradient(90deg,#FF6A00_0%,#D31F8A_100%)] px-4 text-[18px] font-bold leading-none text-white"
            >
              <span>입장하기</span>
              <ArrowRightIcon />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
