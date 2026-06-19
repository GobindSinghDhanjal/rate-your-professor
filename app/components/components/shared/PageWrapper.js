
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import styles from "./PageWrapper.module.css";

export default function PageWrapper({ children, noFooter = false }) {
  return (
    <>
      <Navbar />
      <main className={styles.main}>{children}</main>
      {!noFooter && <Footer />}
    </>
  );
}
