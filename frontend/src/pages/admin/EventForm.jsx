import React, { useEffect, useRef, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import {
  useGetEventByIdQuery,
  useUpdateEventMutation,
  useCreateEventMutation,
  useUploadEditorImageMutation,
  useUploadEventBannerMutation,
} from '@api/eventApi';
import { openSnackbar } from '@store/slices/snackbarSlice';
import FormField from '@components/common/FormField';
import TextInput from '@components/common/TextInput';
import SunEditorEditor from '@components/common/SunEditorEditor';
import BannerUpload from '@/components/features/user/BannerUpload';
import EventManagerSection from './EventManagementManage/EventManagerSection';
import dayjs from 'dayjs';
import { prependApiUrlToImages, stripApiUrlFromImages } from '@/utils/htmlProcessor';
import { base64ToFile } from '@/utils/eventHelpers';

const toDateInput = (timestampInSecondsOrIso) => {
  if (!timestampInSecondsOrIso) return '';
  const a = dayjs(timestampInSecondsOrIso * 1000);
  if (a.isValid()) return a.format('YYYY-MM-DDTHH:mm');
  const b = dayjs(timestampInSecondsOrIso);
  return b.isValid() ? b.format('YYYY-MM-DDTHH:mm') : '';
};

const EventForm = ({ onSuccess, onCancel, initialData, isEdit = false }) => {
  const dispatch = useDispatch();
  const editorRef = useRef(null);

  const [bannerFile, setBannerFile] = useState(null);

  const eventId = initialData ? initialData.id : null;
  const { data: eventDetail, refetch: refetchEvent } = useGetEventByIdQuery(eventId, {
    skip: !eventId,
  });

  useEffect(() => {
    if (eventId) refetchEvent();
  }, [eventId, refetchEvent]);

  const [uploadImage, { isLoading: isUploadingImage }] = useUploadEditorImageMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [uploadEventBanner, { isLoading: isUploadingBanner }] = useUploadEventBannerMutation();

  const defaultValues = useMemo(() => {
    const base = eventDetail || initialData || {};
    const processedDescription = prependApiUrlToImages(base?.description || '');

    return {
      title: base?.title || '',
      description: processedDescription,
      start_time: toDateInput(base?.start_time),
      end_time: toDateInput(base?.end_time),
      location: base?.location || '',
      max_participants: base?.max_participants ?? '',
      url_docs: base?.url_docs || '',
    };
  }, [eventDetail, initialData]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
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
      const uploads = [];
      const base64ToUrl = new Map();
      base64Images.forEach((file, base64String) => {
        const imgFile = file ?? base64ToFile(base64String);
        uploads.push(
          uploadImage(imgFile)
            .unwrap()
            .then((res) => {
              let returned = String(res?.url || '');
              if (!returned.startsWith('/')) returned = `/${returned}`;
              base64ToUrl.set(base64String, returned);
            }),
        );
      });
      try {
        await Promise.all(uploads);
        base64ToUrl.forEach((relativeUrl, b64) => {
          const safe = b64.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          finalHtmlContent = finalHtmlContent.replace(
            new RegExp(`src="${safe}"`, 'g'),
            `src="${relativeUrl}"`,
          );
        });
      } catch (e) {
        console.error('Upload ảnh thất bại:', e);
        dispatch(openSnackbar({ message: 'Upload một hoặc nhiều ảnh thất bại!', type: 'error' }));
        return;
      }
    }
    const relativeHtml = stripApiUrlFromImages(finalHtmlContent);

    const payload = {
      title: formData.title,
      description: relativeHtml,
      start_time: formData.start_time ? new Date(formData.start_time).toISOString() : null,
      end_time: formData.end_time ? new Date(formData.end_time).toISOString() : null,
      location: formData.location,
      max_participants: formData.max_participants ? Number(formData.max_participants) : null,
      url_docs: formData.url_docs || null,
    };

    try {
      let eventIdCurrent = initialData?.id;

      if (isEdit) {
        await updateEvent({ eventId: eventIdCurrent, ...payload }).unwrap();
        if (bannerFile) {
          await uploadEventBanner({ eventId: eventIdCurrent, bannerFile }).unwrap();
        }
        dispatch(
          openSnackbar({
            message: bannerFile
              ? 'Cập nhật sự kiện & banner thành công!'
              : 'Cập nhật sự kiện thành công!',
          }),
        );
      } else {
        const created = await createEvent(payload).unwrap();
        eventIdCurrent = created?.id ?? created?.data?.id;
        if (!eventIdCurrent) {
          console.warn('Không lấy được eventId từ createEvent response:', created);
        }

        if (eventIdCurrent && bannerFile) {
          try {
            await uploadEventBanner({ eventId: eventIdCurrent, bannerFile }).unwrap();
            dispatch(openSnackbar({ message: 'Tạo sự kiện & upload banner thành công!' }));
          } catch (e) {
            dispatch(
              openSnackbar({
                message: 'Tạo thành công nhưng upload banner thất bại!',
                type: 'error',
              }),
            );
          }
        } else {
          dispatch(openSnackbar({ message: 'Tạo sự kiện thành công!' }));
        }
      }

      onSuccess?.();
    } catch (error) {
      dispatch(
        openSnackbar({
          message:
            error?.data?.message || `Đã xảy ra lỗi khi ${isEdit ? 'cập nhật' : 'tạo'} sự kiện`,
          type: 'error',
        }),
      );
    }
  };

  const isLoading = isUpdating || isCreating || isSubmitting || isUploadingBanner;

  return (
    <div className="space-y-6">
      {isEdit && (
        <div className="space-y-4">
          <BannerUpload eventData={eventDetail || initialData} />
          <EventManagerSection eventId={eventId} />
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Section */}
        <div className="flex items-center gap-3">
          <div className="text-2xl">{isEdit ? '📝' : '✨'}</div>
          <h3 className="text-xl font-bold text-gray-800">
            {isEdit ? 'Cập nhật thông tin sự kiện' : 'Thông tin sự kiện mới'}
          </h3>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Ảnh banner (tùy chọn)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
          />
          {bannerFile && <p className="mt-1 text-xs text-gray-500">Đã chọn: {bannerFile.name}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <FormField
            control={control}
            name="title"
            label="Tên sự kiện"
            rules={{ required: 'Tên sự kiện là bắt buộc' }}
            Component={TextInput}
            error={errors.title}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Mô tả sự kiện</label>
            <Controller
              name="description"
              control={control}
              rules={{ required: 'Mô tả sự kiện là bắt buộc' }}
              render={({ field }) => (
                <SunEditorEditor ref={editorRef} value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Đổi name sang start_time / end_time */}
            <FormField
              control={control}
              name="start_time"
              label="Thời gian bắt đầu"
              type="datetime-local"
              rules={{ required: 'Thời gian bắt đầu là bắt buộc' }}
              Component={TextInput}
              error={errors.start_time}
            />
            <FormField
              control={control}
              name="end_time"
              label="Thời gian kết thúc"
              type="datetime-local"
              rules={{ required: 'Thời gian kết thúc là bắt buộc' }}
              Component={TextInput}
              error={errors.end_time}
            />
          </div>

          <FormField
            control={control}
            name="location"
            label="Địa điểm"
            rules={{ required: 'Địa điểm là bắt buộc' }}
            Component={TextInput}
            error={errors.location}
          />

          <FormField
            control={control}
            name="max_participants"
            label="Số lượng người tham gia tối đa"
            type="number"
            Component={TextInput}
            error={errors.max_participants}
          />

          <FormField
            control={control}
            name="url_docs"
            label="Tài liệu tham khảo (URL)"
            Component={TextInput}
            error={errors.url_docs}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isLoading || isUploadingImage}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isLoading || isUploadingImage ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {isUploadingImage ? 'Đang tải ảnh...' : 'Đang xử lý...'}
              </div>
            ) : isEdit ? (
              'Cập nhật sự kiện'
            ) : (
              'Tạo sự kiện'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
