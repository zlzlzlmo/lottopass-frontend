import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  text?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  text = "확인",
}) => {
  return (
    <button
      className={`${styles.button} ${disabled ? styles.disabled : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
