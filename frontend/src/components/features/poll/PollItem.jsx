import React from "react";
import OptionResult from "./OptionResult";
import OptionBar from "./OptionBar";

const PollItem = ({
  pollQuestion,
  pollType,
  pollResponsesNum,
  pollOptions = [],
}) => {
  const COLORS = ['primary', 'secondary', 'accent'];
  return (
    <div className="mb-6 rounded-xl border-l-4 border-[#1e88e5] bg-gray-100 p-5">
      <div className="mb-[15px] text-start text-[1.1rem] font-semibold text-[#333]">
        {pollQuestion}
      </div>
      <div className="mb-4 text-start text-[0.85rem] text-[#666]">
        {pollType} • {pollResponsesNum} phản hồi
      </div>
      {pollOptions.map((option) => (
        <>
          <OptionResult
            key={option.id}
            optionInfo={option.content}
            percentage={option.percentage}
            votes={option.vote_count}
          />
          <OptionBar
            optionPercentage={option.percentage}
            barColor={COLORS[option.id % COLORS.length]}
          />
        </>
      ))}
    </div>
  );
};

export default PollItem;
