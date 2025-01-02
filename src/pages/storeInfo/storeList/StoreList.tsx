import { useStore } from "../../../context/store/storeContext";
import StoreCard from "./storeCard/StoreCard";
import styles from "./StoreList.module.scss";

const StoreList: React.FC = () => {
  const { state } = useStore();

  return (
    <ul className={styles.storeList}>
      {state.mergedLocations.map((location, index) => (
        <StoreCard key={index} location={location} />
      ))}
    </ul>
  );
};

export default StoreList;
