import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useCreateEventMutation,
  useUploadEventBannerMutation,
} from "@api/eventApi";
import { Controller, useForm } from "react-hook-form";
import { openSnackbar } from "@store/slices/snackbarSlice";
import TextInput from "@components/common/TextInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormField from "@components/common/FormField";
import SunEditorEditor from "@components/common/SunEditorEditor";

const schema = yup.object().shape({
  title: yup.string().required("Tên sự kiện là bắt buộc"),
  description: yup.string().required("Mô tả là bắt buộc"),
  startTime: yup.string().required("Thời gian bắt đầu là bắt buộc"),
  endTime: yup
    .string()
    .required("Thời gian kết thúc là bắt buộc")
    .test(
      "is-after-start",
      "Thời gian kết thúc phải sau thời gian bắt đầu",
      function (value) {
        const { startTime } = this.parent;
        return startTime && value && new Date(value) > new Date(startTime);
      },
    ),
  location: yup.string().required("Địa điểm là bắt buộc"),
  maxParticipants: yup
    .number()
    .typeError("Số lượng phải là một con số")
    .positive("Số lượng phải là số dương")
    .integer("Số lượng phải là số nguyên")
    .required("Số lượng tối đa là bắt buộc"),
  urlDocs: yup
    .string()
    .url("Vui lòng nhập một URL hợp lệ cho tài liệu")
    .nullable(),
});

export default function EventCreate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [uploadBanner, { isLoading: isUploading }] =
    useUploadEventBannerMutation();

  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      maxParticipants: "",
      urlDocs: "",
    },
  });

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (formData) => {
    const eventData = {
      title: formData.title,
      description: formData.description,
      start_time: formData.startTime,
      end_time: formData.endTime,
      location: formData.location,
      max_participants: Number(formData.maxParticipants),
      url_docs: formData.urlDocs || null,
    };

    try {
      const createResponse = await createEvent(eventData).unwrap();
      const newEventId = createResponse.id;

      if (bannerFile) {
        await uploadBanner({
          eventId: newEventId,
          bannerFile: bannerFile,
        }).unwrap();
      }

      dispatch(openSnackbar({ message: "Tạo sự kiện mới thành công!" }));
      navigate("/admin/events");
    } catch (error) {
      dispatch(
        openSnackbar({
          message: error?.data?.message || "Đã có lỗi xảy ra",
          type: "error",
        }),
      );
    }
  };

  const handleCancel = () => {
    navigate("/admin/events");
  };

  const isLoading = isCreating || isUploading;

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tạo Sự Kiện Mới ✨</h1>
        <p className="text-gray-500">
          Điền các thông tin dưới đây để tạo một sự kiện.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Banner Upload */}
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-xl font-bold">Ảnh Bìa Sự Kiện</h3>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner Preview"
                  className="mx-auto h-48 w-auto rounded-md object-cover"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUpload}
                  className="mx-auto h-12 w-12 text-gray-300"
                  aria-hidden="true"
                />
              )}
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:outline-none hover:text-blue-500"
                >
                  <span>Tải ảnh lên</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleBannerChange}
                  />
                </label>
                <p className="pl-1">hoặc kéo và thả</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="mb-6 text-xl font-bold">Thông Tin Chi Tiết</h3>
          <div className="space-y-6">
            <FormField
              control={control}
              label="Tên sự kiện"
              name="title"
              Component={TextInput}
              error={errors.title}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Mô tả
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <SunEditorEditor {...field} />}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              label="Link tài liệu (nếu có)"
              name="urlDocs"
              Component={TextInput}
              error={errors.urlDocs}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-gray-300 px-6 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isLoading ? "Đang xử lý..." : "Tạo Sự Kiện"}
          </button>
        </div>
      </form>
    </div>
  );
}
