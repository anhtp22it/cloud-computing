import { getDisplayStatus } from "@utils/eventHelpers";
import React from "react";

const statusStyles = {
  UPCOMING: {
    text: "Sắp diễn ra",
    classes:
      "bg-yellow-50 text-yellow-700 border border-yellow-300/60 shadow-sm",
  },
  ONGOING: {
    text: "Đang diễn ra",
    classes:
      "bg-green-50 text-green-700 border border-green-300/60 shadow-sm",
  },
  COMPLETED: {
    text: "Đã kết thúc",
    classes: "bg-gray-50 text-gray-700 border border-gray-300/60 shadow-sm",
  },
  CANCELLED: {
    text: "Đã bị hủy",
    classes: "bg-red-50 text-red-700 border border-red-300/60 shadow-sm",
  },
  UNKNOWN: {
    text: "Không xác định",
    classes: "bg-gray-50 text-gray-500 border border-gray-300/60 shadow-sm",
  },
};

const EventStatusBadge = ({ event }) => {
  const displayStatus = getDisplayStatus(event);

  const style = statusStyles[displayStatus] || statusStyles.UNKNOWN;

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style.classes}`}
    >
      {style.text}
    </span>
  );
};

export default EventStatusBadge;
