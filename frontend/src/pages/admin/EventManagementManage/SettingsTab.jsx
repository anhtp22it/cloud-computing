import {
  useUpdateEventMutation,
  useUploadEventBannerMutation,
} from "@api/eventApi";
import FormField from "@components/common/FormField";
import SunEditorEditor from "@components/common/SunEditorEditor";
import TextInput from "@components/common/TextInput";
import { openSnackbar } from "@store/slices/snackbarSlice";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const SettingsTab = ({
  eventData,
  mode = "edit", // "edit" hoặc "create"
  onSubmit: onSubmitProp,
  defaultValues: defaultValuesProp = {},
  isLoading: isLoadingProp = false,
  onCancel, // thêm prop này
}) => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [updateEvent, { isLoading: isUpdating, isError, error, isSuccess }] =
    useUpdateEventMutation();
  const [uploadBanner, { isLoading: isUploadingBanner }] =
    useUploadEventBannerMutation();

  const defaultValues = eventData
    ? {
        title: eventData.name,
        description: eventData.description,
        startTime: eventData.startTime?.slice(0, 16),
        endTime: eventData.endTime?.slice(0, 16),
        location: eventData.location,
        maxParticipants: eventData.maxParticipants,
        urlDocs: eventData.urlDocs || "",
      }
    : {
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
        maxParticipants: "",
        urlDocs: "",
        ...defaultValuesProp,
      };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting, errors },
  } = useForm({
    defaultValues,
  });

  const onSubmit = async (formData) => {
    if (onSubmitProp) {
      await onSubmitProp(formData, { reset });
      return;
    }
    // Mặc định: update event
    const payload = {
      title: formData.title,
      description: formData.description,
      start_time: formData.startTime,
      end_time: formData.endTime,
      location: formData.location,
      max_participants: Number(formData.maxParticipants),
      url_docs: formData.urlDocs,
    };
    try {
      await updateEvent({ eventId: eventData.id, ...payload }).unwrap();
    } catch {
      //
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      reset();
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await uploadBanner({ eventId: eventData.id, file }).unwrap();
      dispatch(openSnackbar({ message: "Tải lên banner thành công!" }));
      if (typeof window !== "undefined") window.location.reload(); // hoặc refetch event nếu có
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err?.data?.message || "Tải lên banner thất bại!",
          type: "error",
        }),
      );
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(openSnackbar({ message: "Cập nhập sự kiện thành công" }));
      // Không điều hướng sau khi lưu
      // navigate(`/events/${eventData?.id}`);
    }

    if (isError) {
      dispatch(openSnackbar({ message: error?.data?.message, type: "error" }));
    }
  }, [
    dispatch,
    error?.data?.message,
    eventData?.id,
    isError,
    isSuccess,
    // navigate,
  ]);

  return (
    <div className="w-full max-w-6xl space-y-6">
      <div className="rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h3 className="mb-2 text-2xl font-bold text-gray-900">
            {mode === "edit" ? "Cài đặt sự kiện" : "Tạo sự kiện"}
          </h3>
          <p className="text-gray-600">
            {mode === "edit"
              ? "Cập nhật thông tin và cài đặt cho sự kiện này"
              : "Tạo sự kiện mới với đầy đủ thông tin cần thiết"}
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={control}
            label="Tên sự kiện"
            name="title"
            type="text"
            Component={TextInput}
            error={errors.title}
          />
          {/* Upload banner ngay dưới tên sự kiện */}
          {mode === "edit" && eventData && (
            <div className="mb-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6">
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Banner sự kiện
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerChange}
                  disabled={isUploadingBanner}
                  className="flex-1 rounded-lg border-2 border-gray-300 bg-white p-3 transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                {isUploadingBanner && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    <span className="font-medium">Đang tải lên...</span>
                  </div>
                )}
              </div>
              {eventData.banner && (
                <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Banner hiện tại:
                  </p>
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/uploads/${eventData.banner}`}
                    alt="Banner"
                    className="h-auto max-w-full rounded-lg shadow-sm"
                    style={{ maxHeight: 200 }}
                  />
                </div>
              )}
            </div>
          )}

          <div className="mb-6">
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Mô tả
            </label>
            <div className="overflow-hidden rounded-xl border-2 border-gray-200 transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 hover:border-gray-300">
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SunEditorEditor value={value} onChange={onChange} />
                )}
              />
            </div>
            {errors.description && (
              <p className="mt-2 flex items-center text-sm text-red-600">
                <span className="mr-2">⚠️</span>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormField
              control={control}
              label="Thời gian bắt đầu"
              name="startTime"
              type="datetime-local"
              Component={TextInput}
              error={errors.startTime}
            />
            <FormField
              control={control}
              label="Thời gian kết thúc"
              name="endTime"
              type="datetime-local"
              Component={TextInput}
              error={errors.endTime}
            />
          </div>

          <FormField
            control={control}
            label="Địa điểm"
            name="location"
            Component={TextInput}
            error={errors.location}
          />

          <FormField
            control={control}
            label="Số lượng tối đa"
            name="maxParticipants"
            type="number"
            Component={TextInput}
            error={errors.maxParticipants}
          />

          <FormField
            control={control}
            label="Tài liệu"
            name="urlDocs"
            Component={TextInput}
            error={errors.urlDocs}
          />

          <div className="flex justify-end gap-6 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border-2 border-gray-300 px-8 py-3 font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={
                isLoadingProp ||
                isUpdating ||
                isUploadingBanner ||
                isSubmitting ||
                (mode === "edit" && !isDirty)
              }
              className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoadingProp || isUpdating || isUploadingBanner || isSubmitting
                ? "Đang lưu..."
                : mode === "edit"
                  ? "Lưu thay đổi"
                  : "Tạo sự kiện"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsTab;
