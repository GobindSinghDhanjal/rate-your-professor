import styles from "./StarRating.module.css";

export default function StarRating({
  rating,
  size = "md",
  showNumber = false,
}) {
  return (
    <div className={`${styles.stars} ${styles[size]}`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={s <= Math.round(rating) ? styles.filled : styles.empty}
        >
          ★
        </span>
      ))}
      {showNumber && <span className={styles.num}>{rating}</span>}
    </div>
  );
}
