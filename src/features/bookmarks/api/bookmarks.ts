import axiosInstance from "@/services/axiosInstance";

import type { AddBookmarkRequest, BookmarkItem, BookmarkListResponse, BookmarkType } from "@/features/bookmarks/types/bookmarks";

export async function getBookmarks(storeId?: string, type?: BookmarkType) {
  const response = await axiosInstance.get<BookmarkListResponse>("/api/bookmarks", {
    params: { store_id: storeId, type },
  });
  return response.data;
}

export async function postBookmark(body: AddBookmarkRequest) {
  const response = await axiosInstance.post<BookmarkItem>("/api/bookmarks", body);
  return response.data;
}

export async function deleteBookmark(params: { store_id?: string; type: BookmarkType; ref_id: string }) {
  await axiosInstance.delete("/api/bookmarks", { params });
}