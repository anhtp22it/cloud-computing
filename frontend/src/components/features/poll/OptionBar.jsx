import React from "react";

const OptionBar = ({ optionPercentage, barColor }) => {
  return (
    <div className="mb-[10px] h-2 overflow-hidden rounded bg-gray-200">
      <div
        className={`h-full bg-${barColor} transition-all duration-800 ease-in-out`}
        style={{ width: `${optionPercentage}%` }}
      ></div>
    </div>
  );
};

export default OptionBar;
