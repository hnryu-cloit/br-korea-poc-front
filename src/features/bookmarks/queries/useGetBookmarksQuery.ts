import { useQuery } from "@tanstack/react-query";

import { getBookmarks } from "@/features/bookmarks/api/bookmarks";
import { bookmarkQueryKeys } from "@/features/bookmarks/queries/bookmarkQueryKeys";
import type { BookmarkType } from "@/features/bookmarks/types/bookmarks";

export function useGetBookmarksQuery(storeId?: string, type?: BookmarkType) {
  return useQuery({
    queryKey: bookmarkQueryKeys.list(storeId, type),
    queryFn: () => getBookmarks(storeId, type),
    staleTime: 5 * 60 * 1000,
  });
}
