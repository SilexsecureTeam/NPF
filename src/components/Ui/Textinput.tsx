import React, { useState } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AiOutlineInfoCircle, AiOutlineCheck } from "react-icons/ai";

interface TextinputProps {
  type?: string;
  label?: string;
  placeholder?: string;
  classLabel?: string;
  className?: string;
  classGroup?: string;
  register?: UseFormRegister<any>;
  name?: string;
  readonly?: boolean;
  value?: string;
  error?: FieldError;
  icon?: string;
  disabled?: boolean;
  id?: string;
  horizontal?: boolean;
  validate?: boolean | string;
  isMask?: boolean;
  msgTooltip?: boolean;
  description?: string;
  hasIcon?: boolean;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onFocus?: (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  defaultValue?: string;
  [key: string]: any;
}

const Textinput: React.FC<TextinputProps> = ({
  type = "text",
  label,
  placeholder = "--",
  classLabel = "form-label",
  className = "",
  classGroup = "",
  register,
  name,
  readonly,
  value,
  error,
  icon,
  disabled,
  id,
  horizontal,
  validate,
  isMask,
  msgTooltip,
  description,
  hasIcon,
  onChange,
  onFocus,
  defaultValue,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div
      className={`formGroup ${error ? "has-error" : ""} ${
        horizontal ? "flex" : ""
      } ${validate ? "is-valid" : ""}`}
    >
      {label && (
        <label
          htmlFor={id}
          className={`form-label ${
            horizontal ? "flex-0 mr-6 md:w-[100px] w-[60px] break-words" : ""
          }`}
        >
          {label}
        </label>
      )}
      <div className={`relative ${horizontal ? "flex-1" : ""}`}>
        {name && !isMask && (
          <input
            type={type === "password" && open ? "text" : type}
            {...(register && name ? register(name) : {})}
            placeholder={placeholder}
            className={`form-control ${className} ${error ? "has-error" : ""}`}
            readOnly={readonly}
            disabled={disabled}
            id={id}
            onChange={onChange}
            defaultValue={defaultValue}
            {...rest}
          />
        )}
        {!name && !isMask && (
          <input
            type={type === "password" && open ? "text" : type}
            className={`form-control ${className}`}
            placeholder={placeholder}
            readOnly={readonly}
            disabled={disabled}
            defaultValue={defaultValue}
            onChange={onChange}
            id={id}
            {...rest}
          />
        )}
        {/* icon */}
        <div className="flex text-xl absolute right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2 space-x-1 rtl:space-x-reverse">
          {hasIcon && (
            <span
              className="cursor-pointer text-secondary-500"
              onClick={handleOpen}
            >
              {open && type === "password" ? (
                <FaEye size={15} />
              ) : (
                <FaEyeSlash size={15} />
              )}
            </span>
          )}
          {error && (
            <span className="text-danger-500 right-0">
              <AiOutlineInfoCircle size={15} />
            </span>
          )}
          {validate && (
            <span className="text-success-500">
              <AiOutlineCheck size={15} />
            </span>
          )}
        </div>
      </div>
      {/* error and success message*/}
      {error && (
        <div
          className={`input-description ${
            msgTooltip
              ? "inline-block bg-red-500 text-white text-[10px] px-2 py-1 rounded"
              : "text-red-500 block text-sm"
          }`}
        >
          {error.message}
        </div>
      )}
      {!error && validate && (
        <div
          className={`input-description ${
            msgTooltip
              ? "inline-block bg-green-500 text-white text-[10px] px-2 py-1 rounded"
              : "text-green-500 block text-sm"
          }`}
        >
          {validate}
        </div>
      )}
      {description && <span className="input-description">{description}</span>}
    </div>
  );
};

export default Textinput;
