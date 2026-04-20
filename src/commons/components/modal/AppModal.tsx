import type { ReactNode } from "react";

export function AppModal({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 z-40 bg-[rgba(0,0,0,0.52)]"
      />
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="relative z-50 max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
