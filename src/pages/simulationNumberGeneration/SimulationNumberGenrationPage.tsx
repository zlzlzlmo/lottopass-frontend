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
        <strong>직전 회차의 당첨번호를 기준</strong>에서 생성된 번호 조합으로
        시뮬레이션 기능을 제공합니다. <br /> 즉,{" "}
        <strong>1주일 전으로 돌아간 상황</strong>에서 시뮬레이션을 해보는
        것입니다.
      </Text>
      <SNumberActionButtons />
    </Layout>
  );
};

export default SimulationNumberGenrationPage;
