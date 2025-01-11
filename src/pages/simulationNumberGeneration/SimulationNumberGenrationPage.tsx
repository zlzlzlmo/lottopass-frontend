import { Typography } from "antd";
import Layout from "../../components/layout/Layout";
import { NumberActionButtons } from "../numberGeneration/components";
import Container from "@/components/layout/container/Container";
import Banner from "@/components/common/banner/Banner";

const SimulationNumberGenrationPage: React.FC = () => {
  const { Text } = Typography;
  return (
    <Layout>
      <Container>
        <Banner>🎲 나만의 로또 전략, 지금 바로 시뮬레이션 해보세요!</Banner>
        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginBottom: 20 }}
        >
          <strong>선택한 회차의 당첨번호 기준</strong> 내 생성된 번호 조합으로
          시뮬레이션 기능을 제공합니다. <br />
        </Text>
        <NumberActionButtons />
      </Container>
    </Layout>
  );
};

export default SimulationNumberGenrationPage;
