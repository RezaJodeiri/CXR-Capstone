import React from "react";

export const PrimaryTextInput = ({
  type,
  placeholder,
  value,
  onChange,
  required = true,
}) => {
  return (
    <input
      required={required}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="h-14 rounded p-2 w-full bg-[#F2F2F2] indent-5 placeholder-[#BFBFBF]"
    />
  );
};

export const PrimaryTextInputWithLabel = ({
  label,
  type,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="w-full flex flex-col gap-1">
      <h2 className="text-sm font-medium">{label}</h2>
      <PrimaryTextInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
