import Banner from "@/components/common/banner/Banner";
import Layout from "../../components/layout/Layout";
import { NumberActionButtons } from "./components";
import Container from "@/components/layout/container/Container";

const NumberGenerationPage: React.FC = () => {
  return (
    <Layout>
      <Container>
        <Banner>
          🌟 당첨의 시작, <strong>행운의 숫자</strong>를 지금 생성해보세요!
        </Banner>
        <NumberActionButtons />
      </Container>
    </Layout>
  );
};

export default NumberGenerationPage;
