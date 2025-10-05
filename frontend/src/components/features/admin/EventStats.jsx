import {
  faBan,
  faCalendarAlt,
  faCheckCircle,
  faClock,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EventStats = ({ stats }) => (
  <motion.div
    className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="rounded-xl border-l-4 border-blue-500 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">Tổng số</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <FontAwesomeIcon
          icon={faCalendarAlt}
          className="text-2xl text-blue-500"
        />
      </div>
    </div>

    <div className="rounded-xl border-l-4 border-green-500 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-green-600">Đang diễn ra</p>
          <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
        </div>
        <FontAwesomeIcon
          icon={faPlayCircle}
          className="text-2xl text-green-500"
        />
      </div>
    </div>

    <div className="rounded-xl border-l-4 border-blue-500 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">Sắp tới</p>
          <p className="text-2xl font-bold text-gray-800">{stats.upcoming}</p>
        </div>
        <FontAwesomeIcon icon={faClock} className="text-2xl text-blue-500" />
      </div>
    </div>

    <div className="rounded-xl border-l-4 border-gray-500 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600">Đã kết thúc</p>
          <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
        </div>
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="text-2xl text-gray-500"
        />
      </div>
    </div>

    <div className="rounded-xl border-l-4 border-red-500 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-red-600">Đã hủy</p>
          <p className="text-2xl font-bold text-gray-800">{stats.cancelled}</p>
        </div>
        <FontAwesomeIcon icon={faBan} className="text-2xl text-red-500" />
      </div>
    </div>
  </motion.div>
);

export default EventStats;
