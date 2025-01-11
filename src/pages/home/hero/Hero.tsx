import React from "react";
import { Typography } from "antd";
import { motion } from "framer-motion";
import styles from "./Hero.module.scss";

const { Title, Paragraph } = Typography;

const Hero: React.FC = () => {
  return (
    <motion.section
      className={styles.hero}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Title level={4}>로또 번호가 필요할 땐?</Title>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Title level={2} className={styles.heroHighlight}>
            LOTTO PASS
          </Title>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <Paragraph className={styles.heroText} style={{ marginBottom: 0 }}>
            쉽고
          </Paragraph>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.9 }}
        >
          <Paragraph className={styles.heroText} style={{ marginBottom: 0 }}>
            빠르게
          </Paragraph>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 2.4 }}
        >
          <Paragraph className={styles.heroText} style={{ marginBottom: 0 }}>
            로또 번호를 생성하세요!
          </Paragraph>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
