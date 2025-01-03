import React from "react";
import StoreCard from "../../../components/common/card/StoreCard";
import { WinningRegion } from "lottopass-shared";
import styles from "./StoreList.module.scss";

interface StoreListProps {
  data: WinningRegion[];
}

const StoreList: React.FC<StoreListProps> = ({ data }) => {
  return (
    <ul className={styles.storeList}>
      {data.map((region) => (
        <StoreCard key={region.id} {...region} />
      ))}
    </ul>
  );
};

export default StoreList;
