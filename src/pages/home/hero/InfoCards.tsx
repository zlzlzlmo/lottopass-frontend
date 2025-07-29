import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useMultipleIntersection from "@/hooks/useMultipleIntersection";
import { ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";
import { Sparkles, BarChart3, Store, Dice5, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import "@dotlottie/player-component";

const cards = [
  {
    title: "로또 번호 생성",
    description: "쉽고 빠르게 번호를 생성하고 당첨의 기회를 높이세요.",
    buttonText: "번호 생성하기",
    icon: Sparkles,
    animation: "/lottie/lotto.lottie",
    link: ROUTES.NUMBER_GENERATION.path,
    color: "text-primary",
    bgColor: "bg-primary/10",
    gradient: "from-primary/5 to-primary/10",
  },
  {
    title: "당첨 시뮬레이션",
    description: "과거 회차와 함께 시뮬레이션을 실행해 당첨 가능성을 확인하세요.",
    buttonText: "시뮬레이션 실행하기",
    icon: Dice5,
    animation: "/lottie/simulation.lottie",
    link: ROUTES.S_NUMBER_GENERATION.path,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    gradient: "from-secondary/5 to-secondary/10",
  },
  {
    title: "통계 분석",
    description: "로또 데이터를 분석하여 당첨 패턴을 발견하세요.",
    buttonText: "통계 확인하기",
    icon: BarChart3,
    animation: "/lottie/statistic.lottie",
    link: ROUTES.STATISTIC.path,
    color: "text-accent",
    bgColor: "bg-accent/10",
    gradient: "from-accent/5 to-accent/10",
  },
  {
    title: "1등 판매점 찾기",
    description: "주변 1등 판매점을 찾아 명당의 기를 누리세요.",
    buttonText: "1등 판매점 찾기",
    icon: Store,
    animation: "/lottie/win.lottie",
    link: ROUTES.WINNING_STORES.path,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    gradient: "from-purple-50 to-purple-100",
  },
  {
    title: "판매점 찾기",
    description: "주변의 로또 판매점을 찾아보세요.",
    buttonText: "판매점 찾기",
    icon: MapPin,
    animation: "/lottie/store.lottie",
    link: ROUTES.ALL_STORES.path,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    gradient: "from-pink-50 to-pink-100",
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            ref={(el) => (observerRef.current[index] = el)}
            className={cn(
              "transform transition-all duration-700",
              visibleCards[index] 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            )}
          >
            <Card 
              className={cn(
                "h-full cursor-pointer transition-all duration-300",
                "hover:shadow-lg hover:-translate-y-1",
                "bg-gradient-to-br",
                card.gradient
              )}
              onClick={() => navigate(card.link)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    card.bgColor
                  )}>
                    <Icon className={cn("h-6 w-6", card.color)} />
                  </div>
                  {/* Lottie Animation */}
                  {visibleCards[index] && (
                    <div className="w-20 h-20">
                      <dotlottie-player
                        src={card.animation}
                        background="transparent"
                        speed="1"
                        loop="true"
                        autoplay
                        style={{ width: "100%", height: "100%" }}
                      ></dotlottie-player>
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl">{card.title}</CardTitle>
                <CardDescription className="text-sm">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="ghost" 
                  className="group w-full justify-between"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(card.link);
                  }}
                >
                  {card.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default InfoCards;