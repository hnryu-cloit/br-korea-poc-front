import { PageHero } from "@/commons/components/page/page-layout";
import dayjs from "dayjs";

export function ProductionHero({
  updatedAt,
  title,
  description,
}: {
  updatedAt?: string;
  title: string;
  description: string;
}) {
  const formattedUpdatedAt = updatedAt ? dayjs(updatedAt).format("YYYY-MM-DD HH:mm") : undefined;

  return (
    <PageHero title={title} description={description} updatedAt={formattedUpdatedAt}></PageHero>
  );
}
