import type { SettingsModalKey } from "@/features/admin/orchestration/types/orchestration";

type Props = {
  onOpenModal: (key: SettingsModalKey) => void;
};

export function ConnectorsPanelV3({ onOpenModal }: Props) {
  return (
    <section>
      <div className="pgh">
        <div className="pgh-l">
          <h1>데이터 커넥터</h1>
          <p>원천 데이터 연동 상태 · 스키마 정합성 · 동기화 스케줄</p>
        </div>
        <div className="pgh-r">
          <button
            type="button"
            className="btn btn-g btn-sm"
            onClick={() => onOpenModal("sync-log")}
          >
            동기화 이력
          </button>
          <button type="button" className="btn btn-p btn-sm">
            + 커넥터 추가
          </button>
        </div>
      </div>

      <div className="g4 mb-[12px]">
        <div className="metric">
          <div className="ml">전체 커넥터</div>
          <div className="mv">
            3<span>개</span>
          </div>
          <div className="ms">
            <span className="b bgy">정형 2 · 비정형 1</span>
          </div>
        </div>
        <div className="metric">
          <div className="ml">정상 (Healthy)</div>
          <div className="mv">
            2<span>개</span>
          </div>
          <div className="ms">
            <span className="b bg">동기화 완료</span>
          </div>
        </div>
        <div className="metric">
          <div className="ml">경고 (Warning)</div>
          <div className="mv">
            1<span>개</span>
          </div>
          <div className="ms">
            <span className="b ba">지연 1건</span>
          </div>
        </div>
        <div className="metric">
          <div className="ml">마지막 동기화</div>
          <div className="mv text-[15px]">
            09:10<span> KST</span>
          </div>
          <div className="ms mt-[2px] text-[11px] text-[var(--t3)]">2026-04-20</div>
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        <div className="card mb-0 p-[14px]">
          <div className="flex items-start gap-3">
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] bg-[var(--teal-lt)]">
              <span className="material-symbols-outlined text-[17px] text-[var(--teal)]">
                database
              </span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-[7px]">
                <span className="font-bold text-[var(--text)]">매출 원천 커넥터</span>
                <span className="b bg">Healthy</span>
                <span className="b bgy">정형 DB</span>
                <span className="ml-auto text-[11px] text-[var(--t3)]">09:10 KST</span>
              </div>
              <div className="mono mt-[3px]">raw_daily_store_item · raw_daily_store_online</div>
              <div className="mt-2 grid grid-cols-4 gap-[7px]">
                <div className="metric">
                  <div className="ml">스키마</div>
                  <div className="text-[13px] font-bold">24개</div>
                </div>
                <div className="metric">
                  <div className="ml">일 레코드</div>
                  <div className="text-[13px] font-bold">48.2만</div>
                </div>
                <div className="metric">
                  <div className="ml">정합성</div>
                  <div className="text-[13px] font-bold text-[var(--teal)]">100%</div>
                </div>
                <div className="metric">
                  <div className="ml">7일성공률</div>
                  <div className="text-[13px] font-bold text-[var(--teal)]">100%</div>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-[5px]">
              <button type="button" className="btn btn-g btn-sm">
                설정
              </button>
              <button type="button" className="btn btn-g btn-sm">
                동기화
              </button>
            </div>
          </div>
        </div>

        <div className="card mb-0 p-[14px]">
          <div className="flex items-start gap-3">
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] bg-[var(--blue-lt)]">
              <span className="material-symbols-outlined text-[17px] text-[var(--blue)]">
                widgets
              </span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-[7px]">
                <span className="font-bold text-[var(--text)]">주문·생산 커넥터</span>
                <span className="b bg">Healthy</span>
                <span className="b bgy">정형 DB</span>
                <span className="ml-auto text-[11px] text-[var(--t3)]">09:08 KST</span>
              </div>
              <div className="mono mt-[3px]">
                raw_order_extract · raw_production_extract · raw_sku_master
              </div>
              <div className="mt-2 grid grid-cols-4 gap-[7px]">
                <div className="metric">
                  <div className="ml">스키마</div>
                  <div className="text-[13px] font-bold">18개</div>
                </div>
                <div className="metric">
                  <div className="ml">일 레코드</div>
                  <div className="text-[13px] font-bold">12.7만</div>
                </div>
                <div className="metric">
                  <div className="ml">정합성</div>
                  <div className="text-[13px] font-bold text-[var(--teal)]">99.8%</div>
                </div>
                <div className="metric">
                  <div className="ml">7일성공률</div>
                  <div className="text-[13px] font-bold text-[var(--teal)]">99%</div>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-[5px]">
              <button type="button" className="btn btn-g btn-sm">
                설정
              </button>
              <button type="button" className="btn btn-g btn-sm">
                동기화
              </button>
            </div>
          </div>
        </div>

        <div className="card mb-0 border-[var(--amber)] bg-[#FFFDF5] p-[14px]">
          <div className="flex items-start gap-3">
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] bg-[var(--amber-lt)]">
              <span className="material-symbols-outlined text-[17px] text-[var(--amber)]">
                warning
              </span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-[7px]">
                <span className="font-bold text-[var(--text)]">상권·유동인구 커넥터</span>
                <span className="b ba">Warning</span>
                <span className="b bgy">외부 API</span>
                <span className="ml-auto text-[11px] text-[var(--t3)]">2026-04-19 23:30</span>
              </div>
              <div className="mono mt-[3px]">
                seoul_floating_population_monthly · internal_market_index
              </div>
              <div className="mt-[7px] rounded-[7px] border border-[#FFE08A] bg-[var(--amber-lt)] px-[10px] py-[7px] text-[11.5px] text-[#7A5500]">
                ⚠ 서울시 공공 데이터 포털 점검 중 — 이전 월 데이터로 임시 대체 적용
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-[5px]">
              <button type="button" className="btn btn-p btn-sm">
                재연결
              </button>
              <button type="button" className="btn btn-g btn-sm">
                설정
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
