# Dashboard API (현재 프론트 계약)

## 1) 페이지 호출 API

- `GET /api/dashboard/notices`
- `GET /api/home/schedule`
- `GET /api/dashboard/alerts`
- `GET /api/dashboard/summary-cards`

모든 호출은 공통 query param을 사용합니다.

- `store_id`
- `business_date` (`YYYY-MM-DD`)

---

## 2) 응답 스키마 요약

### `GET /api/dashboard/notices`

```json
{
  "items": [
    {
      "id": "notice-1",
      "name": "공지 제목",
      "tag": "공지",
      "path": "/notices/sample"
    }
  ]
}
```

- `tone` 없음
- 공지 강조 스타일은 프론트가 `tag` 기준으로 계산

### `GET /api/home/schedule`

```json
{
  "selected_date": "20260423",
  "calendar_events": [],
  "daily_events": [],
  "todos": []
}
```

### `GET /api/dashboard/alerts`

```json
{
  "low_stock_products": [
    {
      "id": "sku-1",
      "name": "상품명",
      "remaining_stock": 3,
      "cta_path": "/production"
    }
  ],
  "order_deadline": {
    "deadline_at": "2026-04-23T17:00:00+09:00",
    "cta_path": "/ordering"
  }
}
```

- 현재 시각/남은 시간은 프론트가 계산

### `GET /api/dashboard/summary-cards`

```json
{
  "updated_at": "2026-04-23T10:30:00+09:00",
  "cards": [
    {
      "domain": "ordering",
      "title": "주문 관리",
      "cta_path": "/ordering",
      "recommended_questions": ["..."],
      "ai_order_basis": "지난주 같은 요일",
      "ai_order_cta_path": "/ordering",
      "deadline_products": [
        {
          "name": "도넛용 나무 포크",
          "deadline_time": "17:00"
        }
      ]
    }
  ]
}
```

- `updated_at` 포함
- `deadline_products.remaining_text` 없음
- 주문 제안 문구는 프론트가 `ai_order_basis` 기반으로 생성
- 상품별 마감 시각은 현재 발표용 예시 데이터로 취급

---

## 3) 프론트 표시 원칙

- 운영 현황 `업데이트 시간`: `summary-cards.updated_at` 사용
- 발주 마감 `현재 시간`, `남은 시간`: 프론트 계산
- 생산 현황 TOP 5 시간 라벨: `summary-cards.updated_at` 사용
- 주문 관리 AI 발주 제안: `ai_order_basis + "에 주문했던대로 추천해요."`
