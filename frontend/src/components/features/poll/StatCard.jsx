import React from "react";

const StatCard = ({ statNumber, statLabel, numberColor }) => {
  return (
    <div class="rounded-xl bg-white p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <span className={`mb-[5px] text-[2.5rem] font-bold block text-${numberColor}`}>{statNumber}</span>
      <span className="text-sm opacity-90">{statLabel}</span>
    </div>
  );
};

export default StatCard;
