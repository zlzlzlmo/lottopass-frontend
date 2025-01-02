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
      {/* 로고 */}
      <NavLink to={ROUTES.HOME.path} className={styles.logo}>
        LOTTO PASS
      </NavLink>

      {/* 데스크탑 네비게이션 */}
      <nav className={styles.nav}>
        {Object.values(ROUTES)
          .filter((route) => route.path !== "/") // 홈 경로 제외
          .map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              {route.label}
            </NavLink>
          ))}
      </nav>

      {/* 모바일 네비게이션 토글 */}
      <div
        className={styles.hamburgerMenu}
        onClick={toggleMobileNav}
        aria-label="Toggle navigation"
      >
        ☰
      </div>

      {/* 모바일 네비게이션 */}
      <nav
        className={
          isMobileNavVisible
            ? `${styles.mobileNav} ${styles.show}`
            : styles.mobileNav
        }
      >
        {Object.values(ROUTES)
          .filter((route) => route.label !== "")
          .map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={styles.mobileNavLink}
              onClick={() => setMobileNavVisible(false)}
            >
              {route.label}
            </NavLink>
          ))}
      </nav>
    </header>
  );
};

export default Header;
