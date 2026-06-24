"use client";

import styles from "../Shared.module.css";
import { motion } from "framer-motion";

export default function CommunityGuidelines() {
  return (
    <>
      <section className={`${styles.searchHero} sub-container  page-top`}>
        <div className={styles.heroBlob} />
        <div className={styles.heroInner}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Community Guidelines
          </motion.span>

          <motion.h1 className={styles.heroTitle}>
            Keep reviews honest and{" "}
            <span className={styles.gradient}>respectful.</span>
          </motion.h1>

          <motion.p className={styles.heroSub}>
            Our goal is to maintain a helpful and constructive environment for
            students and educators alike.
          </motion.p>
        </div>
      </section>

      <section className={`${styles.about} sub-container`}>
        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Write Honest Reviews</h3>
          <p className={styles.lead}>
            Share genuine experiences and provide constructive feedback that
            helps future students make informed decisions.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Be Respectful</h3>
          <p className={styles.lead}>
            Criticism is welcome, but harassment, insults, hate speech, and
            personal attacks are not.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Protect Privacy</h3>
          <p className={styles.lead}>
            Do not include phone numbers, email addresses, home addresses, or
            any personal information about yourself or others.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Avoid False Information</h3>
          <p className={styles.lead}>
            Reviews should be based on real experiences and should not contain
            intentionally misleading or fabricated statements.
          </p>
        </div>

        <div className={styles.cta}>
          <h3>Help Build a Better Community</h3>
          <p>
            Respectful and honest reviews help students and educators alike and
            contribute to a healthier academic environment.
          </p>
        </div>
      </section>
    </>
  );
}
