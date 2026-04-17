# Dashboard API (최신 반영 스키마)

## 1) 페이지 호출 API

- Endpoint: `GET /api/home/overview`
- Front 호출: `src/features/dashboard/api/dashboard.ts`
- Query params:
  - `store_id`
  - `business_date` (`YYYY-MM-DD`)

---

## 2) 현재 응답 스키마 (반영 완료)

```json
{
  "updated_at": "2026-04-17T04:41:00",
  "priority_actions": [
    {
      "id": "production-811047",
      "type": "production",
      "urgency": "urgent",
      "badge_label": "긴급 · 재고 소진 04:51",
      "title": "페이머스글레이즈드 생산 필요",
      "description": "현재 51개, 1시간 후 2435개 예상 · 권장 생산 2871개",
      "cta": {
        "label": "생산하기",
        "path": "/production"
      },
      "focus_section": "811047",
      "related_sku_id": "811047",
      "ai_reasoning": "...",
      "confidence_score": 0.93,
      "is_finished_good": false,
      "basis_data": {
        "selection_rule": "first_danger_item",
        "sku_id": "811047",
        "name": "페이머스글레이즈드",
        "current": 51,
        "forecast": 2435,
        "recommended": 2871,
        "depletion_time": "04:51"
      }
    }
  ],
  "stats": [
    {
      "key": "production_risk_count",
      "label": "품절 위험 상품",
      "value": 4,
      "unit": "count",
      "tone": "danger"
    },
    {
      "key": "ordering_deadline_minutes",
      "label": "주문 마감까지",
      "value": 18,
      "unit": "minutes",
      "tone": "primary"
    },
    {
      "key": "today_profit_estimate",
      "label": "오늘 운영 상태",
      "value": "risk",
      "tone": "default"
    },
    {
      "key": "alert_count",
      "label": "알림 상태",
      "value": 5,
      "unit": "count",
      "tone": "default"
    }
  ],
  "cards": [
    {
      "domain": "production",
      "title": "생산 현황",
      "description": "실시간 재고 및 1시간 후 예측",
      "highlights_text": [
        "페이머스글레이즈드 · 현재 51개 / 1시간 후 2435개 예상"
      ],
      "highlights_data": [
        {
          "type": "production_item",
          "sku_id": "811047",
          "name": "페이머스글레이즈드",
          "status": "danger",
          "current": 51,
          "forecast": 2435,
          "recommended": 2871,
          "depletion_time": "04:51"
        }
      ],
      "metrics": [
        {
          "key": "danger_count",
          "label": "품절 위험",
          "value": 4,
          "unit": "count",
          "tone": "danger"
        },
        {
          "key": "production_lead_time_minutes",
          "label": "생산 리드타임",
          "value": 60,
          "unit": "minutes",
          "tone": "primary"
        }
      ],
      "cta": {
        "label": "생산관리 상세보기",
        "path": "/production"
      },
      "prompts": ["지금 생산해야 할 품목은?"],
      "status_label": "즉시 확인"
    }
  ]
}
```

---

## 3) 필드 설명

### top-level
- `updated_at`: 서버 시각 ISO 문자열 (`datetime.now().replace(microsecond=0).isoformat()`)
- `priority_actions`: 우선 액션 카드
- `stats`: 상단 KPI
- `cards`: 도메인 요약 카드

### priority_actions
- `cta` 객체로 전달 (`label`, `path`)
- `basis_data`는 액션 생성 근거 데이터
- 대표 production 액션은 `production.items` 순회 시 `status == "danger"` 조건에 **처음으로 매칭되는 1건**을 선택
  - 코드: `danger_item = next((item for item in production.items if item.status == "danger"), ...)`
  - selection rule: `first_danger_item`
  - 따라서 `stats.production_risk_count`가 4개여도 `priority_actions`의 긴급 production 액션은 1개만 내려감
  - 나머지 위험 SKU는 `cards[].highlights_data`와 `cards[].metrics`에서 집계/요약으로 노출
- 액션 수는 최대 3개로 고정 (`return actions[:3]`)
  - 현재 구성: `production(urgent) + ordering(important) + production(recommended)`

### stats
- `value`는 숫자/문자열
- `unit`은 숫자값일 때 사용 (`count`, `minutes`)
- `today_profit_estimate.value`는 현재 `risk | stable`
- `alert_count` 계산식:
  - `production.danger_count + (ordering_summary.summary_status != "recommended_selected" 이면 1, 아니면 0)`

### cards
- `highlights_text`: 화면 표시용 문자열
- `highlights_data`: 화면 가공/재사용용 구조화 데이터
- `metrics`: `key/label/value/unit/tone` 구조
- `cta` 객체로 전달

---

## 4) Enum / 값 범위

- `priority_actions.type`: `production | ordering | sales`
- `priority_actions.urgency`: `urgent | important | recommended`
- `stats.key`: `production_risk_count | ordering_deadline_minutes | today_profit_estimate | alert_count`
- `stats.unit` / `metrics.unit`: `count | minutes`
- `tone`: `danger | primary | success | default`

### status_label 생성 기준 (cards)
- `cards[domain=production].status_label`: 현재 고정 `"즉시 확인"`
- `cards[domain=ordering].status_label`: `recommended_selected`가 `false`면 `"검토 필요"`, `true`면 `"선택 완료"`
- `cards[domain=sales].status_label`: `_build_sales_status` 결과
  - `production_danger_count > 0` => `"주의"`
  - 그 외 `ordering_summary.total > 0` => `"안정"`
  - 그 외 => `"데이터 확인"`

---

## 5) 반영된 개선 사항

1. `updated_at` 문자열 포맷을 ISO로 변경
2. `priority_actions` / `cards`의 CTA를 객체(`label`, `path`)로 변경
3. `stats.value` 숫자화 (`count`, `minutes`) 및 `unit` 분리
4. `cards.highlights`를 `highlights_text` + `highlights_data`로 분리
5. `cards.metrics`에 `key`와 `unit` 추가
6. `priority_actions`에 `basis_data` 추가(선정 근거 추적)
7. 홈 overview에서 production 조회 시 `store_id` 전달
8. priority_actions 대표 production 1건 선정 근거를 `basis_data.selection_rule`로 명시

---

## 6) 테스트/검증 상태

- Front build: 성공 (`npm run build`)
- Backend syntax check: 성공 (`python3 -m py_compile app/schemas/home.py app/services/home_service.py`)
- Backend test: `tests/test_health.py::test_home_overview` 통과
- `tests/test_system_integration.py::test_home_overview_matches_frontend_contract`는 현재 환경에서 `pandas` 미설치로 실행 불가
