export type BookmarkType = "sku" | "order_option" | "insight";

export interface BookmarkItem {
  id: number;
  store_id: string | null;
  type: BookmarkType;
  ref_id: string;
  label: string;
  created_at: string;
}

export interface BookmarkListResponse {
  items: BookmarkItem[];
}

export interface AddBookmarkRequest {
  type: BookmarkType;
  ref_id: string;
  label: string;
  store_id?: string;
}