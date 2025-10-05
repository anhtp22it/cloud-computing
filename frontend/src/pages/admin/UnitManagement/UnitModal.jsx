import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useCreateUnitMutation, useUpdateUnitMutation } from '@/api/unitApi';
import { openSnackbar } from '@/store/slices/snackbarSlice';

const unitSchema = yup.object().shape({
  unit_name: yup.string().required('Tên đơn vị là bắt buộc'),
  unit_type: yup.string().required('Loại đơn vị là bắt buộc'),
  parent_id: yup.number().nullable(),
});

const UnitModal = ({ open, onClose, initialData, parentUnits }) => {
  const dispatch = useDispatch();
  const [createUnit, { isLoading: isCreating }] = useCreateUnitMutation();
  const [updateUnit, { isLoading: isUpdating }] = useUpdateUnitMutation();

  const [isParent, setIsParent] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(unitSchema),
    defaultValues: {
      unit_name: '',
      unit_type: 'DEPARTMENT',
      parent_id: null,
    },
  });

  const parentIdValue = watch('parent_id');

  useEffect(() => {
    if (open) {
      const isEditing = initialData && initialData.id;
      if (isEditing) {
        const isParentUnit = initialData.id === initialData.parent_id;
        setIsParent(isParentUnit);
        reset({
          unit_name: initialData.unit_name,
          unit_type: initialData.unit_type,
          parent_id: isParentUnit ? null : initialData.parent_id,
        });
      } else {
        setIsParent(!initialData?.parent_id);
        reset({
          unit_name: '',
          unit_type: 'DEPARTMENT',
          parent_id: initialData?.parent_id || null,
        });
      }
    }
  }, [initialData, open, reset]);

  const handleParentToggle = (e) => {
    const checked = e.target.checked;
    setIsParent(checked);
    if (checked) {
      setValue('parent_id', null);
    }
  };

  const onSubmit = async (formData) => {
    const isEditing = initialData && initialData.id;
    const payload = { ...formData };

    if (isParent) {
      delete payload.parent_id;
    }

    try {
      const action = isEditing
        ? updateUnit({ id: initialData.id, ...payload })
        : createUnit(payload);

      await action.unwrap();
      const message = isEditing ? 'Cập nhật đơn vị thành công!' : 'Tạo đơn vị thành công!';
      dispatch(openSnackbar({ message }));
      onClose();
    } catch (err) {
      dispatch(openSnackbar({ message: err?.data?.message || 'Đã xảy ra lỗi', type: 'error' }));
    }
  };

  if (!open) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold">
          {initialData?.id ? 'Chỉnh sửa đơn vị' : 'Tạo đơn vị mới'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Tên đơn vị</label>
            <input {...register('unit_name')} className="w-full rounded-md border p-2" />
            {errors.unit_name && <p className="text-sm text-red-500">{errors.unit_name.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Loại đơn vị</label>
            <select {...register('unit_type')} className="w-full rounded-md border p-2">
              <option value="DEPARTMENT">Phòng ban/Khoa</option>
              <option value="STUDENT">Sinh viên</option>
              <option value="EXTERNAL">Bên ngoài</option>
            </select>
            {errors.unit_type && <p className="text-sm text-red-500">{errors.unit_type.message}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isParentCheckbox"
              checked={isParent}
              onChange={handleParentToggle}
            />
            <label htmlFor="isParentCheckbox" className="text-sm font-medium">
              Là nhóm đơn vị (cha)
            </label>
          </div>

          {!isParent && (
            <div>
              <label className="mb-2 block text-sm font-medium">Thuộc nhóm (cha)</label>
              <select {...register('parent_id')} className="w-full rounded-md border p-2">
                <option value="">-- Chọn nhóm cha --</option>
                {parentUnits.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.unit_name}
                  </option>
                ))}
              </select>
              {parentIdValue === '' && (
                <p className="text-sm text-red-500">Vui lòng chọn nhóm cha</p>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3 border-t pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2">
              Hủy
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {isCreating || isUpdating ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnitModal;
