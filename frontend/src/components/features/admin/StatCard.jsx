import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const StatCard = ({ icon, label, value, color }) => {
  return (
    <div
      className={`rounded-xl border-l-4 ${color.border} bg-white p-6 shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-semibold ${color.text}`}>{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <FontAwesomeIcon icon={icon} className={`text-2xl ${color.text}`} />
      </div>
    </div>
  );
};

export default StatCard;
