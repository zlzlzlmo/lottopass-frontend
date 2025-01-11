import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { UpOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ScrollToTop.module.scss";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsVisible(scrollTop > 600);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    });
  }, [pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.scrollToTop}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            type="default"
            shape="circle"
            icon={<UpOutlined style={{ fontSize: "20px" }} />}
            onClick={scrollToTop}
            className={styles.scrollButton}
            style={{ width: "40px", height: "40px" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
