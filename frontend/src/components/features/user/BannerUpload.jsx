import { useUploadEventBannerMutation } from '@api/eventApi';
import { openSnackbar } from '@store/slices/snackbarSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const BannerUpload = ({ eventData }) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [uploadBanner, { isLoading, isSuccess, isError, error }] = useUploadEventBannerMutation();

  // Early return if eventData is null (when creating new event)
  if (!eventData) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-bold">Banner sự kiện</h3>
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <div className="mb-2 text-gray-600">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            Banner sẽ có thể được cập nhật sau khi tạo sự kiện thành công.
          </p>
        </div>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (selectedFile && eventData?.id) {
      try {
        await uploadBanner({
          eventId: eventData.id,
          bannerFile: selectedFile,
        });
      } catch (err) {
        console.log('Banner upload error:', err);
      }
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    const input = document.getElementById('banner-upload-input');
    if (input) input.value = '';
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(openSnackbar({ message: 'Cập nhật banner thành công' }));
      setSelectedFile(null);
      setPreviewUrl(null);
    }
    if (isError) {
      dispatch(
        openSnackbar({
          message: error?.data?.message || 'Có lỗi xảy ra',
          type: 'error',
        }),
      );
    }
  }, [isSuccess, isError, error, dispatch]);

  const currentBannerUrl = eventData?.banner
    ? `${import.meta.env.VITE_BASE_URL}/uploads/${eventData.banner}`
    : 'https://placehold.co/1200x400/e2e8f0/a0aec0?text=Lỗi';

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-xl font-bold">Banner sự kiện</h3>
      <div className="mb-4">
        <p className="mb-2 text-sm text-gray-600">Ảnh hiện tại:</p>
        <img
          src={previewUrl || currentBannerUrl}
          alt="Event Banner"
          className="h-auto max-h-64 w-full rounded-lg border object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/1200x400/e2e8f0/a0aec0?text=Lỗi';
          }}
        />
      </div>
      <div>
        <label
          htmlFor="banner-upload-input"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {selectedFile ? `Ảnh mới: ${selectedFile.name}` : 'Chọn ảnh mới để thay thế'}
        </label>
        <input
          id="banner-upload-input"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      {selectedFile && (
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleUpload}
            disabled={isLoading || !eventData?.id}
            className="rounded-lg bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            {isLoading ? 'Đang tải lên...' : 'Lưu Banner'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BannerUpload;
