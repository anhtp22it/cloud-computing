import React from "react";

const StatItem = ({ statNumber, statLabel }) => {
  return (
    <div class="rounded-xl bg-[rgba(255,255,255,0.2)] p-[15px] backdrop-blur-[10px]">
      <span class="block text-2xl font-bold">{statNumber}</span>
      <span class="text-sm opacity-90">{statLabel}</span>
    </div>
  );
};

export default StatItem;
