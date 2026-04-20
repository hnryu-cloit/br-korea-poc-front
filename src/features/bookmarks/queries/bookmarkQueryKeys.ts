import type { BookmarkType } from "@/features/bookmarks/types/bookmarks";

const ROOT = ["bookmarks"] as const;

export const bookmarkQueryKeys = {
  all: ROOT,
  list: (storeId?: string, type?: BookmarkType) =>
    [...ROOT, "list", storeId ?? "", type ?? "all"] as const,
};
