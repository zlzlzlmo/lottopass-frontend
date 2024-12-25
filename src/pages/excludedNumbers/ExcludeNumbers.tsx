import styles from "./ExcludeNumbers.module.scss";
import Layout from "../../components/layout/Layout";
import NumbersGrid from "./numbersGrid/NumbersGrid";

const ExcludeNumbers = () => {
  const maxSelection = 10;

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>제외 번호 직접 선택</h1>
        <p className={styles.subtitle}>
          최대 {maxSelection}개의 번호를 선택할 수 있습니다.
        </p>

        <NumbersGrid maxSelection={maxSelection} />
      </div>
    </Layout>
  );
};

export default ExcludeNumbers;
