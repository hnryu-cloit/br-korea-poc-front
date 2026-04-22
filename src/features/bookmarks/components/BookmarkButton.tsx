import { Heart } from "lucide-react";

import {
  useDeleteBookmarkMutation,
  useGetBookmarksQuery,
  usePostBookmarkMutation,
} from "@/features/bookmarks/queries/useBookmarks";
import type { BookmarkType } from "@/features/bookmarks/types/bookmarks";

export function BookmarkButton({
  type,
  refId,
  label,
  storeId,
}: {
  type: BookmarkType;
  refId: string;
  label: string;
  storeId?: string;
}) {
  const { data } = useGetBookmarksQuery(storeId, type);
  const addMutation = usePostBookmarkMutation();
  const removeMutation = useDeleteBookmarkMutation();

  const isBookmarked = data?.items.some((b) => b.ref_id === refId) ?? false;

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBookmarked) {
      removeMutation.mutate({ store_id: storeId, type, ref_id: refId });
    } else {
      addMutation.mutate({ type, ref_id: refId, label, store_id: storeId });
    }
  };

  const isPending = addMutation.isPending || removeMutation.isPending;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors disabled:opacity-40 ${
        isBookmarked
          ? "bg-rose-50 text-rose-500 hover:bg-rose-100"
          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
      }`}
    >
      <Heart className={`h-3.5 w-3.5 ${isBookmarked ? "fill-rose-500" : ""}`} />
    </button>
  );
}
