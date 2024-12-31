import styles from "./Container.module.scss";

type ContainerProps = {
  children: React.ReactNode;
  className?: string; // 추가적인 클래스 확장 가능
};

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={`${styles.container} ${className || ""}`}>{children}</div>
  );
};

export default Container;
