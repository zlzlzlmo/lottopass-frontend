import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.info}>
        <p className={styles.companyName}>LottoPass © 2025</p>
      </div>
      <div className={styles.contact}>
        <p>
          고객센터:{" "}
          <a href="mailto:zlzlzlmo60@gmail.com" className={styles.emailLink}>
            zlzlzlmo60@gmail.com
          </a>
        </p>
        <p>문의사항이 있다면 이메일로 연락주세요!</p>
      </div>
    </footer>
  );
};

export default Footer;
