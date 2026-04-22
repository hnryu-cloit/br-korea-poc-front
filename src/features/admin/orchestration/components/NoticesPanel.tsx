import { MOCK_NOTICES } from "@/features/admin/orchestration/mockdata/mock-orchestration";
import type { NoticeItem, SettingsModalKey } from "@/features/admin/orchestration/types/orchestration";

type Props = {
  onOpenModal: (key: SettingsModalKey) => void;
  onSelectNotice: (notice: NoticeItem) => void;
};

export function NoticesPanel({ onOpenModal, onSelectNotice }: Props) {
  return (
    <section>
      <div className="pgh">
        <div className="pgh-l"><h1>공지사항</h1></div>
        <div className="pgh-r">
          <button type="button" className="btn btn-p btn-sm" onClick={() => onOpenModal("notice-detail")}>
            + 작성
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 0 }}>
        {MOCK_NOTICES.map((notice, index) => (
          <button
            key={`${notice.title}-${notice.date}`}
            type="button"
            style={{
              width: "100%",
              textAlign: "left",
              padding: "10px 14px",
              border: 0,
              background: "transparent",
              borderBottom: index === MOCK_NOTICES.length - 1 ? "none" : "1px solid var(--border2)",
            }}
            onClick={() => {
              onSelectNotice(notice);
              onOpenModal("notice-detail");
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className={index === 0 ? "b br" : index === 1 ? "b ba" : "b bb"}>
                {index === 0 ? "긴급" : index === 1 ? "업데이트" : "안내"}
              </span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>{notice.title}</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--t3)", marginTop: 3, display: "flex", gap: 8 }}>
              <span>{notice.date}</span>
              <span>hq_admin</span>
              <span style={{ color: "var(--orange)" }}>{index < 2 ? "미확인" : "확인"}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
