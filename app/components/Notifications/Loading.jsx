import styles from "./Notification.module.css";

export default function Loading() {
  return (
    <>
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className={`${styles.card} ${styles.skeletonCard}`}
        ></div>
      ))}
    </>
  );
}
