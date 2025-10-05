const TextInput = ({
  onChange,
  value,
  name,
  type = "text",
  className = "",
  ...props
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
      {...props}
    />
  );
};

export default TextInput;
