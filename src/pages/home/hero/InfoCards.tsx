import React, { useState } from "react";
import { Card } from "antd";
import styles from "./InfoCards.module.scss";

import useMultipleIntersection from "@/hooks/useMultipleIntersection";
import { ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";
import "@dotlottie/player-component"; // doLottie를 사용하기 위해 import

const cards = [
  {
    title: "로또 번호 생성",
    description: "쉽고 빠르게 번호를 생성하고 당첨의 기회를 높이세요.",
    buttonText: "번호 생성하기",
    animation: "/lottie/lotto.lottie",
    link: ROUTES.NUMBER_GENERATION.path,
    background: "#f9f9f9", // 연한 배경 색상
  },
  {
    title: "당첨 시뮬레이션",
    description:
      "과거 회차와 함께 시뮬레이션을 실행해 당첨 가능성을 확인하세요.",
    buttonText: "시뮬레이션 실행하기",
    animation: "/lottie/simulation.lottie",
    link: ROUTES.S_NUMBER_GENERATION.path,
    background: "#e6f7ff", // 연한 파란색 배경
  },
  {
    title: "통계 분석",
    description: "로또 데이터를 분석하여 당첨 패턴을 발견하세요.",
    buttonText: "통계 확인하기",
    animation: "/lottie/statistic.lottie",
    link: ROUTES.STATISTIC.path,
    background: "#fff7e6", // 연한 주황색 배경
  },
  {
    title: "1등 판매점 찾기",
    description: "주변 1등 판매점을 찾아 명당의 기를 누리세요.",
    buttonText: "1등 판매점 찾기",
    animation: "/lottie/win.lottie",
    link: ROUTES.WINNING_STORES.path,
    background: "#f3e6ff", // 연한 보라색 배경
  },
  {
    title: "판매점 찾기",
    description: "주변의 로또 판매점을 찾아보세요.",
    buttonText: "판매점 찾기",
    animation: "/lottie/store.lottie",
    link: ROUTES.WINNING_STORES.path,
    background: "#fff0f6", // 연한 분홍색 배경
  },
];

const InfoCards: React.FC = () => {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    Array(cards.length).fill(false)
  );
  const navigate = useNavigate();

  const observerRef = useMultipleIntersection(
    (entry, index) => {
      if (entry.isIntersecting) {
        setVisibleCards((prev) => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        });
      }
    },
    { threshold: 0.4 }
  );

  return (
    <div className={styles.cardsContainer}>
      {cards.map((card, index) => (
        <div
          key={index}
          ref={(el) => (observerRef.current[index] = el)}
          className={`${styles.cardWrapper} ${
            visibleCards[index] ? styles.visible : ""
          }`}
        >
          <Card className={styles.card} style={{ background: card.background }}>
            <div className={styles.iconWrapper}>
              {/* doLottie Player 사용 */}
              {visibleCards[index] && (
                <dotlottie-player
                  src={card.animation}
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                  style={{ width: 80, height: 80 }}
                ></dotlottie-player>
              )}
            </div>
            <div className={styles.content}>
              <h2 className={styles.title}>{card.title}</h2>
              <p className={styles.description}>{card.description}</p>
            </div>
            <button
              onClick={() => navigate(card.link)}
              className={styles.button}
            >
              {card.buttonText}
            </button>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default InfoCards;
