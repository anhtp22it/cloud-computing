import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-blue-50 p-4">
      <motion.div
        className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-2xl"
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mb-4">
          <span className="bg-gradient-to-r from-red-500 to-blue-600 bg-clip-text text-8xl font-extrabold text-transparent">
            404
          </span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-800">Ối! Trang không tồn tại</h1>
        <p className="mb-8 text-gray-600">
          Có vẻ như bạn đã đi lạc hoặc trang bạn đang tìm kiếm đã được di chuyển. Đừng lo, chúng tôi
          sẽ giúp bạn quay lại đúng đường.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={handleGoBack}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-auto"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Quay lại
          </button>
          <Link
            to="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-lg sm:w-auto"
          >
            <FontAwesomeIcon icon={faHome} />
            Về trang chủ
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
