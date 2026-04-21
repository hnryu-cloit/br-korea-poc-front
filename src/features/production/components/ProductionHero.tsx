import { PageHero } from "@/commons/components/page/page-layout";

export function ProductionHero({
  updatedAt,
  title,
  description,
}: {
  updatedAt?: string;
  title: string;
  description: string;
}) {
  return <PageHero title={title} description={description} updatedAt={updatedAt}></PageHero>;
}
