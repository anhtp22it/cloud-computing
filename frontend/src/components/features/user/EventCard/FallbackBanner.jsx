import React, { useEffect, useState } from 'react';

export const FallbackImage = ({ showProgress = true }) => {
  const [imageState, setImageState] = useState({
    loaded: false,
    error: false,
    loading: true,
    retries: 0,
    progress: 0,
  });

  useEffect(() => {
    if (imageState.loading && showProgress) {
      const interval = setInterval(() => {
        setImageState((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 15, 90),
        }));
      }, 200);

      return () => clearInterval(interval);
    }
  }, [imageState.loading, showProgress]);

  const LoadingSkeleton = () => (
    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
      <div className="animate-shimmer absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
        <div className="relative mb-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
          {showProgress && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold">{Math.round(imageState.progress)}%</span>
            </div>
          )}
        </div>
        <p className="text-sm font-medium">Đang tải banner...</p>
        {showProgress && (
          <div className="mt-2 h-2 w-32 overflow-hidden rounded-full bg-gray-300">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${imageState.progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};
