import { ChevronDown, Clock3, RotateCcw } from "lucide-react";
import { useState } from "react";

import { REFERENCE_DATE_DEFAULT_LABEL } from "@/commons/constants/header";
import { sessionDefaults } from "@/features/session/constants/session-user";
import { useDemoSession } from "@/features/session/hooks/useDemoSession";

export function ReferenceDate() {
  const [isOpen, setIsOpen] = useState(false);
  const { referenceDateTime, setReferenceDateTime } = useDemoSession();
  const [draft, setDraft] = useState(referenceDateTime);

  const close = () => setIsOpen(false);

  const handleToggle = () => {
    if (!isOpen) {
      setDraft(referenceDateTime);
    }
    setIsOpen((value) => !value);
  };

  const handleApply = () => {
    setReferenceDateTime(draft || sessionDefaults.referenceDateTime);
    close();
  };

  const handleCancel = () => {
    setDraft(referenceDateTime);
    close();
  };

  const handleResetDraft = () => {
    setDraft(sessionDefaults.referenceDateTime);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="flex h-[42px] w-[230px] items-center justify-between rounded-xl border border-[#FFB38F] bg-[#FFD9C71A] px-[10px] transition-colors hover:border-[#bfd1ed]"
        aria-label="기준 일자 및 시간 설정"
      >
        <div className="flex items-center gap-2">
          <div className="grid size-7 place-items-center text-orange-500">
            <Clock3 className="h-4 w-4" />
          </div>
          <div className="min-w-0 text-left">
            <p className="text-[11px] leading-tight text-brown-700">기준 일자 및 시간</p>
            <p className="truncate text-[12px] font-semibold leading-tight text-slate-800">
              {referenceDateTime.replace("T", " ")}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            onClick={handleCancel}
            aria-label="기준 일시 메뉴 닫기"
          />
          <div className="absolute right-0 top-12 z-50 w-[290px] overflow-hidden rounded-2xl border border-border bg-white shadow-[0_24px_60px_rgba(31,77,187,0.16)]">
            <div className="border-b border-border/70 px-4 py-3">
              <p className="text-xs font-semibold text-slate-500">데이터 검증 기준</p>
            </div>
            <div className="space-y-3 px-4 py-3">
              <label className="space-y-1.5">
                <span className="text-xs font-medium text-slate-600">기준 일시</span>
                <input
                  type="datetime-local"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  className="w-full rounded-lg border border-[#d5def0] bg-white px-2.5 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-[#9ab8ef]"
                />
              </label>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] text-slate-500">{REFERENCE_DATE_DEFAULT_LABEL}</p>
                <button
                  type="button"
                  onClick={handleResetDraft}
                  className="inline-flex items-center gap-1 rounded-md border border-[#d5def0] px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-[#bfd1ed] hover:text-slate-800"
                >
                  <RotateCcw className="h-3 w-3" />
                  초기화
                </button>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border/70 px-4 py-3">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-md border border-[#d5def0] px-3 py-1.5 text-[12px] font-medium text-slate-600 transition-colors hover:border-[#bfd1ed] hover:text-slate-800"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!draft || draft === referenceDateTime}
                className="rounded-md bg-orange-500 px-3 py-1.5 text-[12px] font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                확인
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
