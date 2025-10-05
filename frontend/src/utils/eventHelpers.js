// Helper function để parse description từ JSON format thành HTML
export function parseDescriptionFromJSON(jsonString) {
  if (!jsonString) return '';

  try {
    // Nếu không phải JSON, trả về text thuần
    if (!jsonString.startsWith('{')) return jsonString;

    const parsed = JSON.parse(jsonString);

    if (!parsed.text || !Array.isArray(parsed.images)) {
      return jsonString; // Fallback to original
    }

    let htmlContent = parsed.text;

    // Thay thế các placeholder bằng ảnh base64
    parsed.images.forEach((base64Image, index) => {
      const placeholder = `{{IMAGE_${index}}}`;
      htmlContent = htmlContent.replace(placeholder, base64Image);
    });

    return htmlContent;
  } catch (error) {
    console.error('Error parsing description JSON:', error);
    return jsonString; // Fallback to original
  }
}

// Helper function để render HTML description an toàn
export function renderDescriptionHTML(description, maxLength) {
  if (!description) return '';

  const parsedDescription = parseDescriptionFromJSON(description);

  if (maxLength && parsedDescription.length > maxLength) {
    return parsedDescription.substring(0, maxLength) + '...';
  }

  return parsedDescription;
}

export function getStatusText(status) {
  const statusMap = {
    upcoming: 'Sắp diễn ra',
    ongoing: 'Đang diễn ra',
    completed: 'Đã kết thúc',
    cancelled: 'Đã hủy',
  };
  return statusMap[status] || status;
}

export function mapBackendStatusToFrontend(backendStatus) {
  const statusMap = {
    UPCOMING: 'Sắp diễn ra',
    ONGOING: 'Đang diễn ra',
    COMPLETED: 'Đã kết thúc',
    CANCELLED: 'Đã hủy',
  };
  return statusMap[backendStatus] || 'Sắp diễn ra';
}

export function mapFrontendStatusToBackend(frontendStatus) {
  const statusMap = {
    upcoming: 'UPCOMING',
    ongoing: 'ONGOING',
    completed: 'COMPLETED',
    cancelled: 'CANCELLED',
  };
  return statusMap[frontendStatus] || 'UPCOMING';
}

export function truncateDescription(description, maxLength = 400) {
  if (!description) return '';

  // Parse description if it's in JSON format
  const parsedDescription = parseDescriptionFromJSON(description);

  // Remove HTML tags for plain text truncation
  const plainText = parsedDescription.replace(/<[^>]*>/g, '');

  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
}

export function truncateTitle(title, maxLength = 50) {
  if (!title) return '';
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + '...';
}

export function formatTimeRemaining(hours) {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} phút`;
  } else if (hours < 24) {
    const roundedHours = Math.round(hours);
    return `${roundedHours} giờ`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return `${days} ngày ${remainingHours} giờ`;
  }
}

export const getDisplayStatus = (event) => {
  if (!event) return 'UNKNOWN';

  if (event.status === 'CANCELLED') return 'CANCELLED';
  if (event.status === 'COMPLETED') return 'COMPLETED';

  if (!event.startTime || !event.endTime) {
    return event.status || 'UNKNOWN';
  }

  const now = new Date();
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);

  if (now < startTime) {
    return 'UPCOMING';
  }

  if (now >= startTime && now <= endTime) {
    return 'ONGOING';
  }

  if (now > endTime) {
    return 'COMPLETED';
  }

  return event.status;
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  const cleanText = text.replace(/<[^>]*>/g, '');
  return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
};

export const base64ToFile = (base64String, filename = 'image.png') => {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
