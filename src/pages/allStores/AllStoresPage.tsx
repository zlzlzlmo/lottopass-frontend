import Layout from "../../components/layout/Layout";
import { Spin } from "antd";
import SearchRegions from "@/features/region/components/SearchRegions";
import { useAllStoresByRegion } from "@/features/region/hooks/useAllStoresByRegion";
import { showError } from "@/utils/error";
import StoreList from "@/features/region/components/stores/store/StoreList";
import styles from "./AllStoresPage.module.scss";
import Banner from "@/components/common/banner/Banner";
import Container from "@/components/layout/container/Container";
import PlaceholderContent from "@/components/common/PlaceholderContent";

const AllStoresPage: React.FC = () => {
  const { data, isLoading, isError, handleClick } = useAllStoresByRegion();

  if (isError) {
    showError();
    return;
  }

  return (
    <Layout>
      <Container>
        <Banner>
          🌈 로또를 구매할 준비 되셨나요?
          <br /> 가까운 판매점을 확인하세요! <br />
        </Banner>
        <SearchRegions handleClick={handleClick} />
        {data.length <= 0 ? (
          <PlaceholderContent />
        ) : (
          <div className={styles.results}>
            {isLoading && (
              <div className={styles.loading}>
                <Spin size="large" tip="로딩 중..." />
              </div>
            )}
            {!isLoading && data.length > 0 && <StoreList data={data} />}
          </div>
        )}
      </Container>
    </Layout>
  );
};

export default AllStoresPage;
