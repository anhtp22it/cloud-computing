import { formatTimestampToDate, formatTimestampToTime, getTimeUntilEvent } from '@utils/helpers';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FallbackImage } from './FallbackBanner';
import { useDispatch } from 'react-redux';
import { useJoinEventMutation } from '@api/eventApi';
import { openSnackbar } from '@store/slices/snackbarSlice';
import EventStatusBadge from '../EventStatusBadge';

const EventCard = ({ event, isManageMode = false }) => {
  const dispatch = useDispatch();

  const [joinEvent, { isLoading: isJoining, error: joinError, isSuccess: isJoined }] =
    useJoinEventMutation();

  const handleJoinEvent = async (qrJoinToken) => {
    try {
      await joinEvent(qrJoinToken).unwrap();
    } catch {
      // ignore error
    }
  };

  useEffect(() => {
    if (isJoining) {
      dispatch(openSnackbar({ message: 'Đang tham gia sự kiện...', type: 'info' }));
    }
    if (isJoined) {
      dispatch(
        openSnackbar({
          message: 'Tham gia sự kiện thành công',
          type: 'success',
        }),
      );
    }
    if (joinError) {
      dispatch(
        openSnackbar({
          message: joinError?.data?.message || 'Không thể tham gia sự kiện',
          type: 'error',
        }),
      );
    }
  }, [isJoining, isJoined, joinError, dispatch]);

  const [imageState, setImageState] = useState({
    loaded: false,
    error: false,
    loading: true,
  });

  useEffect(() => {
    const img = new Image();
    img.src = import.meta.env.VITE_BASE_URL + `/uploads/${event.banner}`;

    img.onload = () => {
      setImageState({
        loaded: true,
        error: false,
        loading: false,
      });
    };

    img.onerror = () => {
      setImageState({
        loaded: false,
        error: true,
        loading: false,
      });
    };
  }, [event.banner]);

  const isEventPassed =
    new Date(
      event.start_time.toString().length === 10 ? event.start_time * 1000 : event.start_time,
    ) < new Date();

  const canRegister = event.status === 'UPCOMING' && !isEventPassed && !event.isRegistered;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-500/10 to-red-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      <div className={`relative flex aspect-video items-center justify-center overflow-hidden`}>
        {imageState.loading && <FallbackImage showProgress={true} />}

        {imageState.error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center text-gray-500">
              <div className="mb-2 text-4xl">🖼️</div>
              <p className="text-sm font-medium">Không thể tải banner</p>
              <p className="mt-1 text-xs text-gray-400">Vui lòng thử lại sau</p>
            </div>
          </div>
        )}

        {imageState.loaded && (
          <>
            <img
              src={import.meta.env.VITE_BASE_URL + `/uploads/${event.banner}`}
              alt={`${event.title} Banner`}
              className="absolute inset-0 h-full w-full object-cover brightness-90 transition-transform duration-300 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>

            <div className="absolute -top-1/2 -left-1/2 h-full w-full rotate-45 transform bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </>
        )}

        <div className="absolute top-4 right-4 z-20">
          <EventStatusBadge event={event} />
        </div>

        {event.status === 'UPCOMING' && (
          <div className="absolute top-4 left-4 z-20 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-700 shadow-lg backdrop-blur-sm">
            {getTimeUntilEvent(event.start_time)}
          </div>
        )}
      </div>

      <div className="relative z-20 p-6">
        <Link
          to={`/events/${event.id}`}
          title={event.title}
          aria-label={event.title}
          className="mb-4 line-clamp-2 cursor-pointer text-xl font-bold text-blue-600 transition-colors duration-300 group-hover:text-red-600"
        >
          {event.title}
        </Link>

        <div className="mb-5 space-y-1 text-gray-600">
          <div className="flex cursor-default items-center gap-3 rounded-lg p-2 transition-all duration-300 hover:bg-gray-50 hover:pl-4">
            <span className="text-lg">📅</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{formatTimestampToDate(event.start_time)}</span>
            </div>
          </div>

          <div className="flex cursor-default items-center gap-3 rounded-lg p-2 transition-all duration-300 hover:bg-gray-50 hover:pl-4">
            <span className="text-lg">⏰</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{formatTimestampToTime(event.start_time)}</span>
            </div>
          </div>

          <div className="flex cursor-default items-center gap-3 rounded-lg p-2 transition-all duration-300 hover:bg-gray-50 hover:pl-4">
            <span className="text-lg">📍</span>
            <div className="flex flex-col">
              <span className="line-clamp-2 text-sm font-medium" title={event.location}>
                {event.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            className="group/btn relative flex-1 cursor-pointer overflow-hidden rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/40 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
            to={`/events/${event.id}`}
          >
            <div className="absolute inset-0 scale-0 rounded-full bg-white/30 transition-transform duration-300 group-hover/btn:scale-100"></div>
            <span className="relative z-10 flex items-center justify-center">
              <span className="text-center">Xem chi tiết</span>
            </span>
          </Link>

          {isManageMode ? (
            <Link
              to={`/events/${event.id}/manage`}
              className={`group/btn relative flex-1 cursor-pointer overflow-hidden rounded-full bg-blue-500 px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/40 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:outline-none`}
            >
              <div
                className={`absolute inset-0 scale-0 rounded-full bg-white/30 transition-transform duration-300 group-hover/btn:scale-100`}
              ></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>Quản lý</span>
                <span className="transition-transform duration-300 group-hover/btn:scale-110">
                  ⚙️
                </span>
              </span>
            </Link>
          ) : (
            <button
              className={`group/btn relative flex-1 cursor-pointer overflow-hidden rounded-full px-5 py-3 text-sm font-bold transition-all duration-300 hover:-translate-y-1 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                canRegister
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500 hover:shadow-lg hover:shadow-yellow-400/40 focus:ring-yellow-500'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              }`}
              onClick={() => {
                if (!canRegister) {
                  return;
                }
                handleJoinEvent(event.qr_join_token);
              }}
              disabled={!canRegister}
            >
              <div
                className={`absolute inset-0 scale-0 rounded-full bg-white/30 transition-transform duration-300 ${
                  canRegister ? 'group-hover/btn:scale-100' : ''
                }`}
              ></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>{event.is_registered ? 'Đã đăng ký' : 'Đăng ký'}</span>
              </span>
            </button>
          )}
        </div>

        {!canRegister && event.status === 'UPCOMING' && isEventPassed && (
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-center text-xs text-amber-600">
            ⚠️ Sự kiện đã qua, không thể đăng ký
          </p>
        )}
      </div>
    </div>
  );
};

export default EventCard;
