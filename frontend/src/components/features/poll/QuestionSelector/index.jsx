import React from "react";
import QuestionOption from "./QuestionOption";

const QuestionSelectorPopUp = ({ closePopup, pollsData, setSelectedPoll }) => {
  return (
    <div className="animate-fadeIn fixed inset-0 z-[1000] flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-5 my-5 max-h-[80vh] w-[95%] max-w-[600px] animate-[slideInUp_0.3s_ease-out] overflow-hidden rounded-2xl bg-white md:mx-0 md:w-[90%]">
        <div className="flex items-center justify-between border-b border-[#eee] bg-[#f8f9fa] p-5 md:px-[30px] md:py-[25px]">
          <h3 className="m-0 text-[1.4rem] font-bold text-[#333]">
            Chọn câu hỏi thống kê
          </h3>
          <button
            onClick={() => {
              closePopup(false);
            }}
            className="hover:text-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-none text-[2rem] text-[#666] transition-all duration-200 ease-in-out hover:bg-[#e9ecef]"
          >
            &times;
          </button>
        </div>
        <div className="max-h-[400px] overflow-y-auto px-0 py-5">
          {pollsData.map((poll) => (
            <QuestionOption
              onClickQuestion={() => {
                setSelectedPoll(poll);
                closePopup(false);
              }}
              key={poll.id}
              questionTitle={poll.title}
              questionMeta={`${poll.poll_type === "SINGLE_CHOICE" ? "Lựa chọn đơn" : "Lựa chọn nhiều"} • ${poll.total_votes} phản hồi `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionSelectorPopUp;
