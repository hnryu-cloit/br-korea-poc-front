import { PageHero } from "@/commons/components/page/page-layout";

export function DashboardHero({ updatedAt }: { updatedAt?: string }) {
  return (
    <PageHero
      title="오늘의 운영 현황"
      description="오늘 할 일, 주요 일정 및 현황을 한 눈에 확인해보세요."
      updatedAt={updatedAt}
    />
  );
}
