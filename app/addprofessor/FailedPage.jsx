import Link from "next/link";
import { useEffect } from "react";
import styles from "./SuccessPage.module.css";

const FailedPage = ({ message }) => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Failed!</h1>
        <p className={styles.message}>
          {message ||
            "Oops! An error occurred while processing your request to add a professor. Please try again later. Thank you for your patience!"}
        </p>
        <Link href="/" className={styles.button}>
          Go back to home page
        </Link>
      </div>
    </div>
  );
};

export default FailedPage;
