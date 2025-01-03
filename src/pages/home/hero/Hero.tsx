import { Typography } from "antd";
import styles from "./Hero.module.scss";

const { Title, Paragraph } = Typography;

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <Title level={1} className={styles.heroTitle}>
          로또 번호가 필요할 땐?
        </Title>
        <Paragraph className={styles.heroText} style={{ marginBottom: 0 }}>
          LOTTO PASS와 함께 쉽고 빠르게
          <br /> 로또 번호를 생성하세요!
        </Paragraph>
      </div>
    </section>
  );
};

export default Hero;
