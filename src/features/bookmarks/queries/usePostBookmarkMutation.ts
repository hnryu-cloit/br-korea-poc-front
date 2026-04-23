import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postBookmark } from "@/features/bookmarks/api/bookmarks";
import { bookmarkQueryKeys } from "@/features/bookmarks/queries/bookmarkQueryKeys";
import type { AddBookmarkRequest } from "@/features/bookmarks/types/bookmarks";

export function usePostBookmarkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddBookmarkRequest) => postBookmark(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkQueryKeys.all });
    },
  });
}
