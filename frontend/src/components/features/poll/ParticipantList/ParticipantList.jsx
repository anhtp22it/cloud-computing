import React from "react";
import ParticipantItem from "./ParticipantItem";
import { participants } from "@utils/constants";

const ParticipantList = () => {
  return (
    <div className="overflow-y-auto">
      {participants.map((participant) => (
        <ParticipantItem
          key={participant.id}
          avatar={participant.avatar}
          name={participant.name}
          email={participant.email}
          votes={participant.votes}
        />
      ))}
    </div>
  );
};

export default ParticipantList;
