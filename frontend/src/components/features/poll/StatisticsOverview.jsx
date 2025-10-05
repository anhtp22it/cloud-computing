import React from "react";
import StatCard from "./StatCard";

const StatisticsOverview = ({ participantsNumber }) => {
  return (
    <div className="mb-[30px] grid grid-cols-2 gap-5 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
      <StatCard
        statNumber={participantsNumber}
        statLabel="Người tham gia"
        numberColor={"primary"}
      />
      <StatCard
        statNumber={50}
        statLabel="Cuộc bình chọn"
        numberColor={"secondary"}
      />
      <StatCard
        statNumber={10}
        statLabel="Tổng lượt video"
        numberColor={"accent"}
      />
    </div>
  );
};

export default StatisticsOverview;
