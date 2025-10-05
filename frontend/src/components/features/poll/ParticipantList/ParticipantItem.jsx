import React from "react";

const ParticipantItem = ({ avatar, name, email, votes }) => {
  return (
    <div className="mb-2 flex items-center gap-[15px] rounded-lg p-3 transition-colors duration-200 ease-in-out hover:translate-x-[5px] hover:bg-gray-100">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1e88e5] to-[#e53935] text-[0.9rem] font-semibold text-white">
        {avatar}
      </div>
      <div className="flex-1">
        <div className="text-[0.9rem] font-semibold text-[#333]">{name}</div>
        <div className="text-[0.8rem] text-[#666]">{email}</div>
      </div>
      <div className="rounded-[12px] bg-[#e53935] px-2 py-1 text-[0.8rem] font-medium text-white">
        {votes} votes
      </div>
    </div>
  );
};

export default ParticipantItem;
