import type { PropsWithChildren } from "react";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">AgentGo Product System MVP</p>
        <h1>br-korea-poc</h1>
        <p className="hero-copy">기획문서에서 생성된 feature seed를 바로 검토하고 MVP 흐름을 확인할 수 있는 기본 화면입니다.</p>
      </header>
      <main className="content">{children}</main>
    </div>
  );
}
