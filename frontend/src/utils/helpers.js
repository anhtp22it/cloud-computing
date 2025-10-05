import dayjs from 'dayjs';

export const formatTimestampToDate = (timestamp) => {
  if (!timestamp) return '';

  const date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp);

  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatTimestampToTime = (timestamp) => {
  if (!timestamp) return '';

  const date = new Date(timestamp.toString().length === 10 ? timestamp * 1000 : timestamp);

  if (isNaN(date.getTime())) return '';

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

export const getTimeUntilEvent = (eventStartTime) => {
  const now = new Date();
  const eventDate = new Date(eventStartTime);
  const diffTime = eventDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `Còn ${diffDays} ngày`;
  } else if (diffDays === 0) {
    return 'Hôm nay';
  } else {
    return 'Đã qua';
  }
};

export const getStatusText = (status) => {
  const statusMap = {
    UPCOMING: 'Sắp diễn ra',
    ONGOING: 'Đang diễn ra',
    COMPLETED: 'Đã kết thúc',
    CANCELLED: 'Đã hủy',
  };
  return statusMap[status] || 'Không xác định';
};

export const getStatusColor = (status) => {
  const colorMap = {
    UPCOMING: 'bg-blue-100 text-blue-800',
    ONGOING: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

export const formatDateTime = (joinedAt) => {
  if (!joinedAt) return '';

  const date = dayjs(joinedAt * 1000);

  if (!date.isValid()) {
    const fallback = dayjs(joinedAt);
    if (fallback.isValid()) {
      return fallback.format('DD/MM HH:mm');
    }
    return '';
  }

  return date.format('DD/MM HH:mm');
};

export const getPollState = (startTime, endTime) => {
  const now = new Date();
  const start = new Date(startTime * 1000);
  const end = new Date(endTime * 1000);

  if (now < start) {
    return 'UPCOMING';
  }
  if (now >= start && now <= end) {
    return 'ACTIVE';
  }
  return 'ENDED';
};

export const stripImagesDescription = (html) => {
  if (!html) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  doc.querySelectorAll('img').forEach((img) => img.remove());
  return doc.body.innerHTML;
};
