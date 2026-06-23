"use client";
import styles from "../Shared.module.css";
import { motion } from "framer-motion";

export default function HowItWorks() {
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
            How It Works
          </motion.span>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find better professors.{" "}
            <span className={styles.gradient}>Share better experiences.</span>
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            RateYourProfessor helps students make informed decisions through
            anonymous reviews and ratings shared by fellow students.
          </motion.p>
        </div>
      </section>

      <section className={`${styles.about} sub-container`}>
        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>1. Search for a Professor</h3>
          <p className={styles.lead}>
            Use the search bar to find professors by name or browse through
            universities. Each professor page contains ratings and reviews
            submitted by students.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>
            2. Explore Ratings and Reviews
          </h3>
          <p className={styles.lead}>
            View overall ratings and read experiences shared by other students.
            Consider multiple reviews to gain a balanced understanding of a
            professor's teaching style and course expectations.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>3. Submit Your Own Review</h3>
          <p className={styles.lead}>
            Share your experience anonymously. No account or sign-up is
            required. Honest and constructive feedback helps future students
            make informed decisions.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>4. Rate Responsibly</h3>
          <p className={styles.lead}>
            Reviews should be respectful, truthful, and based on personal
            experience. Avoid including private information, offensive language,
            or misleading content.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>5. Help Build the Community</h3>
          <p className={styles.lead}>
            Every review contributes to a more transparent academic environment.
            By sharing your experiences, you help other students choose courses
            and professors with greater confidence.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>
            Tips for Writing Helpful Reviews
          </h3>
          <p className={styles.lead}>
            • Focus on teaching quality and communication.
            <br />
            • Be constructive and respectful.
            <br />
            • Share specific experiences when possible.
            <br />
            • Avoid personal attacks or sensitive information.
            <br />• Remember that your review will be publicly visible.
          </p>
        </div>

        <div className={styles.cta}>
          <h3>Your Voice Matters</h3>
          <p>
            Honest feedback helps students make better academic decisions and
            encourages transparency within the educational community. Thank you
            for contributing to RateYourProfessor.
          </p>
        </div>
      </section>
    </>
  );
}
