import React from "react";
import styles from "./PageTitle.module.scss";

interface PageTitleProps {
  children: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ children }) => {
  return <h1 className={styles.title}>{children}</h1>;
};

export default PageTitle;
