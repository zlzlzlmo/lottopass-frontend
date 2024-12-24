import React from "react";
import Banner from "./banner/Banner";
import styles from "./Home.module.scss";
import Card from "./card/Card";
import Generation from "./generation/Generation";

const Home = () => {
  return (
    <div className={styles.container}>
      <Banner />
      <Card />
      <Generation />
    </div>
  );
};

export default Home;
