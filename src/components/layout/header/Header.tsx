import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Drawer, Button } from "antd";
import { MenuOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import styles from "./Header.module.scss";
import { ROUTES } from "../../../constants/routes";

const Header: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
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
            style={{ fontSize: "20px", fontWeight: "bold", color: "#3b82f6" }}
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
          gap: "16px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {Object.values(ROUTES)
          .filter((route) => route.label !== "")
          .map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              style={{ textDecoration: "none" }}
              onClick={() => setDrawerVisible(false)}
            >
              <Button
                block
                style={{
                  height: "48px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#3b82f6",
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
