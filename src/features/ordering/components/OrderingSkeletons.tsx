import { SkeletonBlock, SkeletonText } from "@/commons/components/skeleton/Skeleton";

function TableRowSkeleton({
  columns,
}: {
  columns: Array<{ widthClass: string; align?: "left" | "right" | "center" }>;
}) {
  return (
    <tr className="border-b border-[#DADADA] bg-white last:border-b-0">
      {columns.map((column, index) => (
        <td
          key={index}
          className={`px-3 py-3 ${column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left"}`}
        >
          <SkeletonText
            className={`h-5 ${column.widthClass} ${
              column.align === "right" ? "ml-auto" : column.align === "center" ? "mx-auto" : ""
            }`}
          />
        </td>
      ))}
    </tr>
  );
}

export function OrderingContextCardsSkeleton() {
  return (
    <section className="grid gap-4 lg:grid-cols-[320fr_578fr_336fr]">
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={index}
          className="flex min-w-0 w-full flex-col gap-3 rounded-[6px] border border-[#FFD9C7] border-t-[4px] bg-white p-[24px]"
        >
          <SkeletonText className="h-5 w-16" />
          <SkeletonText
            className={`h-7 ${index === 1 ? "w-[90%]" : index === 2 ? "w-[70%]" : "w-[60%]"}`}
          />
        </article>
      ))}
    </section>
  );
}

export function OrderingDeadlineAlertSkeleton() {
  return (
    <section className="overflow-hidden rounded-[6px] border border-t-4 border-[#FFD9C7] bg-white p-6">
      <SkeletonText className="mb-4 h-6 w-48" />
      <div className="overflow-x-auto border">
        <table className="w-full min-w-[960px] table-fixed border-collapse">
          <thead>
            <tr className="border-b border-[#DADADA] bg-[#FFD9C7]/50">
              {Array.from({ length: 3 }).map((_, index) => (
                <th
                  key={index}
                  className="px-4 py-2.5 text-left text-sm font-bold leading-7 text-[#653819]"
                >
                  <SkeletonText className="h-5 w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRowSkeleton
                key={index}
                columns={[
                  { widthClass: "w-[72%]", align: "left" },
                  { widthClass: "w-[52%]", align: "left" },
                  { widthClass: "w-[52%]", align: "left" },
                ]}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <SkeletonBlock className="h-10 w-40 rounded-[4px]" />
      </div>
    </section>
  );
}

export function OrderingOptionsSectionSkeleton() {
  return (
    <section className="flex flex-col items-center">
      <div className="flex flex-col items-center gap-5">
        <SkeletonText className="h-8 w-48" />
        <SkeletonText className="h-6 w-[70%]" />
      </div>
      <div className="mt-[24px] grid w-full gap-[24px] xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <article
            key={index}
            className="relative rounded-[8px] border border-[#DADADA] bg-white p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <SkeletonText className="h-7 w-32" />
              <SkeletonText className="h-5 w-16" />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {Array.from({ length: 4 }).map((__, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center justify-between rounded-[8px] bg-[#DADADA]/40 px-3 py-2"
                >
                  <SkeletonText className="h-5 w-[60%]" />
                  <SkeletonText className="h-5 w-14" />
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-[8px] border border-[#FFB38F] bg-[#FFD9C7]/10 px-4 py-3">
              <div className="flex items-center justify-between">
                <SkeletonText className="h-5 w-28" />
                <SkeletonBlock className="h-5 w-5 rounded-full" />
              </div>
              <SkeletonText className="mt-3 h-4 w-full" />
              <SkeletonText className="mt-2 h-4 w-[86%]" />
            </div>
          </article>
        ))}
      </div>
      <SkeletonBlock className="mt-10 h-8 w-[328px] rounded-[4px]" />
    </section>
  );
}

export function OrderingHistoryChartsSkeleton() {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <article
          key={index}
          className={`rounded-[6px] border border-border bg-white px-5 py-5 shadow-[0_10px_24px_rgba(16,32,51,0.06)] ${
            index === 0 ? "xl:col-span-2" : ""
          }`}
        >
          <SkeletonText className="h-5 w-48" />
          <SkeletonText className="mt-1 h-4 w-32" />
          <SkeletonBlock className="mt-5 h-[220px] w-full rounded-[8px]" />
        </article>
      ))}
    </section>
  );
}

export function OrderingHistoryInsightsSkeleton() {
  return (
    <section className="rounded-[6px] border border-[#DADADA] bg-white p-2 flex flex-col gap-2">
      <SkeletonText className="h-5 w-24" />
      <div className="grid gap-2 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <article key={index} className="rounded-[8px] border border-[#DADADA] bg-white p-6">
            <SkeletonText className="h-8 w-32" />
            <SkeletonBlock className="mt-4 h-px w-full" />
            <div className="mt-6 flex flex-col gap-2">
              {Array.from({ length: 3 }).map((__, itemIndex) => (
                <div
                  key={itemIndex}
                  className="rounded-[8px] border border-[#DADADA] bg-white p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-4">
                    <SkeletonText className="h-5 w-[58%]" />
                    <SkeletonBlock className="h-7 w-16 rounded-[24px]" />
                  </div>
                  <SkeletonText className="h-4 w-[76%]" />
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function OrderingHistoryTableSkeleton() {
  return (
    <section className="rounded-[6px] border border-[#DADADA] bg-white p-2">
      <div className="mb-5 flex items-center gap-2">
        <SkeletonText className="h-6 w-24" />
        <SkeletonText className="h-4 w-20" />
      </div>

      <div className="overflow-x-auto border border-[#DADADA] rounded-[4px]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#DADADA] bg-[#FFD9C7]/50">
              {Array.from({ length: 5 }).map((_, index) => (
                <th
                  key={index}
                  className="px-4 py-2.5 text-left text-sm font-bold leading-7 text-[#653819]"
                >
                  <SkeletonText className="h-5 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-3">
                  <SkeletonText className="h-5 w-24" />
                </td>
                <td className="px-4 py-3">
                  <SkeletonText className="h-5 w-[72%]" />
                </td>
                <td className="px-4 py-3">
                  <SkeletonText className="h-5 w-16" />
                </td>
                <td className="px-4 py-3">
                  <SkeletonText className="h-5 w-16" />
                </td>
                <td className="px-4 py-3">
                  <SkeletonBlock className="h-7 w-16 rounded-[24px]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SkeletonBlock className="mt-4 h-10 w-64 rounded-[4px]" />
    </section>
  );
}
