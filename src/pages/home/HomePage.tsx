import Hero from "./hero/Hero";
import Layout from "../../components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { useLatestDraw } from "@/features/draw/hooks/useLatestDraw";
import InfoCards from "./hero/InfoCards";
import Container from "@/components/layout/container/Container";
import QRScanner from "@/components/QRScanner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LottoBall } from "@/components/ui/lotto-ball";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatPrize } from "@/utils";
import { Loader2, Trophy, Users, DollarSign, ArrowRight } from "lucide-react";

const HomePage = () => {
  const { data: latestRound, isLoading, isError } = useLatestDraw();
  const navigate = useNavigate();

  const renderLatestDraw = () => {
    if (isLoading) {
      return (
        <Card className="w-full max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </Card>
      );
    } else if (latestRound) {
      const numbers = [
        latestRound.drwtNo1,
        latestRound.drwtNo2,
        latestRound.drwtNo3,
        latestRound.drwtNo4,
        latestRound.drwtNo5,
        latestRound.drwtNo6,
      ];

      return (
        <Card className="w-full max-w-4xl mx-auto overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">
                제 {latestRound.drwNo}회 당첨번호
              </CardTitle>
              <Badge variant="outline">
                {formatDate(latestRound.drwNoDate)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* 당첨 번호 */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {numbers.map((number, index) => (
                <LottoBall key={index} number={number} size="lg" />
              ))}
              <div className="flex items-center gap-2 ml-4">
                <span className="text-2xl text-gray-400">+</span>
                <LottoBall number={latestRound.bnusNo} size="lg" isBonus />
              </div>
            </div>

            {/* 당첨 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-gray-600 mb-1">1등 당첨금</p>
                <p className="text-xl font-bold text-primary">
                  {formatPrize(latestRound.firstWinamnt)}
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 mb-3">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <p className="text-sm text-gray-600 mb-1">1등 당첨자</p>
                <p className="text-xl font-bold text-secondary">
                  {latestRound.firstPrzwnerCo}명
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-3">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <p className="text-sm text-gray-600 mb-1">총 판매액</p>
                <p className="text-xl font-bold text-accent">
                  {formatPrize(latestRound.totSellamnt)}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 justify-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/history")}
              className="group"
            >
              모든 회차 보기
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      );
    }
    return null;
  };

  return (
    <Layout>
      <Container>
        <Hero />
        
        <div className="py-16">
          {!isError && renderLatestDraw()}
        </div>

        <div className="py-16 border-t">
          <h2 className="text-3xl font-bold text-center mb-12">
            로또 서비스 활용하기
          </h2>
          <InfoCards />
        </div>
      </Container>
      <QRScanner />
    </Layout>
  );
};

export default HomePage;