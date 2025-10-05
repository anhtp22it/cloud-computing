import React from "react";

const OptionResult = ({optionInfo, optionPercentage, optionVotes}) => {
  return (
    <div className="mb-[10px] flex items-center justify-between">
      <div className="flex items-center gap-[10px]">
        <span>{optionInfo}</span>
      </div>
      <div>
        <span className="font-semibold text-[#333]">{optionPercentage}</span>
        <span className="text-[0.9rem] text-[#666]"> {optionVotes}</span>
      </div>
    </div>
  );
};

export default OptionResult;
