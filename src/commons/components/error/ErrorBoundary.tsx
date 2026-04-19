import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
          <p className="text-lg font-bold text-slate-800">예상치 못한 오류가 발생했습니다.</p>
          <p className="max-w-sm text-sm text-slate-500">
            {this.state.error?.message ?? "페이지를 새로고침하거나 잠시 후 다시 시도해 주세요."}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-2xl bg-[#2454C8] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1d44a8]"
          >
            새로고침
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
