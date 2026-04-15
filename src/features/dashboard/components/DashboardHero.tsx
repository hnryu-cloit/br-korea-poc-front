import { PageHero } from "@/commons/components/page/page-layout";

export function DashboardHero({ updatedAt }: { updatedAt?: string }) {
  return (
    <PageHero
      title="오늘의 운영 현황"
      description="오늘 진행 상황 요약, 주요 변경 알림, 손익 인사이트를 한 화면에서 확인해보세요."
      updatedAt={updatedAt}
    />
  );
}
