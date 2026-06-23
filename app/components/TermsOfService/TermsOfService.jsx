"use client";

import styles from "../Shared.module.css";
import { motion } from "framer-motion";

export default function TermsOfService() {
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
            Terms of Use
          </motion.span>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Use RateYourProfessor{" "}
            <span className={styles.gradient}>responsibly.</span>
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            These Terms of Service govern your use of RateYourProfessor and
            establish guidelines for contributing and accessing content.
          </motion.p>
        </div>
      </section>

      <section className={`${styles.about} sub-container`}>
        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Acceptance of Terms</h3>
          <p className={styles.lead}>
            By accessing or using RateYourProfessor, you agree to these Terms of
            Service. If you do not agree with these terms, please do not use the
            website.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>User-Generated Content</h3>
          <p className={styles.lead}>
            Reviews and ratings submitted to RateYourProfessor are provided by
            users. Users are solely responsible for the content they submit and
            must ensure that their contributions are truthful, respectful, and
            based on genuine experiences.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Prohibited Content</h3>
          <p className={styles.lead}>
            Users may not submit content that:
            <br />
            • Contains harassment, threats, or hate speech.
            <br />
            • Includes personal or confidential information.
            <br />
            • Is defamatory, misleading, or intentionally false.
            <br />
            • Violates applicable laws or regulations.
            <br />• Contains spam, advertisements, or malicious content.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Content Moderation</h3>
          <p className={styles.lead}>
            We reserve the right to review, edit, restrict, or remove content
            that violates these Terms or that we believe may harm the integrity
            of the platform.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Accuracy of Information</h3>
          <p className={styles.lead}>
            RateYourProfessor does not guarantee the accuracy, completeness, or
            reliability of reviews, ratings, or any information available on the
            platform. Content represents the opinions of individual users.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Intellectual Property</h3>
          <p className={styles.lead}>
            The design, branding, and content of RateYourProfessor are protected
            by applicable intellectual property laws. Unauthorized copying or
            misuse of website content may violate those laws.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Third-Party Services</h3>
          <p className={styles.lead}>
            The website may contain advertisements or links to third-party
            services. We are not responsible for the content, privacy practices,
            or policies of external websites.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Limitation of Liability</h3>
          <p className={styles.lead}>
            RateYourProfessor and its operators shall not be liable for any
            damages, losses, or consequences arising from the use of the website
            or reliance upon user-submitted information.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Changes to These Terms</h3>
          <p className={styles.lead}>
            We may update these Terms of Service from time to time. Continued
            use of the website after changes are posted constitutes acceptance
            of the revised Terms.
          </p>
        </div>

        <div className={styles.cta}>
          <h3>Contact Us</h3>
          <p>
            Questions regarding these Terms of Service may be sent to:
            <br />
            <strong>rateyourprofessor.in@gmail.com</strong>
          </p>
        </div>
      </section>
    </>
  );
}
