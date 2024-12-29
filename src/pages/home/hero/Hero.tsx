import styles from "./Hero.module.scss";

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>로또 번호가 필요할 땐?</h1>
        <p>
          LOTTO PASS와 함께 쉽고 빠르게
          <br /> 로또 번호를 생성하세요!
        </p>
      </div>
    </section>
  );
};

export default Hero;
