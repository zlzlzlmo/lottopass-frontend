import React, { useEffect } from "react";
import { Button } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";

interface KakaoShareButtonProps {
  numbers: number[];
}

const KakaoShareButton: React.FC<KakaoShareButtonProps> = ({ numbers }) => {
  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    }
  }, []);

  const getNextDrawDate = (): string => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7; // 다음 토요일까지 남은 일 수
    const nextDrawDate = new Date(today);
    nextDrawDate.setDate(today.getDate() + daysUntilSaturday);
    return nextDrawDate.toLocaleDateString(); // YYYY-MM-DD 형식
  };

  const handleKakaoShare = () => {
    if (!window.Kakao) {
      console.error("Kakao SDK is not loaded.");
      return;
    }

    const numbersText = numbers.join(", ");
    const drawDate = getNextDrawDate();

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "이번 주 로또 번호 추천",
        description: `로또 번호: ${numbersText}\n추첨일: ${drawDate}`,
        imageUrl: "/lotto-share.png",
        link: {
          mobileWebUrl: "https://www.lottopass.co.kr/number-generation",
          webUrl: "https://www.lottopass.co.kr/number-generation",
        },
      },
      buttons: [
        {
          title: "나도 번호 생성하기",
          link: {
            mobileWebUrl: "https://www.lottopass.co.kr/number-generation",
            webUrl: "https://www.lottopass.co.kr/number-generation",
          },
        },
      ],
    });
  };

  return (
    <div>
      <Button
        icon={<ShareAltOutlined />}
        onClick={handleKakaoShare}
        style={{ flex: 1 }}
      >
        공유
      </Button>
    </div>
  );
};

export default KakaoShareButton;
