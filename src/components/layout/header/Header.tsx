// React 관련
import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

// 외부 라이브러리
import { Drawer, Button } from "antd";
import {
  MenuOutlined,
  ArrowLeftOutlined,
  UserOutlined,
} from "@ant-design/icons";

// 상태 관리
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { clearUser } from "@features/auth/authSlice";

// 컴포넌트 및 상수
import FlexContainer from "@components/common/container/FlexContainer";
import { DarkModeToggle } from "@components/common/DarkModeToggle";
import { ROUTES } from "@/constants/routes";
import COLORS from "@/constants/colors";

// 스타일
import styles from "./Header.module.scss";

const Header: React.FC = () => {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerVisible((prev) => !prev);
  };

  const handleLogout = async () => {
    dispatch(clearUser());
    setDrawerVisible(false);
    navigate(ROUTES.HOME.path);
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
          <FlexContainer justify="space-between" align="center">
            <span
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: COLORS.PRIMARY,
              }}
            >
              LOTTO PASS
            </span>
            {user && (
              <div
                onClick={() => navigate(ROUTES.MYPAGE.path)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                aria-label="Go to My Page"
              >
                <UserOutlined
                  style={{ fontSize: "20px", color: COLORS.PRIMARY }}
                />
                <span
                  style={{
                    fontSize: "14px",
                    color: COLORS.PRIMARY,
                  }}
                >
                  마이페이지
                </span>
              </div>
            )}
          </FlexContainer>
        }
        placement="right"
        closable={true}
        onClose={toggleDrawer}
        open={isDrawerVisible}
        styles={{
          body: {
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "20px", // 버튼 간 간격 증가
            backgroundColor: COLORS.NEUTRAL_LIGHT,
          }
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

        <div style={{ marginTop: "auto" }}>
          <DarkModeToggle showLabel className="mb-4 w-full" />
          {user ? (
            <>
              <Button
                block
                onClick={handleLogout}
                style={{
                  height: "48px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: COLORS.NEUTRAL_LIGHT,
                  backgroundColor: COLORS.PRIMARY_DARK,
                  borderRadius: "8px",
                }}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <NavLink
              to={ROUTES.LOGIN.path}
              style={{ textDecoration: "none" }}
              onClick={() => setDrawerVisible(false)}
            >
              <Button
                block
                style={{
                  height: "48px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: COLORS.NEUTRAL_LIGHT,
                  backgroundColor: COLORS.PRIMARY_LIGHT,
                  borderRadius: "8px",
                }}
              >
                로그인 / 회원가입
              </Button>
            </NavLink>
          )}
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
