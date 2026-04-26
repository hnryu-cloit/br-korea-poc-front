import { SkeletonBlock, SkeletonText } from "@/commons/components/skeleton/Skeleton";

function SkeletonQuestionList() {
  return (
    <div className="mt-3 space-y-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex min-h-12 items-center justify-between gap-4 rounded-[8px] border border-[#DADADA] bg-white px-4 py-3"
        >
          <SkeletonText className="h-5 w-[78%]" />
          <SkeletonBlock className="h-8 w-8 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function SummaryCardBodySkeleton({ variant }: { variant: "list" | "ordering" | "chart" }) {
  if (variant === "ordering") {
    return (
      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-2">
          <SkeletonText className="h-6 w-36" />
          <div className="rounded-[8px] border border-[#ED8CC2] bg-[#F6C5E0]/10 px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <SkeletonText className="h-5 w-40" />
              <SkeletonBlock className="h-5 w-5 rounded-full" />
            </div>
            <SkeletonText className="mt-4 h-4 w-full" />
            <SkeletonText className="mt-2 h-4 w-[72%]" />
            <SkeletonBlock className="mt-4 h-10 w-full rounded-[8px]" />
          </div>
        </section>
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <SkeletonText className="h-6 w-28" />
            <SkeletonBlock className="h-8 w-24 rounded-[4px]" />
          </div>
          <DashboardListRowsSkeleton rows={3} />
        </section>
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <section className="flex flex-col gap-2">
        <SkeletonText className="h-6 w-20" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <article key={index} className="rounded-[14px] border border-[#D9D3CD] p-4">
              <div className="flex items-start justify-between gap-4">
                <SkeletonText className="h-5 w-24" />
                <div className="flex w-40 flex-col items-end gap-2">
                  <SkeletonText className="h-5 w-28" />
                  <SkeletonText className="h-4 w-36" />
                </div>
              </div>
              <SkeletonBlock className="mt-4 h-[92px] w-full rounded-[2px]" />
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <SkeletonText className="h-6 w-40" />
        <SkeletonText className="h-4 w-28" />
      </div>
      <DashboardListRowsSkeleton rows={5} />
    </section>
  );
}

function DashboardListRowsSkeleton({ rows }: { rows: number }) {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-end gap-2 rounded-lg border border-[#DADADA] bg-white p-4"
        >
          <div className="flex w-full items-end justify-between gap-4">
            <SkeletonText className="h-5 w-[45%]" />
            <SkeletonText className="h-5 w-16" />
          </div>
          <SkeletonText className="h-4 w-[80%]" />
        </div>
      ))}
    </div>
  );
}

export function DashboardNoticesSkeleton() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-[89px]">
      <div className="grid min-w-0 flex-1 gap-x-[134px] gap-y-[10px] lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex min-w-0 items-center gap-2">
            {index === 0 ? <SkeletonBlock className="h-5 w-12 rounded-xl" /> : null}
            <SkeletonText className="h-5 w-full" />
          </div>
        ))}
      </div>
      <SkeletonBlock className="h-8 w-20 shrink-0 rounded-[4px]" />
    </div>
  );
}

export function DashboardSchedulePanelSkeleton() {
  return (
    <section
      aria-label="나의 할 일 로딩 중"
      className="flex h-[430px] min-h-[430px] max-h-[430px] flex-col gap-[8px] overflow-hidden bg-white p-[24px_48px]"
    >
      <span className="text-lg font-bold text-brown-700">나의 할 일</span>
      <div className="grid min-h-0 flex-1 items-stretch gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <SkeletonText className="mx-auto h-6 w-32" />
          <div className="mt-4 grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <SkeletonText key={index} className="h-4 rounded-[4px]" />
            ))}
            {Array.from({ length: 35 }).map((_, index) => (
              <SkeletonBlock key={index} className="aspect-square rounded-full" />
            ))}
          </div>
        </div>
        <div className="flex h-full min-h-0 flex-col overflow-hidden lg:col-span-2">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#FAF4F2CC]">
            <div className="flex border-b border-[rgba(99,107,116,0.3)]">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex h-10 items-center gap-2 px-4">
                  <SkeletonText className="h-5 w-16" />
                  <SkeletonBlock className="h-5 w-7 rounded-full" />
                </div>
              ))}
            </div>
            <div className="min-h-0 flex-1 p-[12px_20px]">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 border-b border-[#E9D6CE] px-4 py-3"
                >
                  <SkeletonBlock className="h-4 w-4 shrink-0 rounded-full" />
                  <SkeletonText className="h-5 w-[70%]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DashboardAlertSummarySkeleton() {
  return (
    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-[16px]">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[6px]">
          <div className="h-[4px] bg-[linear-gradient(135deg,#FF6E00_0%,#DA1884_100%)]" />
          <div className="flex min-w-0 w-full flex-col items-start gap-[16px] rounded-b-[6px] border border-t-0 border-[#FFD9C7] bg-white p-[24px]">
            <div className="flex min-w-0 w-full flex-col gap-[12px]">
              <SkeletonText className="h-5 w-28" />
              <div className="flex items-center gap-[8px]">
                <SkeletonText className="h-8 w-20" />
                <SkeletonText className="h-6 w-[55%]" />
              </div>
            </div>
            <SkeletonBlock className="h-[40px] w-[200px] rounded-[4px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SummaryCardsSectionSkeleton() {
  const variants: Array<"list" | "ordering" | "chart"> = ["list", "ordering", "chart"];

  return (
    <section className="grid gap-5 xl:grid-cols-3">
      {variants.map((variant) => (
        <article key={variant} className="rounded-[8px] border border-[#DADADA] bg-white p-6">
          <div className="flex items-center gap-[4px]">
            <SkeletonBlock className="h-8 w-8 shrink-0 rounded-full" />
            <SkeletonText className="h-8 w-32" />
          </div>
          <div className="mt-4 border-t border-[#DADADA] pt-5">
            <div className="flex items-center justify-between">
              <SkeletonText className="h-7 w-28" />
              <SkeletonBlock className="h-8 w-24 rounded-[4px]" />
            </div>
            <SkeletonQuestionList />
          </div>
          <div className="mt-5 border-t border-[#DADADA] pt-5">
            <SummaryCardBodySkeleton variant={variant} />
          </div>
        </article>
      ))}
    </section>
  );
}
