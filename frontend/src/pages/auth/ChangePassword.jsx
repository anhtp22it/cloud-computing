import { useChangePasswordMutation } from '@/api/authApi';
import TextInput from '@/components/common/TextInput';
import { openSnackbar } from '@/store/slices/snackbarSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import FormField from '@/components/common/FormField';
import { CircularProgress } from '@mui/material';

const formSchema = yup.object().shape({
  oldPassword: yup.string().required('Mật khẩu cũ là bắt buộc'),
  newPassword: yup
    .string()
    .required('Mật khẩu mới là bắt buộc')
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .notOneOf([yup.ref('oldPassword')], 'Mật khẩu mới không được trùng với mật khẩu cũ'),
  confirmPassword: yup
    .string()
    .required('Vui lòng xác nhận mật khẩu mới')
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp'),
});

const ChangePassword = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [changePassword, { isLoading, error, isError }] = useChangePasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: yupResolver(formSchema),
  });

  const isFieldValid = (fieldName) => {
    return touchedFields[fieldName] && !errors[fieldName];
  };

  const onSubmit = async (formData) => {
    try {
      await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }).unwrap();

      dispatch(openSnackbar({ message: 'Đổi mật khẩu thành công!', type: 'success' }));
      navigation('/login');
      reset();
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.',
          type: 'error',
        }),
      );
    }
  };

  return (
    <div className="flex w-full items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Thay đổi mật khẩu</h2>
            <p className="text-gray-500">Cập nhật mật khẩu để bảo vệ tài khoản của bạn.</p>
          </div>

          {isError && error?.data?.message && <ErrorMessage message={error.data.message} />}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              label="Mật khẩu cũ"
              name="oldPassword"
              type="password"
              Component={TextInput}
              error={errors.oldPassword}
              isValid={isFieldValid('oldPassword')}
            />
            <FormField
              control={control}
              label="Mật khẩu mới"
              name="newPassword"
              type="password"
              Component={TextInput}
              error={errors.newPassword}
              isValid={isFieldValid('newPassword')}
            />
            <FormField
              control={control}
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              type="password"
              Component={TextInput}
              error={errors.confirmPassword}
              isValid={isFieldValid('confirmPassword')}
            />

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary flex w-full items-center justify-center rounded-xl px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading && <CircularProgress size={20} color="inherit" className="mr-2" />}
                {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          © 2025 VKU Event Portal. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
