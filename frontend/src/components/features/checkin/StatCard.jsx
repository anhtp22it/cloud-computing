import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    yellow: "text-yellow-600 bg-yellow-100",
    purple: "text-purple-600 bg-purple-100",
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${colors[color]}`}
        >
          <FontAwesomeIcon icon={icon} className="text-xl" />
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-800">{value}</div>
          <div className="text-sm font-medium text-gray-500">{label}</div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
