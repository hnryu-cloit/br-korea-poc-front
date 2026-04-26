import { SkeletonBlock, SkeletonText } from "@/commons/components/skeleton/Skeleton";

export function AnalyticsSummarySkeleton() {
  return (
    <section className="rounded-[6px] border border-[#DADADA] bg-white px-8 py-6 xl:min-h-full">
      <div className="flex h-full min-h-[104px] flex-col justify-between gap-4">
        <SkeletonText className="h-4 w-40" />
        <SkeletonText className="h-12 w-56" />
      </div>
    </section>
  );
}

export function AnalyticsMetricsSkeleton() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <article
          key={index}
          className="rounded-[6px] border border-[#DADADA] bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)] flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <SkeletonText className="h-4 w-28" />
            <SkeletonText className="h-3 w-24" />
          </div>
          <SkeletonText className="h-8 w-24" />
          <SkeletonBlock className="h-8 w-20 rounded-[24px]" />
        </article>
      ))}
    </section>
  );
}

export function SalesTrendSkeleton() {
  return (
    <section className="overflow-hidden rounded-[6px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
      <div className="border-b border-border/60 px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <SkeletonText className="h-5 w-40" />
            <SkeletonText className="h-4 w-64" />
            <SkeletonText className="h-3 w-72" />
          </div>
          <SkeletonBlock className="h-8 w-24 rounded-full" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <SkeletonText className="h-4 w-20" />
          {Array.from({ length: 2 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-8 w-24 rounded-full" />
          ))}
        </div>
        <div className="mt-4 flex gap-1">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>
      <div className="px-4 py-5">
        <SkeletonBlock className="h-[240px] w-full rounded-[8px]" />
      </div>
      <div className="border-t border-border/40 px-6 py-4">
        <SkeletonText className="mb-2 h-4 w-28" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-8 w-28 rounded-full" />
          ))}
        </div>
      </div>
    </section>
  );
}
