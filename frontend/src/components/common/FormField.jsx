import { Controller } from "react-hook-form";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const FormField = ({
  control,
  label,
  name,
  type = "text",
  error,
  // eslint-disable-next-line no-unused-vars
  Component,
  floatingLabel = true,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
  };

  const handleChange = (onChange) => (e) => {
    setHasValue(e.target.value.length > 0);
    onChange(e);
  };

  return (
    <div className="relative mb-4">
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, name } }) => (
          <>
            {floatingLabel ? (
              <>
                <Component
                  type={type}
                  name={name}
                  value={value}
                  onChange={handleChange(onChange)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className={`peer w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base transition-all duration-300 hover:border-blue-500 focus:border-blue-500 focus:outline-none ${hasValue || isFocused || value ? "pt-6 pb-2" : ""}`}
                  placeholder=" "
                  {...props}
                />
                <label
                  className={`pointer-events-none absolute left-4 text-gray-500 transition-all duration-300 ${
                    hasValue || isFocused || value
                      ? "top-1 text-xs font-medium text-yellow-500"
                      : "top-3 text-base"
                  }`}
                >
                  {label}{" "}
                  {!error && value !== "" && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="ml-auto text-green-500"
                    />
                  )}
                </label>
              </>
            ) : (
              <>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <Component
                  type={type}
                  name={name}
                  value={value}
                  onChange={handleChange(onChange)}
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                  {...props}
                />
              </>
            )}
          </>
        )}
      />

      {error && (
        <p className="mt-1 flex items-center text-sm text-red-500">
          <svg
            className="mr-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error.message}
        </p>
      )}
    </div>
  );
};
export default FormField;
