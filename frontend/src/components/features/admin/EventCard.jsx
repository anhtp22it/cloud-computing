import { STATUS_CONFIG } from '@/const/STATUS_CONFIG';
import {
  faCalendarAlt,
  faEdit,
  faEye,
  faMapMarkerAlt,
  faTrash,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDateTime, stripImagesDescription } from '@/utils/helpers';

const EventCard = ({ event, onEdit, onDelete, onView }) => {
  const statusConfig = STATUS_CONFIG[event.status] || STATUS_CONFIG.UPCOMING;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-r from-blue-400 to-purple-500">
        {event.banner ? (
          <img
            src={`${import.meta.env.VITE_BASE_URL}/uploads/${event.banner}`}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-4xl text-white opacity-50" />
          </div>
        )}

        <div
          className={`absolute top-4 right-4 flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${statusConfig.color} text-white`}
        >
          <FontAwesomeIcon icon={statusConfig.icon} className="text-xs" />
          {statusConfig.label}
        </div>
      </div>

      <div className="p-6">
        <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-800">{event.title}</h3>
        <div
          className={`line-clamp-2 leading-[1.8] !font-normal whitespace-pre-wrap text-[#666] [&_*]:text-inherit [&_b]:!font-bold [&_strong]:!font-bold`}
          dangerouslySetInnerHTML={{
            __html: stripImagesDescription(event.description || ''),
          }}
        ></div>

        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500" />
            <span>{formatDateTime(event.start_time)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-500" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FontAwesomeIcon icon={faUsers} className="text-green-500" />
            <span>
              {event.current_participants}/{event.max_participants} người tham gia
            </span>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-50 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
            <span className="text-sm font-semibold text-white">
              {event.created_by_name?.charAt(0) || 'A'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Tạo bởi: {event.created_by_name}</p>
            {event.manager_name && (
              <p className="text-xs text-gray-600">Quản lý: {event.manager_name}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onView(event.id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
          >
            <FontAwesomeIcon icon={faEye} />
            Xem
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(event)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-yellow-600"
          >
            <FontAwesomeIcon icon={faEdit} />
            Sửa
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(event.id)}
            className="flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            <FontAwesomeIcon icon={faTrash} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
