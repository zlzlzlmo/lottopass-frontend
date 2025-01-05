import styles from "./Layout.module.scss";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import PageTitle from "../common/text/title/PageTitle";

type LayoutProps = {
  children: React.ReactNode;
  pageTitle?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
  return (
    <div className={styles.layout}>
      <Header />
      {pageTitle && <PageTitle>{pageTitle}</PageTitle>}

      <main className={styles.content}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
