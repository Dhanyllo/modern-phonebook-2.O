import styles from "./SkeletonContactCard.module.css";

function SkeletonContactCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonAvatar} />
      <div className={styles.skeletonLineWrap}>
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLineShort} />
        <div className={styles.skeletonLineShorter} />
      </div>
    </div>
  );
}

export default SkeletonContactCard;
