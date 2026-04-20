import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteBookmark, getBookmarks, postBookmark } from "@/features/bookmarks/api/bookmarks";
import { bookmarkQueryKeys } from "@/features/bookmarks/queries/bookmarkQueryKeys";
import type { AddBookmarkRequest, BookmarkType } from "@/features/bookmarks/types/bookmarks";

export function useGetBookmarksQuery(storeId?: string, type?: BookmarkType) {
  return useQuery({
    queryKey: bookmarkQueryKeys.list(storeId, type),
    queryFn: () => getBookmarks(storeId, type),
  });
}

export function useAddBookmarkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddBookmarkRequest) => postBookmark(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkQueryKeys.all });
    },
  });
}

export function useRemoveBookmarkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { store_id?: string; type: BookmarkType; ref_id: string }) =>
      deleteBookmark(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkQueryKeys.all });
    },
  });
}
