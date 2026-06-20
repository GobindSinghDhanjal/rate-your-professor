
import { Instagram } from "@mui/icons-material";
import styles from "./Footer.module.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles["footer"]}>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Rate Your Professor</h3>
          <p>
            RateYourProfessor is your go-to platform for sharing and discovering
            professor reviews.
          </p>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: rateyourprofessor.in@gmail.com</p>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>

          <div className={styles["social-icons"]}>
            <p>Stay connected on social media:</p>

            <a
              href="https://www.instagram.com/rateyourprofessor/"
              target="_blank"
              rel="noopener noreferrer"
            >

              <Instagram className={styles["social-icon"]} />
            </a>
          </div>
        </div>
      </div>

      <hr />

      <div className="footer-bottom">
        <p className={styles["disclaimer"]}>
          NOTICE: RateYourProfessor is a platform that provides information
          based on user-submitted content. We do not guarantee the reliability
          or accuracy of the content within this site. Users are advised to use
          this information at their own risk. It is important to note that we
          are not responsible for user-submitted ratings, comments, or errors.
          We strive to maintain the integrity of our platform, but users should
          exercise discretion when relying on the information presented here.
        </p>
        <p className={styles["copyright"]}>
          © {currentYear} RateYourProfessor. All Rights Reserved
        </p>
      </div>
      <hr />
      <div className="footer-bottom">
        <p className={styles["version"]}>Version 2.0.0</p>
      </div>
    </footer>
  );
};

export default Footer;
