import { STORE_AVATAR_BACKGROUND_COLORS } from "@/commons/constants/header";

type StoreSeed = {
  store_id: string;
  store_name: string;
};

export function getStoreAvatarBackgroundColor(store?: StoreSeed | null) {
  if (!store) return STORE_AVATAR_BACKGROUND_COLORS[0];

  const seed = `${store.store_id}:${store.store_name}`;
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return STORE_AVATAR_BACKGROUND_COLORS[hash % STORE_AVATAR_BACKGROUND_COLORS.length];
}
