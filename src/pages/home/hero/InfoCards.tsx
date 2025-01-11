import React, { useState } from "react";
import { Card } from "antd";
import styles from "./InfoCards.module.scss";
import Lottie from "lottie-react";
import {
  lottoLottie,
  simulationLottie,
  statisticLottie,
  storeLottie,
} from "./lottie";
import useIntersection from "@/hooks/useIntersection";
import { ROUTES } from "@/constants/routes";

const cards = [
  {
    title: "로또 번호 생성",
    description: "쉽고 빠르게 번호를 생성하고 당첨의 기회를 높이세요.",
    buttonText: "번호 생성하기",
    animation: lottoLottie,
    link: ROUTES.NUMBER_GENERATION.path,
    background: "#f9f9f9", // 연한 배경 색상
  },
  {
    title: "당첨 시뮬레이션",
    description:
      "과거 회차와 함께 시뮬레이션을 실행해 당첨 가능성을 확인하세요.",
    buttonText: "시뮬레이션 실행하기",
    animation: simulationLottie,
    link: ROUTES.S_NUMBER_GENERATION.path,
    background: "#e6f7ff", // 연한 파란색 배경
  },
  {
    title: "통계 분석",
    description: "로또 데이터를 분석하여 당첨 패턴을 발견하세요.",
    buttonText: "통계 확인하기",
    animation: statisticLottie,
    link: ROUTES.STATISTIC.path,
    background: "#fff7e6", // 연한 주황색 배경
  },
  {
    title: "판매점 찾기",
    description: "주변의 로또 판매점을 찾아보세요.",
    buttonText: "판매점 찾기",
    animation: storeLottie,
    link: ROUTES.STORE_INFO.path,
    background: "#fff0f6", // 연한 분홍색 배경
  },
];

const InfoCards: React.FC = () => {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);

  const handleIntersection = (index: number) => () => {
    setVisibleCards((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  return (
    <div className={styles.cardsContainer}>
      {cards.map((card, index) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const targetRef = useIntersection(handleIntersection(index), {
          threshold: 0.4,
        });

        return (
          <div
            key={index}
            ref={targetRef}
            className={`${styles.cardWrapper} ${
              visibleCards[index] ? styles.visible : ""
            }`}
          >
            <Card
              className={styles.card}
              style={{ background: card.background }}
            >
              <div className={styles.iconWrapper}>
                <Lottie
                  animationData={card.animation}
                  loop
                  style={{ width: 80, height: 80 }}
                />
              </div>
              <div className={styles.content}>
                <h2 className={styles.title}>{card.title}</h2>
                <p className={styles.description}>{card.description}</p>
              </div>
              <a href={card.link} className={styles.button}>
                {card.buttonText}
              </a>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default InfoCards;
