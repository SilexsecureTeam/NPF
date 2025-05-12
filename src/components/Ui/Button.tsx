import React, { ReactNode } from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  text?: string;
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  icon?: IconType;
  loadingClass?: string;
  iconPosition?: "left" | "right";
  iconClassName?: string;
  link?: string;
  onClick?: () => void;
  div?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  type = "button",
  isLoading,
  disabled,
  className,
  children,
  icon: Icon,
  loadingClass = "h-5 w-5",
  iconPosition = "left",
  iconClassName = "text-[20px]",
  link,
  onClick,
  div,
}) => {
  const renderContent = () => (
    <>
      {children && !isLoading && children}

      {!children && !isLoading && (
        <span className="flex items-center">
          {Icon && (
            <span
              className={`
                ${iconPosition === "right" ? "order-1 ml-2" : ""}
                ${text && iconPosition === "left" ? "mr-2" : ""}
                ${iconClassName}
              `}
            >
              <Icon />
            </span>
          )}
          <span>{text}</span>
        </span>
      )}

      {isLoading && (
        <>
          <svg
            className={`animate-spin mr-3 h-5 w-5 ${loadingClass}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </>
      )}
    </>
  );

  const commonClasses = `bg-primary text-white px-4 py-2 rounded transition-transform duration-200 transform hover:scale-105  active:scale-95 hover:ring-2 ring-black-900 hover:ring-opacity-80 ring-black-900   hover:ring-offset-1 inline-flex justify-center items-center ${
    isLoading ? "pointer-events-none" : ""
  } ${disabled ? "opacity-40 cursor-not-allowed" : ""} ${className}`;

  if (link) {
    return (
      <a href={link} className={commonClasses} onClick={onClick}>
        {renderContent()}
      </a>
    );
  }

  if (div) {
    return (
      <div className={commonClasses} onClick={onClick}>
        {renderContent()}
      </div>
    );
  }

  return (
    <button type={type} onClick={onClick} className={commonClasses}>
      {renderContent()}
    </button>
  );
};

export default Button;
