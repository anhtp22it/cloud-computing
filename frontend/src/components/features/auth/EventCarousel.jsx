import { useGetEventsQuery } from '@/api/eventApi';
import Loading from '@/components/ui/Loading';
import { faCalendar, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import ConfirmationModal from './ConfirmationModal';

const EventCarousel = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useGetEventsQuery({
    page: 0,
    size: 5,
    status: 'UPCOMING',
  });

  const events = useMemo(() => data?.pagination?.content || [], [data]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const handleJoinClick = (eventId) => {
    setSelectedEventId(eventId);
    setIsModalOpen(true);
  };

  const handleConfirmLogin = () => {
    if (selectedEventId) {
      navigate('/login', {
        state: { from: `/events/${selectedEventId}` },
        replace: true,
      });
    }
    setIsModalOpen(false);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'linear',
    arrows: false,
  };

  if (isLoading) {
    return <Loading message="Đang tải sự kiện..." />;
  }

  return (
    <>
      <div className="relative z-10 flex h-full w-full flex-col justify-center">
        <div className="mb-8">
          <img src="/vku-text-logo.svg" alt="VKU Logo" />
        </div>
        <div className="max-w-lg">
          <h1 className="mb-6 text-3xl leading-tight font-bold">
            <p className="text-[#212121]">Chào mừng đến với</p>
            <p className="text-primary">VKU Event Portal</p>
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-[#757575]">
            Khám phá và tham gia các sự kiện thú vị tại Đại học Công nghệ Thông tin và Truyền thông
            Việt - Hàn
          </p>
        </div>

        <Slider {...settings}>
          {events.map((event) => (
            <div
              key={event.id}
              className="group relative !flex h-100 w-full flex-col justify-end overflow-hidden rounded-2xl bg-gray-800 p-6 text-white shadow-lg"
            >
              <img
                src={
                  event.banner
                    ? `${import.meta.env.VITE_BASE_URL}/uploads/${event.banner}`
                    : `https://placehold.co/1200x400/e2e8f0/a0aec0?text=Lỗi`
                }
                alt={event.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

              <div className="relative z-10">
                <h3 className="mb-2 text-xl font-bold">{event.title}</h3>
                <div className="mb-4 space-y-1 text-sm opacity-90">
                  <p>
                    <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                    {dayjs(event.start_time * 1000).format('HH:mm DD/MM/YYYY')}
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                    {event.location}
                  </p>
                </div>
                <button
                  onClick={() => handleJoinClick(event.id)}
                  className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition-all hover:scale-105 hover:bg-red-700 active:scale-95"
                >
                  Xem & Tham gia
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmLogin}
      />
    </>
  );
};

export default EventCarousel;
