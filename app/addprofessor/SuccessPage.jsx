import Link from "next/link";
import { useEffect } from "react";
import styles from "./SuccessPage.module.css";

const SuccessPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Thank You!</h1>
        <p className={styles.message}>
          Your request to add a professor will be processed within 24 hours.
        </p>
        <Link href="/" className={styles.button}>
          Go back to home page
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
