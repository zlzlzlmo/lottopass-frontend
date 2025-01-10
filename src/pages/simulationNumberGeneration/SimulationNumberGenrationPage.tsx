import { Typography } from "antd";
import Layout from "../../components/layout/Layout";
import { SNumberActionButtons } from "./components";

const SimulationNumberGenrationPage: React.FC = () => {
  const { Text } = Typography;
  return (
    <Layout pageTitle="시뮬레이션 번호 생성">
      <Text
        type="secondary"
        style={{ display: "block", textAlign: "center", marginBottom: 20 }}
      >
        <strong>선택한 회차의 당첨번호 기준</strong> 내 생성된 번호 조합으로
        시뮬레이션 기능을 제공합니다. <br /> 즉,{" "}
        <strong>당첨 회차 전 시간으로 돌아간 상황</strong>의 시뮬레이션을
        제공합니다.
      </Text>
      <SNumberActionButtons />
    </Layout>
  );
};

export default SimulationNumberGenrationPage;
