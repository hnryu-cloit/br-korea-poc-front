import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteBookmark } from "@/features/bookmarks/api/bookmarks";
import { bookmarkQueryKeys } from "@/features/bookmarks/queries/bookmarkQueryKeys";
import type { BookmarkType } from "@/features/bookmarks/types/bookmarks";

export function useDeleteBookmarkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: { store_id?: string; type: BookmarkType; ref_id: string }) =>
      deleteBookmark(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkQueryKeys.all });
    },
  });
}
