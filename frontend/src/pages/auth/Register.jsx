import FormField from "@components/common/FormField";
import TextInput from "@components/common/TextInput";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useDispatch } from "react-redux";
import { openSnackbar } from "@store/slices/snackbarSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRegisterMutation } from "@api/authApi";
import { useListUnitsQuery } from "@/api/unitApi";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { data = {}, isLoading, error, isError, isSuccess }] =
    useRegisterMutation();

  const [selectedParentId, setSelectedParentId] = useState("");

  const formSchema = yup.object().shape({
    name: yup.string().required("Tên là bắt buộc"),
    email: yup
      .string()
      .email("Định dạng email không hợp lệ")
      .required("Email là bắt buộc"),
    password: yup
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Mật khẩu là bắt buộc"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận phải khớp")
      .required("Mật khẩu xác nhận là bắt buộc"),
    phone_number: yup
      .string()
      .matches(/^\d{10}$/, "Số điện thoại phải có đúng 10 chữ số")
      .required("Số điện thoại là bắt buộc"),
    unit_id: yup
      .number()
      .typeError("Vui lòng chọn đơn vị")
      .required("Đơn vị là bắt buộc"),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, touchedFields },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "",
      unit_id: "",
    },
    resolver: yupResolver(formSchema),
  });

  const isFieldValid = (fieldName) => {
    return touchedFields[fieldName] && !errors[fieldName];
  };

  const { data: unitsPage, isLoading: isLoadingUnits } = useListUnitsQuery(
    { page: 0, size: 1000, sort: "unitName,asc" },
    { refetchOnMountOrArgChange: true },
  );
  const allUnits = unitsPage?.content ?? [];

  const parentUnits = useMemo(() => {
    if (!allUnits.length) return [];
    const parentsMap = new Map();
    allUnits.forEach((unit) => {
      if (!parentsMap.has(unit.parent_id)) {
        parentsMap.set(unit.parent_id, unit.parent_name);
      }
    });
    return Array.from(parentsMap, ([id, name]) => ({ id, name }));
  }, [allUnits]);

  const childUnits = useMemo(() => {
    if (!selectedParentId || !allUnits.length) return [];
    return allUnits.filter(
      (unit) =>
        unit.parent_id === selectedParentId && unit.id !== unit.parent_id,
    );
  }, [selectedParentId, allUnits]);

  const handleParentChange = (e) => {
    const parentId = Number(e.target.value);
    setSelectedParentId(parentId);
    setValue("unit_id", "", { shouldValidate: true });
  };

  function onSubmit(formData) {
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirm_password,
      phone_number: formData.phone_number,
      unit_id: Number(formData.unit_id),
    };
    register(payload);
  }

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        openSnackbar({ message: data?.message || "Đăng ký thành công!" }),
      );
      navigate("/login");
    }
  }, [isSuccess, data?.message, dispatch, navigate]);

  return (
    <div className="flex w-full items-center justify-center px-8 py-12 lg:w-1/2">
      <div className="w-full max-w-md">
        <img
          src="/vku-text-logo.svg"
          alt="VKU Logo"
          className="mb-8 block lg:hidden"
        />
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Tạo tài khoản mới
            </h2>
          </div>

          {isError && error && error.data && error.data.message && (
            <ErrorMessage message={error.data.message} />
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              label="Họ tên"
              name="name"
              Component={TextInput}
              error={errors["name"]}
              isValid={isFieldValid("name")}
            />
            <FormField
              control={control}
              label="Email"
              name="email"
              type="email"
              Component={TextInput}
              error={errors["email"]}
              isValid={isFieldValid("email")}
            />
            <FormField
              control={control}
              label="Số điện thoại"
              name="phone_number"
              type="tel"
              Component={TextInput}
              error={errors["phone_number"]}
              isValid={isFieldValid("phone_number")}
            />
            <FormField
              control={control}
              label="Mật khẩu"
              name="password"
              type="password"
              Component={TextInput}
              error={errors["password"]}
              isValid={isFieldValid("password")}
            />
            <FormField
              control={control}
              label="Xác nhận mật khẩu"
              name="confirm_password"
              type="password"
              Component={TextInput}
              error={errors["confirm_password"]}
              isValid={isFieldValid("confirm_password")}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Loại tài khoản
              </label>
              <select
                onChange={handleParentChange}
                value={selectedParentId}
                disabled={isLoadingUnits}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="" disabled>
                  {isLoadingUnits
                    ? "Đang tải..."
                    : "--- Chọn loại tài khoản ---"}
                </option>
                {parentUnits.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedParentId && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Đơn vị / Lớp
                </label>
                <Controller
                  name="unit_id"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className={`w-full rounded-lg border p-3 focus:border-blue-500 focus:ring-blue-500 ${errors.unit_id ? "border-red-500" : "border-gray-300"}`}
                    >
                      <option value="" disabled>
                        --- Chọn đơn vị / lớp ---
                      </option>
                      {childUnits.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.unit_name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.unit_id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.unit_id.message}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary w-full transform cursor-pointer rounded-xl px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:scale-103 hover:shadow-lg hover:shadow-red-500/40 active:scale-95"
            >
              Đăng ký
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-secondary font-medium hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          © 2025 VKU Event Portal. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Register;
