import React from "react";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  DeleteOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/container/Container";
import Banner from "@/components/common/banner/Banner";
import { useAppSelector } from "@/redux/hooks";
import { ROUTES } from "@/constants/routes";
import FlexContainer from "@/components/common/container/FlexContainer";
import Margin from "@/components/common/gap/Margin";

const MyPage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: (
        <DashboardOutlined style={{ fontSize: "24px", color: "#4caf50" }} />
      ),
      text: "대시보드",
      onClick: () => navigate(ROUTES.DASHBOARD.path),
    },
    {
      icon: <EditOutlined style={{ fontSize: "24px", color: "#3b82f6" }} />,
      text: "내 정보 수정",
      onClick: () => navigate(ROUTES.UPDATE_PROFILE.path),
    },
    {
      icon: <DeleteOutlined style={{ fontSize: "24px", color: "#ef4444" }} />,
      text: "회원 탈퇴",
      onClick: () => navigate(ROUTES.DELETE_ACCOUNT.path),
    },
  ];

  return (
    <Layout>
      <Container>
        <Banner>
          환영합니다, {user?.nickname}님! 계정을 관리하고 회원만의 특별한
          기능들을 누려보세요!
        </Banner>
        <Margin size={30} />
        <FlexContainer justify="center" align="center" gap={40}>
          {menuItems.map((item, index) => (
            <FlexContainer
              key={index}
              direction="column"
              align="center"
              onClick={item.onClick}
            >
              <div>{item.icon}</div>
              <span style={{ marginTop: "8px", fontSize: "14px" }}>
                {item.text}
              </span>
            </FlexContainer>
          ))}
        </FlexContainer>
      </Container>
    </Layout>
  );
};

export default MyPage;
