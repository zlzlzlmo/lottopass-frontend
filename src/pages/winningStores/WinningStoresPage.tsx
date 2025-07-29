import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import WinningStoreList from "../../features/region/components/stores/winningStore/WinningStoreList";
import { useWinningStoresByRegion } from "@/features/region/hooks/useWinningStoresByRegion";
import SearchRegions from "@/features/region/components/SearchRegions";
import { showError } from "@/utils/error";
import Container from "@/components/layout/container/Container";
import Banner from "@/components/common/banner/Banner";
import PlaceholderContent from "../../components/common/PlaceholderContent";
import { Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StoreRankingList } from "@/features/store-ranking";

const WinningStoresPage: React.FC = () => {
  const { data, isLoading, isError, handleClick } = useWinningStoresByRegion();
  const [activeTab, setActiveTab] = useState("search");

  if (isError) {
    showError();
    return;
  }

  return (
    <Layout>
      <Container>
        <Banner>
          💰 행운의 당첨 매장을 지금 확인하세요! <br />
          성공은 한 발짝 앞에!
        </Banner>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">지역별 검색</TabsTrigger>
            <TabsTrigger value="ranking">전국 랭킹</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search">
            <SearchRegions handleClick={handleClick} />
            {data.length <= 0 ? (
              <PlaceholderContent />
            ) : (
              <div className="w-full mt-4">
                {isLoading && (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-muted-foreground">로딩 중...</p>
                  </div>
                )}

                {!isLoading && <WinningStoreList data={data} />}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="ranking">
            <StoreRankingList />
          </TabsContent>
        </Tabs>
      </Container>
    </Layout>
  );
};

export default WinningStoresPage;
