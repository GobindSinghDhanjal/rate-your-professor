"use client";

import GoogleAd from "../GoogleAd/GoogleAd";
import styles from "../Shared.module.css";
import { motion } from "framer-motion";

export default function ContactUs() {
  return (
    <>
      <section className={`${styles.searchHero} sub-container`}>
        <div className={styles.heroBlob} />
        <div className={styles.heroInner}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Contact Us
          </motion.span>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            We'd love to <span className={styles.gradient}>hear from you.</span>
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Have questions, feedback, or concerns? Feel free to get in touch.
            We're always looking to improve RateYourProfessor and help our
            community.
          </motion.p>
        </div>
      </section>

      <section className={`${styles.about} sub-container`}>
        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Get In Touch</h3>
          <p className={styles.lead}>
            If you have questions about the website, need assistance, or would
            like to report an issue, we'd be happy to hear from you.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>General Inquiries</h3>
          <p className={styles.lead}>
            Questions, suggestions, feedback, or feature requests are always
            welcome.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Report Incorrect Content</h3>
          <p className={styles.lead}>
            If you believe that a rating, review, or professor information is
            inaccurate, inappropriate, or violates your rights, please contact
            us with sufficient details so we can review the matter.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Content Removal Requests</h3>
          <p className={styles.lead}>
            We take content concerns seriously. If you are a professor or an
            individual affected by content published on RateYourProfessor, you
            may request that content be reviewed or removed.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>
            Business & Partnership Inquiries
          </h3>
          <p className={styles.lead}>
            For collaborations, advertising opportunities, or other business
            matters, please contact us through the email below.
          </p>
        </div>

        <div className={styles.cta}>
          <h3>Contact Information</h3>
          <p>
            <strong>Email:</strong>
            <br />
            rateyourprofessor.in@gmail.com
          </p>
          <p style={{ marginTop: "0.25rem" }}>
            <strong>Instagram:</strong>
            <br />
            RateYourProfessor
          </p>

          <p style={{ marginTop: "1rem" }}>
            We aim to respond to inquiries as soon as reasonably possible.
          </p>
        </div>

        <GoogleAd />
      </section>
    </>
  );
}
