import React from 'react';

export default function LoadingState({ message = 'Đang tải dữ liệu...' }) {
  return (
    <div className="loading-state">
      <h3>🔄 {message}</h3>
    </div>
  );
}
