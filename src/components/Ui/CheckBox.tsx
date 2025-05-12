import React, { ChangeEvent } from "react";
import { AiOutlineCheck } from "react-icons/ai";

interface CheckboxProps {
  id?: string;
  disabled?: boolean;
  label?: string;
  value: boolean;
  name?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  activeClass?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  disabled,
  label,
  value,
  name,
  onChange,
  activeClass = "ring-black bg-slate-900 ",
}) => {
  return (
    <label
      className={`flex items-center ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      id={id}
    >
      <input
        type="checkbox"
        className="hidden"
        name={name}
        checked={value}
        onChange={onChange}
        // htmlFor={id}
        disabled={disabled}
      />
      <span
        className={`h-4 w-4 border flex-none border-slate-100 rounded 
        inline-flex ltr:mr-3 rtl:ml-3 relative transition-all duration-150
        ${value ? activeClass + " ring-2 ring-offset-2  " : "bg-slate-100  "}
        `}
      >
        {value && <AiOutlineCheck color="white" size={15} />}
      </span>
      <span className="text-slate-500 pl-5  text-sm leading-6 capitalize">
        {label}
      </span>
    </label>
  );
};

export default Checkbox;
