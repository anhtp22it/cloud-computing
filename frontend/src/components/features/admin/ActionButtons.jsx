import React from "react";
/**
 * ActionButtons dùng chung cho admin
 * @param {Array} actions [{ label, onClick, color, icon, className }]
 */
export default function ActionButtons({ actions }) {
  return (
    <div className="flex gap-1">
      {actions.map((a, idx) => (
        <button
          key={idx}
          className={`btn btn-small ${a.color || ''} ${a.className || ''}`.trim()}
          onClick={a.onClick}
          type="button"
        >
          {a.icon && <span className="mr-1">{a.icon}</span>}{a.label}
        </button>
      ))}
    </div>
  );
} 