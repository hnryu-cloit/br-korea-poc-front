export function DashboardLoadingSkeleton() {
  return (
    <>
      <section className="rounded-[28px] border border-border bg-white shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="grid gap-6 p-6 lg:grid-cols-3">
          <div className="animate-pulse lg:col-span-1">
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <div className="h-7 w-full rounded bg-slate-200" />
              <div className="mt-3 grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, index) => (
                  <div key={index} className="h-7 rounded bg-slate-100" />
                ))}
              </div>
            </div>
            <div className="mt-3 h-4 w-40 rounded bg-slate-100" />
          </div>

          <div className="animate-pulse lg:col-span-2">
            <div className="flex gap-2">
              <div className="h-8 w-20 rounded-full bg-slate-200" />
              <div className="h-8 w-20 rounded-full bg-slate-100" />
            </div>
            <div className="mt-4 space-y-2">
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="h-4 w-3/5 rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-4/5 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4">
        <div className="h-12 w-full rounded-xl bg-slate-100" />
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 shadow-[0_6px_18px_rgba(16,32,51,0.04)]"
          >
            <div className="h-3 w-20 rounded bg-slate-200" />
            <div className="mt-3 h-7 w-24 rounded bg-slate-200" />
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-[28px] border border-slate-100 bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="h-5 w-36 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
              </div>
              <div className="h-9 w-9 rounded-xl bg-slate-100" />
            </div>
            <div className="mt-5 space-y-3">
              <div className="h-16 rounded-xl bg-slate-100" />
              <div className="h-14 rounded-xl bg-slate-100" />
              <div className="h-20 rounded-xl bg-slate-100" />
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
