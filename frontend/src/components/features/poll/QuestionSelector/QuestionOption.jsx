import React from "react";

const QuestionOption = ({ questionTitle, questionMeta, onClickQuestion }) => {
  return (
    <div
      className="flex cursor-pointer items-center border-b border-[#f0f0f0] px-[30px] py-[20px] transition-all duration-200 ease-in-out last:border-b-0 hover:translate-x-[5px] hover:bg-[#f8f9fa]"
      onClick={onClickQuestion}
    >
      <div className="flex-1">
        <div className="mb-[5px] text-[1.1rem] font-medium text-[#333]">
          {questionTitle}
        </div>
        <div className="text-[0.85rem] text-[#666]">{questionMeta}</div>
      </div>
      <div className="text-[0.85rem] text-[#666]">→</div>
    </div>
  );
};

export default QuestionOption;
