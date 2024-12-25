import React, { useEffect } from "react";

import styles from "./Layout.module.scss";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import { useLottoNumber } from "../../context/lottoNumbers";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { resetExcludedNumbers } = useLottoNumber();

  useEffect(() => {
    // 페이지 전환 시 제외 번호 초기화
    return () => {
      resetExcludedNumbers();
    };
  }, [resetExcludedNumbers]);

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.content}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
