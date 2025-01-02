import { NavLink } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import styles from "./Footer.module.scss";

const Footer = () => {
  const footerOptions = [
    { path: ROUTES.NUMBER_GENERATION, text: "번호생성" },
    { path: ROUTES.STORE_INFO, text: "당첨점 확인" },
    // "고객센터",
    // "로또 DATA",

    // "MY LOTTO",
    // "전체메뉴",
  ];

  return (
    <footer className={styles.footer}>
      {footerOptions.map((option, index) => (
        <NavLink key={index} to={option.path}>
          <button key={index} className={styles.button}>
            {option.text}
          </button>
        </NavLink>
      ))}
    </footer>
  );
};

export default Footer;
