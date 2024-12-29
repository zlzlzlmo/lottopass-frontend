import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  className = "",
  children = "확인",
}) => {
  return (
    <button
      className={`${styles.button} ${className} ${
        disabled ? styles.disabled : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
