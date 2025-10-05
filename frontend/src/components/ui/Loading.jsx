import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Loading = ({ message = 'Đang tải dữ liệu, vui lòng chờ...' }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center space-x-2">
          <motion.div
            className="h-4 w-4 rounded-full bg-blue-600"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="h-4 w-4 rounded-full bg-red-600"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          />
          <motion.div
            className="h-4 w-4 rounded-full bg-yellow-500"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          />
        </div>
        <p className="text-lg font-semibold text-gray-700">{message}</p>
      </motion.div>
    </div>
  );
};

export default Loading;
