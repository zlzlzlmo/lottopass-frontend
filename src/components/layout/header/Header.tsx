import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss";
import { ROUTES } from "../../../constants/routes";

const Header: React.FC = () => {
  const [isMobileNavVisible, setMobileNavVisible] = useState(false);

  const toggleMobileNav = () => {
    setMobileNavVisible((prev) => !prev);
  };

  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.logo}>
        LOTTO PASS
      </NavLink>
      <nav className={styles.nav}>
        <NavLink
          to={ROUTES.NUMBER_GENERATION}
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          번호 생성
        </NavLink>
        {/* <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          회차 기록
        </NavLink> */}
        {/* <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
          }
        >
          서비스 소개
        </NavLink> */}
      </nav>
      <div
        className={styles.hamburgerMenu}
        onClick={toggleMobileNav}
        aria-label="Toggle navigation"
      >
        ☰
      </div>
      <nav
        className={
          isMobileNavVisible
            ? `${styles.mobileNav} ${styles.show}`
            : styles.mobileNav
        }
      >
        <NavLink
          to={ROUTES.NUMBER_GENERATION}
          className={styles.mobileNavLink}
          onClick={() => setMobileNavVisible(false)}
        >
          번호 생성
        </NavLink>
        {/* <NavLink
          to="/history"
          className={styles.mobileNavLink}
          onClick={() => setMobileNavVisible(false)}
        >
          회차 기록
        </NavLink> */}
        {/* <NavLink
          to="/about"
          className={styles.mobileNavLink}
          onClick={() => setMobileNavVisible(false)}
        >
          서비스 소개
        </NavLink> */}
      </nav>
    </header>
  );
};

export default Header;
