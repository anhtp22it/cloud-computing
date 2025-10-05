import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faSitemap, faCodeBranch } from '@fortawesome/free-solid-svg-icons';

const StatCard = ({ icon, label, value, color }) => (
  <div className={`rounded-xl border-l-4 ${color.border} bg-white p-6 shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm font-semibold ${color.text}`}>{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <FontAwesomeIcon icon={icon} className={`text-2xl ${color.text}`} />
    </div>
  </div>
);

const UnitStats = ({ stats }) => {
  return (
    <motion.div
      className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <StatCard
        label="Tổng số đơn vị"
        value={stats.total}
        icon={faBuilding}
        color={{ border: 'border-blue-500', text: 'text-blue-600' }}
      />
      <StatCard
        label="Nhóm đơn vị (Cha)"
        value={stats.parents}
        icon={faSitemap}
        color={{ border: 'border-green-500', text: 'text-green-600' }}
      />
      <StatCard
        label="Đơn vị con"
        value={stats.children}
        icon={faCodeBranch}
        color={{ border: 'border-purple-500', text: 'text-purple-600' }}
      />
    </motion.div>
  );
};

export default UnitStats;
