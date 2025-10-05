import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';

import { useForgotPasswordMutation } from '@api/authApi';
import { openSnackbar } from '@store/slices/snackbarSlice';
import FormField from '@components/common/FormField';
import TextInput from '@components/common/TextInput';
import ErrorMessage from '@/components/ui/ErrorMessage';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [forgotPassword, { isLoading, error, isError }] = useForgotPasswordMutation();

  const formSchema = yup.object().shape({
    email: yup.string().email('Định dạng email không hợp lệ').required('Email là bắt buộc'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    mode: 'onChange',
    defaultValues: { email: '' },
    resolver: yupResolver(formSchema),
  });

  const isFieldValid = (fieldName) => {
    return touchedFields[fieldName] && !errors[fieldName];
  };

  const onSubmit = async (formData) => {
    try {
      await forgotPassword(formData.email).unwrap();
      dispatch(
        openSnackbar({
          message: 'Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi.',
          type: 'success',
        }),
      );
    } catch {
      dispatch(
        openSnackbar({
          message: 'Nếu email tồn tại, một liên kết đặt lại mật khẩu đã được gửi.',
          type: 'success',
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
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Quên mật khẩu</h2>
            <p className="text-sm text-gray-600">
              Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
            </p>
          </div>
          {isError && error?.data?.message && <ErrorMessage message={error.data.message} />}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              label="Email"
              name="email"
              type="email"
              Component={TextInput}
              error={errors.email}
              isValid={isFieldValid('email')}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary flex w-full transform cursor-pointer items-center justify-center rounded-xl px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/40 active:scale-95"
            >
              {isLoading && <CircularProgress size={20} color="inherit" className="mr-2" />}
              Gửi liên kết
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Nhớ mật khẩu?{' '}
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

export default ForgotPassword;
