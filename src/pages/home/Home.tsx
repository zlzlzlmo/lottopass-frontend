import React from "react";
import Banner from "./banner/Banner";
import styles from "./Home.module.scss";
import Card from "./card/Card";
import Generation from "./generation/Generation";
import Layout from "../../components/layout/Layout";

const Home = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <Banner />
        <Card />
        <Generation />
      </div>
    </Layout>
  );
};

export default Home;