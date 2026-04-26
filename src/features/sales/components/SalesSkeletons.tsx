import { SkeletonBlock, SkeletonText } from "@/commons/components/skeleton/Skeleton";

export function SalesInsightsSkeleton() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={index}
          className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)] flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <SkeletonText className="h-5 w-28" />
            <SkeletonText className="h-4 w-full" />
          </div>
          <div className="flex flex-col gap-1">
            {Array.from({ length: 3 }).map((__, metricIndex) => (
              <div
                key={metricIndex}
                className="rounded-[8px] bg-[#DADADA66] px-3 py-2 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between gap-3">
                  <SkeletonText className="h-4 w-[55%]" />
                  <SkeletonText className="h-4 w-14" />
                </div>
                <SkeletonText className="h-3 w-[70%]" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 2 }).map((__, actionIndex) => (
              <div
                key={actionIndex}
                className="flex items-center gap-2 border border-[#FFB38F] rounded-xl bg-[#FFD9C71A] px-3 py-2"
              >
                <SkeletonBlock className="h-4 w-4 rounded-full" />
                <SkeletonText className="h-4 w-[78%]" />
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

export function SalesChartsSkeleton() {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <article
          key={index}
          className={`rounded-[6px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)] ${
            index === 0 || index === 5 ? "xl:col-span-2" : ""
          }`}
        >
          <div className="mb-4 flex items-center gap-2">
            <SkeletonText className="h-5 w-40" />
            <SkeletonText className="h-4 w-24" />
          </div>
          <SkeletonBlock className="h-[220px] w-full rounded-[8px]" />
        </article>
      ))}
    </section>
  );
}

export function SalesOpportunitySkeleton() {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-10 w-28 rounded-2xl" />
        ))}
      </div>
      <article className="rounded-[28px] border border-border bg-white px-5 py-5 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <SkeletonText className="h-5 w-48" />
            <SkeletonText className="h-4 w-24" />
          </div>
          <SkeletonBlock className="h-6 w-14 rounded-full" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-2xl bg-[#f8fbff] px-3 py-3">
              <SkeletonText className="h-3 w-20" />
              <SkeletonText className="mt-2 h-5 w-24" />
            </div>
          ))}
        </div>
        <SkeletonBlock className="mt-4 h-24 w-full rounded-2xl" />
        <SkeletonText className="mt-4 h-10 w-full rounded-xl" />
      </article>
    </section>
  );
}
