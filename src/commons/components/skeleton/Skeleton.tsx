import { cn } from "@/lib/utils";

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-[6px] bg-slate-200/80", className)}
    />
  );
}

export function SkeletonText({ className }: { className?: string }) {
  return <SkeletonBlock className={cn("h-4", className)} />;
}
