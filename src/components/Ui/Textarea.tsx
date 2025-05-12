import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { AiOutlineInfoCircle, AiOutlineCheck } from "react-icons/ai";

interface TextareaProps {
  label?: string; // optional label for the textarea
  placeholder?: string; // optional placeholder text
  classLabel?: string; // optional class for the label
  className?: string; // optional class for the textarea
  classGroup?: string; // optional class for the group
  register?: UseFormRegister<any>; // optional register function (e.g., from React Hook Form)
  name?: string; // optional name for the textarea
  readonly?: boolean; // optional flag to make the textarea read-only
  value?: string; // optional default value
  error?: FieldError; // optional error object
  icon?: string; // optional icon name
  disabled?: boolean; // optional flag to disable the textarea
  id?: string; // optional id for the textarea
  horizontal?: boolean; // optional flag for horizontal layout
  validate?: boolean | string; // optional validation message (boolean or string)
  msgTooltip?: boolean; // optional flag to show message tooltip
  description?: string; // optional description
  cols?: number; // optional number of columns
  rows?: number; // optional number of rows (default is 3)
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void; // optional change handler
  [key: string]: any; // allows for additional props
}

const Textarea: React.FC<TextareaProps> = ({
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
  msgTooltip,
  description,
  cols,
  rows = 3,
  onChange,
  ...rest
}) => {
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
        {name && (
          <textarea
            {...(register && name ? register(name) : {})}
            placeholder={placeholder}
            className={`form-control py-2 ${className} ${error ? "has-error" : ""}`}
            readOnly={readonly}
            disabled={disabled}
            id={id}
            cols={cols}
            rows={rows}
            onChange={onChange}
            {...rest}
          />
        )}
        {!name && (
          <textarea
            className={`form-control py-2 ${className} ${error ? "has-error" : ""}`}
            placeholder={placeholder}
            readOnly={readonly}
            disabled={disabled}
            id={id}
            cols={cols}
            rows={rows}
            onChange={onChange}
            {...rest}
          />
        )}
        {/* icon */}
        <div className="flex text-xl absolute right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2 space-x-1 rtl:space-x-reverse">
          {error && (
            <span className="text-danger-500">
              <AiOutlineInfoCircle size={20} />
            </span>
          )}
          {validate && (
            <span className="text-success-500">
              <AiOutlineCheck size={20} />
            </span>
          )}
        </div>
      </div>
      {/* error and success message */}
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

export default Textarea;
