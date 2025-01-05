import Layout from "../../components/layout/Layout";
import { NumberActionButtons } from "./components";

const NumberGenerationPage: React.FC = () => {
  return (
    <Layout pageTitle="번호 생성">
      <NumberActionButtons />
    </Layout>
  );
};

export default NumberGenerationPage;
