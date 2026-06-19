import styles from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={styles.banterLoader}>
      <div className={styles.banterLoaderBox}></div>
      <div className={styles.banterLoaderBox}></div>
      <div className={styles.banterLoaderBox}></div>
      <div className={styles.banterLoaderBox}></div>
      <div className={styles.banterLoaderBox}></div>
      <div className={styles.banterLoaderBox}></div>
      <div className={styles.banterLoaderBox}></div>
      <div className={styles.banterLoaderBox}></div>
      <div className={styles.banterLoaderBox}></div>
    </div>
  );
}
