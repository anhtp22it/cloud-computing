// @utils/htmlProcessor.js

/**
 * Thêm base URL vào các image paths để hiển thị
 * Chuyển từ "/uploads/images/img.png" hoặc "/images/img.png" thành "VITE_API_BASE_URL/uploads/images/img.png"
 */
export const prependApiUrlToImages = (htmlContent) => {
  if (!htmlContent) return "";

  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";

  return htmlContent.replace(
    /<img([^>]+)src="([^"]+)"([^>]*>)/g,
    (match, beforeSrc, src, afterSrc) => {
      // Bỏ qua nếu đã là absolute URL hoặc base64
      if (src.startsWith("http") || src.startsWith("data:")) {
        return match;
      }

      // Xử lý relative path
      let normalizedSrc = src;

      // Đảm bảo src bắt đầu với "/"
      if (!normalizedSrc.startsWith("/")) {
        normalizedSrc = "/" + normalizedSrc;
      }

      // Nếu chỉ có /images/, thêm /uploads prefix
      if (normalizedSrc.startsWith("/images/")) {
        normalizedSrc = "/uploads" + normalizedSrc;
      }
      // Nếu đã có /uploads/, giữ nguyên
      else if (!normalizedSrc.startsWith("/uploads/")) {
        normalizedSrc = "/uploads" + normalizedSrc;
      }

      const fullUrl = `${baseUrl}${normalizedSrc}`;
      return `<img${beforeSrc}src="${fullUrl}"${afterSrc}`;
    },
  );
};

/**
 * Loại bỏ base URL khỏi image paths để lưu vào database
 * Chuyển từ "VITE_API_BASE_URL/uploads/images/img.png" thành "/images/img.png"
 */
export const stripApiUrlFromImages = (htmlContent) => {
  if (!htmlContent) return "";

  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";

  return htmlContent.replace(
    /<img([^>]+)src="([^"]+)"([^>]*>)/g,
    (match, beforeSrc, src, afterSrc) => {
      // Bỏ qua base64 images
      if (src.startsWith("data:")) {
        return match;
      }

      // Nếu src chứa baseUrl, loại bỏ nó
      if (baseUrl && src.startsWith(baseUrl)) {
        let relativePath = src.substring(baseUrl.length);

        // Loại bỏ "/uploads" prefix nếu có
        if (relativePath.startsWith("/uploads/")) {
          relativePath = relativePath.substring(8); // Remove "/uploads"
        }

        // Đảm bảo path bắt đầu với "/"
        if (!relativePath.startsWith("/")) {
          relativePath = "/" + relativePath;
        }

        return `<img${beforeSrc}src="${relativePath}"${afterSrc}`;
      }

      return match;
    },
  );
};

/**
 * Helper function để validate image URL format
 */
export const isValidImageUrl = (url) => {
  if (!url) return false;

  // Check if it's base64
  if (url.startsWith("data:image/")) return true;

  // Check if it's a valid HTTP(S) URL
  try {
    new URL(url);
    return true;
  } catch {
    // Check if it's a valid relative path
    return url.startsWith("/") || url.startsWith("./") || url.startsWith("../");
  }
};

/**
 * Extract all image sources from HTML content
 */
export const extractImageSources = (htmlContent) => {
  if (!htmlContent) return [];

  const imageSources = [];
  const regex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  let match;

  while ((match = regex.exec(htmlContent)) !== null) {
    imageSources.push(match[1]);
  }

  return imageSources;
};

/**
 * Replace specific image source in HTML content
 */
export const replaceImageSource = (htmlContent, oldSrc, newSrc) => {
  if (!htmlContent || !oldSrc || !newSrc) return htmlContent;

  const escapedOldSrc = oldSrc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`src="${escapedOldSrc}"`, "g");

  return htmlContent.replace(regex, `src="${newSrc}"`);
};
