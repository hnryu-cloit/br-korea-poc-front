import ProductDefaultImage from "@/assets/default_product_img.svg";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:6002").replace(
  /\/$/,
  "",
);

export const getPublickProductImage = (imageUrl?: string | null) => {
  if (!imageUrl) {
    return ProductDefaultImage;
  }
  const normalized = imageUrl.startsWith("/static/menu-images/")
    ? imageUrl.replace("/static/menu-images/", "/images/")
    : imageUrl;
  if (normalized.startsWith("/images/")) {
    return normalized;
  }
  if (normalized.startsWith("images/")) {
    return `/${normalized}`;
  }
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  return `${API_BASE_URL}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
};
