import React from "react";
import PollItem from "./PollItem";
// import { pollsData } from "@utils/constants";
import ParticipantList from "./ParticipantList/ParticipantList";

const PollDashboard = ({ pollsData }) => {
  return (
    <div className="mb-[30px] grid grid-cols-1 gap-[30px] md:grid-cols-[2fr_1fr]">
      <div className="animate-fadeInUP rounded-2xl bg-white p-[25px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition duration-300 ease-in-out hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-[1.3rem] font-semibold text-[#333]">
            Kết quả bình chọn chi tiết
          </h3>
          <span className="rounded-2xl bg-[#fbc02d] px-3 py-1 text-[0.8rem] font-medium text-[#333]">
            Đang diễn ra
          </span>
        </div>

        {pollsData.map((poll) => (
          <PollItem
            key={poll.id}
            pollQuestion={poll.title}
            pollType={
              poll.poll_type === "SINGLE_CHOICE"
                ? "Lựa chọn đơn"
                : "Lựa chọn nhiều"
            }
            pollResponsesNum={poll.total_votes}
            pollOptions={poll.options}
          />
        ))}
      </div>
      {/* <div className="animate-fadeInUP rounded-2xl bg-white p-[25px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition duration-300 ease-in-out hover:-translate-y-[5px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-[1.3rem] font-semibold text-[#333]">
            Danh sách người tham gia
          </h3>
          <span className="rounded-2xl bg-[#fbc02d] px-3 py-1 text-[0.8rem] font-medium text-[#333]">
            287 người
          </span>
        </div>
        <ParticipantList />
      </div> */}
    </div>
  );
};

export default PollDashboard;
