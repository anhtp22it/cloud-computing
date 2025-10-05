import React from "react";

const StatusBadge = ({ enabled }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${enabled ? "bg-green-500" : "bg-gray-400"}`}
      ></span>
      {enabled ? "Hoạt động" : "Đã khóa"}
    </span>
  );
};

export default StatusBadge;
