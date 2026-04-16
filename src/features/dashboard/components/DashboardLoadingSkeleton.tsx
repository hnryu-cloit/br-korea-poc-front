export function DashboardLoadingSkeleton() {
  return (
    <>
      <section className="rounded-[28px] border border-orange-200 bg-white px-6 py-6 shadow-[0_12px_30px_rgba(16,32,51,0.06)]">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-44 rounded bg-slate-200" />
          <div className="h-4 w-80 rounded bg-slate-100" />
          <div className="grid gap-4 xl:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-5">
                <div className="h-4 w-20 rounded bg-slate-200" />
                <div className="mt-3 h-5 w-3/4 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-full rounded bg-slate-100" />
                <div className="mt-4 h-8 w-24 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <div className="h-3 w-20 rounded bg-slate-200" />
            <div className="mt-3 h-7 w-24 rounded bg-slate-200" />
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="animate-pulse rounded-[28px] border border-slate-100 bg-slate-50 px-6 py-6">
            <div className="h-5 w-36 rounded bg-slate-200" />
            <div className="mt-3 h-4 w-5/6 rounded bg-slate-100" />
            <div className="mt-4 h-24 rounded-2xl bg-slate-100" />
          </div>
        ))}
      </section>
    </>
  );
}
