import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-center">
        <FontAwesomeIcon icon={faCircleExclamation} className="text-primary" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Đăng ký thất bại</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
