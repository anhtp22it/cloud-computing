import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';

import { useResetPasswordMutation } from '@api/authApi';
import { openSnackbar } from '@store/slices/snackbarSlice';
import FormField from '@components/common/FormField';
import TextInput from '@components/common/TextInput';
import ErrorMessage from '@/components/ui/ErrorMessage';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [resetPassword, { isLoading, error, isError }] = useResetPasswordMutation();

  const formSchema = yup.object().shape({
    newPassword: yup
      .string()
      .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
      .required('Mật khẩu mới là bắt buộc'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
      .required('Vui lòng xác nhận mật khẩu mới'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    resolver: yupResolver(formSchema),
  });

  useEffect(() => {
    if (!token) {
      dispatch(
        openSnackbar({
          message: 'Token đặt lại mật khẩu không hợp lệ hoặc bị thiếu.',
          type: 'error',
        }),
      );
      navigate('/login');
    }
  }, [token, dispatch, navigate]);

  const isFieldValid = (fieldName) => {
    return touchedFields[fieldName] && !errors[fieldName];
  };

  const onSubmit = async (formData) => {
    try {
      await resetPassword({
        token,
        newPassword: formData.newPassword,
      }).unwrap();

      dispatch(openSnackbar({ message: 'Đặt lại mật khẩu thành công!', type: 'success' }));
      navigate('/login', { replace: true });
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.data?.message || 'Đặt lại mật khẩu thất bại. Token có thể đã hết hạn.',
          type: 'error',
        }),
      );
    }
  };

  return (
    <div className="flex w-full items-center justify-center px-8 py-12 lg:w-1/2">
      <div className="w-full max-w-md">
        <img src="/vku-text-logo.svg" alt="VKU Logo" className="mb-8 block lg:hidden" />
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Đặt lại mật khẩu</h2>
          </div>
          {isError && error?.data?.message && <ErrorMessage message={error.data.message} />}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
            <button
              type="submit"
              disabled={isLoading || !token}
              className="bg-primary flex w-full transform cursor-pointer items-center justify-center rounded-xl px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/40 active:scale-95"
            >
              {isLoading && <CircularProgress size={20} color="inherit" className="mr-2" />}
              Cập nhật mật khẩu
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Đã nhớ lại mật khẩu?{' '}
              <Link to="/login" className="text-secondary font-medium hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          © 2025 VKU Event Portal. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
