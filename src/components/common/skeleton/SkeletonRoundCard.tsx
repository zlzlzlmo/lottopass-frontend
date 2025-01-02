import styles from "./SkeletonRoundCard.module.scss";

const SkeletonRoundCard = () => {
  return (
    <div className={styles.cardContainer}>
      <div className={`${styles.card} ${styles.skeleton}`}>
        <div className={styles.skeletonHeader}></div>
        <div className={styles.skeletonNumbers}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={styles.skeletonCircle}></div>
          ))}
        </div>
        <div className={styles.skeletonPrize}></div>
      </div>
    </div>
  );
};

export default SkeletonRoundCard;
