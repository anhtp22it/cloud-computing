import { useGetEventByIdQuery } from '@api/eventApi';
import { useGetPollStatByEventIdQuery } from '@api/pollApi';
import AdditionalPoll from '@/components/features/poll/AdditionalPoll';
import EventBanner from '@/components/features/poll/EventBanner';
import PollDashboard from '@/components/features/poll/PollDashboard';
import QuestionSelectorPopUp from '@/components/features/poll/QuestionSelector';
import StatisticsOverview from '@/components/features/poll/StatisticsOverview';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const PollAnalystic = () => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const eventId = useParams().eventId;
  const { data: eventData = [] } = useGetEventByIdQuery(eventId);
  const { data: pollsData = [] } = useGetPollStatByEventIdQuery(eventId);

  return (
    <div className="px-0 py-7">
      <div className="mx-auto max-w-[1200px] px-5">
        <h1 className="mb-8 text-center text-4xl font-bold text-[#e53935]">
          Thống kê bình chọn sự kiện
        </h1>
        <EventBanner eventData={eventData} />
        <StatisticsOverview participantsNumber={eventData?.max_participants} />
        <PollDashboard pollsData={pollsData} />
        <AdditionalPoll openPopup={setIsOpenPopup} selectedPoll={selectedPoll} />

        {isOpenPopup && (
          <QuestionSelectorPopUp
            closePopup={setIsOpenPopup}
            pollsData={pollsData}
            setSelectedPoll={setSelectedPoll}
          />
        )}
      </div>
    </div>
  );
};

export default PollAnalystic;
