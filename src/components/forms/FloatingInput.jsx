import React from "react";

export function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  maxLength,
  inputMode
}) {
  return (
    <div className="lba-floating-field">
      <input
        id={id}
        type={type}
        required
        placeholder=" "
        value={value}
        autoComplete={autoComplete}
        maxLength={maxLength}
        inputMode={inputMode}
        onChange={onChange}
      />

      <label htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

