import styles from "./Footer.module.scss";

const Footer = () => {
  const footerOptions = [
    "고객센터",
    "로또 DATA",
    "번호생성",
    "MY LOTTO",
    "전체메뉴",
  ];

  return (
    <footer className={styles.footer}>
      {footerOptions.map((option, index) => (
        <button key={index} className={styles.button}>
          {option}
        </button>
      ))}
    </footer>
  );
};

export default Footer;
