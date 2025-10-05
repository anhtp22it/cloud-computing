import React from "react";

const Error = ({ message }) => {
  return (
    <div className="my-7.5 flex min-h-[400px] items-center justify-center">
      <div className="rounded-2xl bg-red-50 p-8 text-center">
        <div className="mb-4 text-6xl">❌</div>
        <h2 className="mb-2 text-xl font-bold text-red-600">Có lỗi xảy ra</h2>
        <p className="text-gray-600">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
};

export default Error;
