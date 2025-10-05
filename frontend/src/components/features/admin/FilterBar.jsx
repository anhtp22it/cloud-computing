import React from "react";
/**
 * FilterBar dùng chung cho admin
 * @param {Array} filters [{ key, type, label, value, options, icon, placeholder }]
 * @param {Function} onChange (key, value) => void
 * @param {ReactNode} children (tùy chọn)
 */
export default function FilterBar({ filters, onChange, children }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      {filters.map((f) => (
        <div
          key={f.key}
          className={
            f.type === "input"
              ? "flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow"
              : ""
          }
        >
          {f.icon && <span className="text-[#c52032]">{f.icon}</span>}
          {f.type === "input" && (
            <input
              className="outline-none"
              placeholder={f.placeholder || f.label}
              value={f.value}
              onChange={(e) => onChange(f.key, e.target.value)}
            />
          )}
          {f.type === "select" && (
            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={f.value}
              onChange={(e) => onChange(f.key, e.target.value)}
            >
              {/* {f.options.map(opt => <option key={opt}>{opt}</option>)} */}
              {f.options.map((opt) => (
                <option key={f.key + "-" + opt}>{opt}</option>
              ))}
            </select>
          )}
          {f.type === "checkbox" && (
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={!!f.value}
                onChange={(e) => onChange(f.key, e.target.checked)}
              />
              {f.label}
            </label>
          )}
        </div>
      ))}
      {children}
    </div>
  );
}
