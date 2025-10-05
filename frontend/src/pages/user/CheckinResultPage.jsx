import { useCheckInEventMutation } from "@api/attendantApi";
import { openSnackbar } from "@store/slices/snackbarSlice";
import { fireConfetti } from "@utils/animate";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const CheckinResultPage = () => {
  const { eventToken } = useParams();
  const [checkInEvent, { data, isLoading, isError, error }] =
    useCheckInEventMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (eventToken) {
      checkInEvent({
        eventToken,
      });
    }
  }, [checkInEvent, eventToken]);

  useEffect(() => {
    if (data) {
      dispatch(
        openSnackbar({
          message: `🎉 Chúc mừng ${data.name}, bạn đã điểm danh thành công!`,
          type: "success",
        }),
      );
      fireConfetti();

      const timeout = setTimeout(() => navigate("/"), 5000);
      return () => clearTimeout(timeout);
    }
    if (isError) {
      dispatch(
        openSnackbar({
          message:
            error?.data?.message || "Điểm danh thất bại. Vui lòng thử lại.",
          type: "error",
        }),
      );
    }
  }, [data, dispatch, error?.data?.message, isError, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
        {isLoading ? (
          <p className="text-lg font-semibold text-blue-600">
            Đang xác thực điểm danh...
          </p>
        ) : isError ? (
          <div>
            <p className="mb-2 text-xl font-bold text-red-600">❌ Thất bại</p>
            <p className="text-gray-600">
              {error?.data?.message ||
                "Không thể điểm danh. Có thể bạn chưa đăng nhập hoặc mã QR không hợp lệ."}
            </p>
          </div>
        ) : data ? (
          <div>
            <p className="mb-2 text-xl font-bold text-green-600">
              ✅ Thành công
            </p>
            <p className="mb-1 text-gray-700">
              Chào {data.name}, bạn đã điểm danh vào sự kiện!
            </p>
            <p className="text-sm text-gray-500">{data.email}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Đang xử lý mã QR, vui lòng chờ...
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckinResultPage;
