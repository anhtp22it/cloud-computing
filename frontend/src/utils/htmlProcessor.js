export const isValidImageUrl = (url) => {
  if (!url) return false;

  // Check if it's base64
  if (url.startsWith('data:image/')) return true;

  // Check if it's a valid HTTP(S) URL
  try {
    new URL(url);
    return true;
  } catch {
    // Check if it's a valid relative path
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
  }
};

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

  const escapedOldSrc = oldSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`src="${escapedOldSrc}"`, 'g');

  return htmlContent.replace(regex, `src="${newSrc}"`);
};
