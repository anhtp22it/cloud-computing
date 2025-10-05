import { useUpdateEventMutation, useUploadEditorImageMutation } from '@api/eventApi';
import FormField from '@components/common/FormField';
import SunEditorEditor from '@components/common/SunEditorEditor';
import TextInput from '@components/common/TextInput';
import BannerUpload from '@/components/features/user/BannerUpload';
import { openSnackbar } from '@store/slices/snackbarSlice';
import { prependApiUrlToImages, stripApiUrlFromImages } from '@utils/htmlProcessor';
import React, { useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { base64ToFile } from '@/utils/eventHelpers';

const toDateInput = (timestampInSeconds) => {
  if (!timestampInSeconds) return '';

  const date = dayjs(timestampInSeconds * 1000);
  if (!date.isValid()) {
    const fallbackDate = dayjs(timestampInSeconds);
    if (fallbackDate.isValid()) {
      return fallbackDate.format('YYYY-MM-DDTHH:mm');
    }
    return '';
  }

  return date.format('YYYY-MM-DDTHH:mm');
};

const SettingsTab = ({ eventData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [uploadImage, { isLoading: isUploadingImage }] = useUploadEditorImageMutation();
  const [updateEvent, { isLoading: isUpdating, isError, error: updateError, isSuccess }] =
    useUpdateEventMutation();

  const defaultValues = useMemo(() => {
    const processedDescription = prependApiUrlToImages(eventData?.description || '');

    return {
      title: eventData?.title || '',
      description: processedDescription,
      start_time: toDateInput(eventData?.start_time),
      end_time: toDateInput(eventData?.end_time),
      location: eventData?.location || '',
      max_participants: eventData?.max_participants ?? '',
      url_docs: eventData?.url_docs || '',
    };
  }, [eventData]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting, errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = async (formData) => {
    if (
      formData.start_time &&
      formData.end_time &&
      new Date(formData.end_time) < new Date(formData.start_time)
    ) {
      dispatch(
        openSnackbar({
          message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
          type: 'error',
        }),
      );
      return;
    }

    let finalHtmlContent =
      editorRef.current?.getContentWithRelativeUrls() || formData.description || '';

    const base64Images = editorRef.current?.getAllBase64ImagesInContent();

    if (base64Images && base64Images.size > 0) {
      const uploadPromises = [];
      const base64ToUrlMap = new Map();

      base64Images.forEach((file, base64String) => {
        const imageFile = file || base64ToFile(base64String);

        const promise = uploadImage(imageFile)
          .unwrap()
          .then((response) => {
            let returned = String(response?.url || '');

            // if (!returned.startsWith("/")) {
            //   returned = returned.startsWith("images/")
            //     ? `/${returned}`
            //     : `/images/${returned}`;
            // }

            const relativeUrl = '/' + returned;
            base64ToUrlMap.set(base64String, relativeUrl);
          });
        uploadPromises.push(promise);
      });

      try {
        await Promise.all(uploadPromises);

        base64ToUrlMap.forEach((relativeUrl, base64String) => {
          const safeBase64 = base64String.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          finalHtmlContent = finalHtmlContent.replace(
            new RegExp(`src="${safeBase64}"`, 'g'),
            `src="${relativeUrl}"`,
          );
        });
      } catch (uploadError) {
        console.error('Lỗi khi upload ảnh:', uploadError);
        dispatch(
          openSnackbar({
            message: 'Upload một hoặc nhiều ảnh thất bại!',
            type: 'error',
          }),
        );
        return;
      }
    }

    const relativePathHtml = stripApiUrlFromImages(finalHtmlContent);

    const payload = {
      title: formData.title,
      description: relativePathHtml,
      start_time: formData.start_time ? new Date(formData.start_time).toISOString() : null,
      end_time: formData.end_time ? new Date(formData.end_time).toISOString() : null,
      location: formData.location,
      max_participants: formData.max_participants ? Number(formData.max_participants) : null,
      url_docs: formData.url_docs || null,
    };

    try {
      await updateEvent({ eventId: eventData.id, ...payload }).unwrap();
      dispatch(openSnackbar({ message: 'Cập nhật sự kiện thành công' }));
      navigate(`/events/${eventData.id}`);
    } catch (updateError) {
      dispatch(
        openSnackbar({
          message: updateError?.data?.message || 'Cập nhật thất bại',
          type: 'error',
        }),
      );
    }
  };

  const handleCancel = () => {
    reset();
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(openSnackbar({ message: 'Cập nhật sự kiện thành công' }));
      navigate(`/events/${eventData.id}`);
    }

    if (isError) {
      dispatch(openSnackbar({ message: updateError?.data?.message, type: 'error' }));
    }
  }, [dispatch, updateError?.data?.message, eventData.id, isError, isSuccess, navigate]);

  return (
    <div className="space-y-6">
      <BannerUpload eventData={eventData} />

      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-6 text-xl font-bold">Cài đặt sự kiện</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={control}
            label="Tên sự kiện"
            name="title"
            Component={TextInput}
            error={errors.title}
          />
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Mô tả</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <SunEditorEditor ref={editorRef} value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={control}
              label="Thời gian bắt đầu"
              name="start_time"
              type="datetime-local"
              Component={TextInput}
              error={errors.start_time}
            />
            <FormField
              control={control}
              label="Thời gian kết thúc"
              name="end_time"
              type="datetime-local"
              Component={TextInput}
              error={errors.end_time}
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
            name="max_participants"
            type="number"
            Component={TextInput}
            error={errors.max_participants}
          />
          <FormField
            control={control}
            label="Tài liệu"
            name="url_docs"
            Component={TextInput}
            error={errors.url_docs}
          />

          <div className="flex justify-end gap-4">
            <button type="button" onClick={handleCancel} className="...">
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isUploadingImage || isUpdating || isSubmitting || !isDirty}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isUploadingImage ? 'Đang tải ảnh...' : isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsTab;
