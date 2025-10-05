import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const getUnitTypeConfig = (type) => {
  switch (type) {
    case "DEPARTMENT":
      return {
        icon: "🏛️",
        label: "Phòng ban",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-800",
        badgeColor: "bg-blue-100"
      };
    case "TEAM":
      return {
        icon: "👥",
        label: "Nhóm",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-800",
        badgeColor: "bg-purple-100"
      };
    case "PROJECT_GROUP":
      return {
        icon: "📋",
        label: "Dự án",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-800",
        badgeColor: "bg-orange-100"
      };
    default:
      return {
        icon: "🏢",
        label: "Khác",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        textColor: "text-gray-800",
        badgeColor: "bg-gray-100"
      };
  }
};

const UnitCard = ({ unit, onEdit, onDelete }) => {
  console.log('🃏 UnitCard rendered with:', { unit: unit?.unit_name, onEdit: !!onEdit, onDelete: !!onDelete });
  const typeConfig = getUnitTypeConfig(unit.unit_type);

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${typeConfig.bgColor} ${typeConfig.borderColor} border shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
      style={{ pointerEvents: 'auto' }}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{typeConfig.icon}</div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                {unit.unit_name}
              </h3>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.badgeColor} ${typeConfig.textColor} mt-1`}>
                {typeConfig.label}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 relative z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log('🔧 Edit clicked for unit:', unit);
                console.log('onEdit function exists?', !!onEdit);
                if (onEdit) {
                  console.log('Calling onEdit...');
                  onEdit(unit);
                } else {
                  console.error('onEdit is not defined!');
                }
              }}
              className="rounded-lg bg-white/80 p-2 text-blue-600 shadow-sm transition-colors hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-20"
              title="Sửa đơn vị"
            >
              <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log('🗑️ Delete clicked for unit:', unit.id);
                console.log('onDelete function exists?', !!onDelete);
                if (onDelete) {
                  console.log('Calling onDelete...');
                  onDelete(unit.id);
                } else {
                  console.error('onDelete is not defined!');
                }
              }}
              className="rounded-lg bg-white/80 p-2 text-red-600 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 relative z-20"
              title="Xóa đơn vị"
            >
                            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Parent Unit Info */}
        {unit.parent_name ? (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-gray-400">Thuộc:</span>
            <span className="font-medium">{unit.parent_name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-gray-400">💫</span>
            <span>Đơn vị cấp cao</span>
          </div>
        )}
      </div>

      {/* Footer with ID */}
      <div className="bg-white/50 px-6 py-3 border-t border-white/30">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>ID: {unit.id}</span>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${typeConfig.textColor.replace('text-', 'bg-')}`}></div>
            <span>Đang hoạt động</span>
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
    </div>
  );
};

export default UnitCard;