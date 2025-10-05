import React from "react";
/**
 * DataTable dùng chung cho admin
 * @param {Array} columns [{ key, label, className, render? }]
 * @param {Array} data
 * @param {Function} renderCell (row, col) => ReactNode (tùy chọn)
 * @param {Function} renderActions (row) => ReactNode (tùy chọn)
 */
export default function DataTable({ columns, data, renderCell, renderActions }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-[#223b73] border-b">
            {columns.map(col => (
              <th key={col.key} className={"py-2 px-2 " + (col.className || "")}>{col.label}</th>
            ))}
            {renderActions && <th className="py-2 px-2"></th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-8 text-gray-400">Không có dữ liệu phù hợp</td>
            </tr>
          ) : data.map((row, idx) => (
            <tr key={row.id || idx} className="border-t">
              {columns.map(col => (
                <td key={col.key} className={"py-2 px-2 " + (col.className || "")}>{
                  col.render ? col.render(row, idx) : renderCell ? renderCell(row, col, idx) : row[col.key]
                }</td>
              ))}
              {renderActions && <td className="py-2 px-2">{renderActions(row, idx)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 