import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const UnitList = ({ groupedUnits, onEdit, onDelete, onAddChild }) => {
  return (
    <div className="space-y-8">
      {groupedUnits.map((parent) => (
        <motion.div
          key={parent.id}
          className="rounded-xl bg-white shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between border-b p-4 sm:p-6">
            <div>
              <h3 className="text-lg font-bold text-blue-800">{parent.unit_name}</h3>
              <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                {parent.unit_type}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAddChild(parent)}
                className="flex items-center gap-2 rounded-md bg-green-100 px-3 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-200"
              >
                <FontAwesomeIcon icon={faPlusCircle} />
                <span className="hidden sm:inline">Thêm con</span>
              </button>
              <button
                onClick={() => onEdit(parent)}
                className="h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                onClick={() => onDelete(parent)}
                className="h-8 w-8 rounded-md text-red-500 hover:bg-red-50"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>

          {/* Child Units List */}
          <div className="divide-y divide-gray-100 p-4">
            {parent.children.length > 0 ? (
              parent.children.map((child) => (
                <div key={child.id} className="flex items-center justify-between py-3">
                  <span className="text-gray-700">{child.unit_name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(child)}
                      className="h-8 w-8 rounded-md text-gray-500 hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => onDelete(child)}
                      className="h-8 w-8 rounded-md text-red-500 hover:bg-red-50"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-3 text-center text-sm text-gray-400">Chưa có đơn vị con nào.</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default UnitList;
