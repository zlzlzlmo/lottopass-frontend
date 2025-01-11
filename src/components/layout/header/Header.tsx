import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Drawer, Button } from "antd";
import { MenuOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./Header.module.scss";
import { ROUTES } from "../../../constants/routes";
import { useAppSelector } from "@/redux/hooks";
import COLORS from "@/constants/colors";

const Header: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerVisible((prev) => !prev);
  };

  const isHomePage = location.pathname === ROUTES.HOME.path;

  return (
    <header className={styles.header}>
      {isHomePage ? (
        <NavLink to={ROUTES.HOME.path} className={styles.logo}>
          LOTTO PASS
        </NavLink>
      ) : (
        <div
          className={styles.backButton}
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeftOutlined />
        </div>
      )}

      <div
        className={styles.hamburgerMenu}
        onClick={toggleDrawer}
        aria-label="Toggle navigation"
      >
        <MenuOutlined />
      </div>

      <Drawer
        title={
          <span
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: COLORS.PRIMARY,
            }}
          >
            LOTTO PASS
          </span>
        }
        placement="right"
        closable={true}
        onClose={toggleDrawer}
        open={isDrawerVisible}
        bodyStyle={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "20px", // 버튼 간 간격 증가
          backgroundColor: COLORS.NEUTRAL_LIGHT,
        }}
      >
        {Object.values(ROUTES)
          .filter((route) => route.label !== "")
          .map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              style={{ textDecoration: "none", border: "none" }}
              onClick={() => setDrawerVisible(false)}
            >
              <Button
                block
                style={{
                  height: "48px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color:
                    location.pathname === route.path
                      ? COLORS.NEUTRAL_LIGHT
                      : COLORS.PRIMARY,
                  backgroundColor:
                    location.pathname === route.path
                      ? COLORS.PRIMARY
                      : "transparent",
                  borderRadius: "8px",
                  borderColor:
                    location.pathname === route.path
                      ? "transparent"
                      : COLORS.NEUTRAL_DARK,
                }}
              >
                {route.label}
              </Button>
            </NavLink>
          ))}
      </Drawer>
    </header>
  );
};

export default Header;
