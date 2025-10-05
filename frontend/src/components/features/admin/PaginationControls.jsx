import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const generatePageRange = (currentPage, totalPages) => {
  const delta = 2;
  const range = [];
  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }
  if (currentPage - delta > 2) {
    range.unshift("...");
  }
  if (currentPage + delta < totalPages - 1) {
    range.push("...");
  }
  range.unshift(1);
  if (totalPages > 1) {
    range.push(totalPages);
  }
  return [...new Set(range)];
};

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageRange = generatePageRange(currentPage + 1, totalPages).map((p) =>
    p === "..." ? p : p - 1,
  );

  return (
    <motion.div
      className="mt-8 flex items-center justify-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </motion.button>

      {pageRange.map((page, index) =>
        typeof page === "number" ? (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(page)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg font-semibold transition-colors ${
              page === currentPage
                ? "border-blue-500 bg-blue-500 text-white shadow-md"
                : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {page + 1}
          </motion.button>
        ) : (
          <span
            key={index}
            className="flex h-10 w-10 items-center justify-center font-semibold text-gray-500"
          >
            ...
          </span>
        ),
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </motion.button>
    </motion.div>
  );
};

export default PaginationControls;
