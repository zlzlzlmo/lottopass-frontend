import React from "react";
import NavigationIcon from "@mui/icons-material/Navigation";
import styles from "./StoreCard.module.scss";
import { MergedLocation } from "../../../../context/store/storeReducer";

const StoreCard: React.FC<{ location: MergedLocation }> = ({ location }) => {
  return (
    <li className={styles.storeCard}>
      <div className={styles.cardHeader}>
        <div className={styles.tagContainer}>
          {location.drawNumbers.map((num) => (
            <span className={styles.tag} key={num}>
              {num}회
            </span>
          ))}
        </div>
      </div>
      <div className={styles.storeInfo}>
        <div>
          <h2 className={styles.storeName}>{location.storeName}</h2>
          <p>{location.district}</p>
          <p className={styles.storeAddress}>{location.address}</p>
          <p className={styles.storeDistance}>
            거리: {location.distance ? location.distance.toFixed(2) : "-"} km
          </p>
        </div>
        <button
          className={styles.navigateButton}
          onClick={() =>
            window.open(
              `https://map.kakao.com/link/to/${location.storeName},${location.coordinates?.lat},${location.coordinates?.lng}`,
              "_blank"
            )
          }
        >
          <NavigationIcon style={{ fontSize: "24px", color: "#3b82f6" }} />
        </button>
      </div>
    </li>
  );
};

export default StoreCard;
