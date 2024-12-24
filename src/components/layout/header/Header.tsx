import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.scss";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        LOTTO PASS
      </Link>
    </header>
  );
};

export default Header;
