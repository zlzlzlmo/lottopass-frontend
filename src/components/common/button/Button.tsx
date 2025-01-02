import styles from "./Button.module.scss";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  width?: string;
  height?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  className = "",
  children = "확인",
  width,
  height,
}) => {
  return (
    <button
      className={`${styles.button} ${className} ${
        disabled ? styles.disabled : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      style={{ width, height }}
    >
      {children}
    </button>
  );
};

export default Button;
