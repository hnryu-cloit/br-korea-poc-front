import { SkeletonBlock, SkeletonText } from "@/commons/components/skeleton/Skeleton";

export function ProductionTableRowsSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="border-b border-[#DADADA] bg-white last:border-0">
          <td className="px-4 py-4">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="h-10 w-10 shrink-0 rounded-[4px]" />
              <SkeletonText className="h-5 w-44" />
            </div>
          </td>
          <td className="px-6 py-4">
            <SkeletonBlock className="h-7 w-20 rounded-full" />
          </td>
          <td className="px-4 py-4">
            <SkeletonText className="h-5 w-14" />
          </td>
          <td className="px-4 py-4">
            <SkeletonText className="h-5 w-16" />
          </td>
          <td className="px-4 py-4">
            <div className="flex items-center gap-2">
              <SkeletonBlock className="h-4 w-4 rounded-full" />
              <SkeletonText className="h-5 w-24" />
            </div>
          </td>
          <td className="px-4 py-4">
            <SkeletonBlock className="h-8 w-[86px] rounded-[4px]" />
          </td>
        </tr>
      ))}
    </>
  );
}

export function ProductionWasteSummarySkeleton() {
  return (
    <div className="grid grid-cols-[338fr_928fr] overflow-hidden rounded-[6px] border border-[#FFD9C7] border-t-[4px] bg-white p-[24px]">
      <div className="flex shrink-0 flex-col gap-3">
        <SkeletonText className="h-5 w-24" />
        <SkeletonText className="h-8 w-32" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-[8px] bg-[#DADADA]/20 px-6 py-3">
        <SkeletonText className="h-5 w-40" />
        <div className="flex min-w-0 flex-col gap-3 xl:flex-row">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`flex min-w-0 flex-1 items-center justify-between rounded-[2px] px-4 py-2.5 ${
                index === 0 ? "bg-[#FFC9C9]" : index === 1 ? "bg-[#FFE2E2]" : "bg-[#FEF2F2]"
              }`}
            >
              <SkeletonText className="h-5 w-[60%]" />
              <div className="ml-3 flex shrink-0 items-center gap-2">
                <SkeletonBlock className="h-6 w-6 rounded-full" />
                <SkeletonText className="h-5 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductionWasteTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="bg-white border-b border-[#DADADAS]">
          <td className="px-4 py-4">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="h-10 w-10 shrink-0 rounded-[4px]" />
              <SkeletonText className="h-5 w-44" />
            </div>
          </td>
          <td className="px-6 py-4 text-right">
            <SkeletonText className="ml-auto h-5 w-16" />
          </td>
          <td className="px-6 py-4 text-right">
            <SkeletonText className="ml-auto h-5 w-20" />
          </td>
          <td className="px-6 py-4 text-right">
            <SkeletonText className="ml-auto h-5 w-20" />
          </td>
        </tr>
      ))}
    </>
  );
}

export function ProductionInventoryStatusSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <section className="overflow-hidden">
      <div className="flex flex-col gap-10">
        <div className="overflow-x-auto rounded-[4px] border border-[#DADADA]">
          <table className="w-full min-w-[1080px] whitespace-nowrap text-sm">
            <thead>
              <tr className="border-b border-[#DADADA] bg-[#FFD9C780]">
                <th className="px-4 py-2.5">
                  <SkeletonText className="h-5 w-20" />
                </th>
                <th className="px-6 py-2.5">
                  <SkeletonText className="h-5 w-24" />
                </th>
                <th className="px-6 py-2.5">
                  <SkeletonText className="ml-auto h-5 w-24" />
                </th>
                <th className="px-6 py-2.5">
                  <SkeletonText className="ml-auto h-5 w-20" />
                </th>
                <th className="px-6 py-2.5">
                  <SkeletonText className="ml-auto h-5 w-14" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, index) => (
                <tr key={index} className="border-b border-[#DADADA] bg-white">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <SkeletonBlock className="h-10 w-10 shrink-0 rounded-[4px]" />
                      <SkeletonText className="h-5 w-40" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <SkeletonBlock className="h-5 w-24 rounded-full" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <SkeletonText className="ml-auto h-5 w-16" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <SkeletonText className="ml-auto h-5 w-16" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <SkeletonBlock className="ml-auto h-6 w-14 rounded-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function FifoLotSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-[#DADADA] bg-white px-4 py-3">
            <SkeletonText className="h-4 w-16" />
            <SkeletonText className="mt-2 h-7 w-20" />
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[4px] border border-[#DADADA]">
        <table className="w-full min-w-[900px] whitespace-nowrap text-sm">
          <thead>
            <tr className="border-b border-[#DADADA] bg-[#FFD9C780]">
              {Array.from({ length: 7 }).map((_, index) => (
                <th key={index} className="px-4 py-2.5">
                  <SkeletonText className={index === 0 ? "h-5 w-20" : "ml-auto h-5 w-16"} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, index) => (
              <tr key={index} className="border-b border-[#DADADA] bg-white">
                <td className="px-4 py-3">
                  <SkeletonText className="h-5 w-40" />
                </td>
                <td className="px-4 py-3 text-center">
                  <SkeletonBlock className="mx-auto h-5 w-16 rounded-full" />
                </td>
                <td className="px-4 py-3 text-center">
                  <SkeletonText className="mx-auto h-5 w-14" />
                </td>
                <td className="px-4 py-3 text-right">
                  <SkeletonText className="ml-auto h-5 w-16" />
                </td>
                <td className="px-4 py-3 text-right">
                  <SkeletonText className="ml-auto h-5 w-16" />
                </td>
                <td className="px-4 py-3 text-right">
                  <SkeletonText className="ml-auto h-5 w-16" />
                </td>
                <td className="px-4 py-3 text-right">
                  <SkeletonText className="ml-auto h-5 w-16" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
