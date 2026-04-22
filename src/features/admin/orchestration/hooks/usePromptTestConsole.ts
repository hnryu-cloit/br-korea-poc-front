import { useState } from "react";

export function usePromptTestConsole() {
  const [testInput, setTestInput] = useState("");
  const [testOutput, setTestOutput] = useState("결과가 여기에 표시됩니다.");

  const runTest = () => {
    if (!testInput.trim()) return;
    setTestOutput("처리 중...");
    window.setTimeout(() => {
      setTestOutput(
        `[생산관리] 매장 S0042 기준, "${testInput}"\n\n▶ SQL 쿼리 생성 완료 (정확도 91%)\n▶ 응답 시간: 1.1s\n\n예시 응답: 현재 생산 우선 품목은 필드롱투(4개 잔여)와 도넛박스(5개, 마감 19분)입니다.`,
      );
    }, 800);
  };

  return {
    testInput,
    setTestInput,
    testOutput,
    runTest,
  };
}
