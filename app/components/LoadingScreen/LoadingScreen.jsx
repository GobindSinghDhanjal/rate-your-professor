import Loader from "../Loader/Loader";
import styles from "./LoadingScreen.module.css";

export default function LoadingScreen() {
  return (
    <div className={styles.loadingScreen}>
      <Loader />
    </div>
  );
}
