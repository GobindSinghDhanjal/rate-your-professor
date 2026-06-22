"use client";

import GoogleAd from "../GoogleAd/GoogleAd";
import styles from "../Shared.module.css";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
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
            Privacy Policy
          </motion.span>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your privacy <span className={styles.gradient}>matters.</span>
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Learn how RateYourProfessor collects, uses, and protects information
            while providing anonymous professor reviews.
          </motion.p>
        </div>
      </section>

      <section className={`${styles.about} sub-container`}>
        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Last Updated</h3>
          <p className={styles.lead}>June 22, 2026</p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Introduction</h3>
          <p className={styles.lead}>
            Welcome to RateYourProfessor ("we", "our", or "us"). We value your
            privacy and are committed to protecting it. This Privacy Policy
            explains what information may be collected when you use our website
            and how that information is used.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Anonymous Reviews</h3>
          <p className={styles.lead}>
            RateYourProfessor allows users to submit reviews and ratings without
            creating an account or signing up. Reviews are publicly visible, and
            users are responsible for the information they submit. Please avoid
            sharing personal or sensitive information.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Information We Collect</h3>

          <h4>Information You Voluntarily Provide</h4>
          <p className={styles.lead}>
            We may receive ratings, review content, emails, and messages you
            voluntarily send to us.
          </p>

          <h4>Automatically Collected Information</h4>
          <p className={styles.lead}>
            Hosting providers, analytics tools, and third-party services may
            collect technical information such as browser type, device
            information, pages visited, and general usage statistics to improve
            website performance and user experience.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Analytics</h3>
          <p className={styles.lead}>
            We may use Google Analytics or similar services to understand how
            visitors use our website. These services may use cookies or similar
            technologies to collect anonymous usage information.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Cookies</h3>
          <p className={styles.lead}>
            RateYourProfessor does not use cookies for accounts or
            authentication. However, third-party services such as Google
            Analytics and advertising providers may use cookies to analyze
            traffic, improve user experience, and deliver advertisements.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Advertising</h3>
          <p className={styles.lead}>
            We may display advertisements through Google AdSense or other
            advertising partners. Third-party vendors, including Google, may use
            cookies to serve personalized or non-personalized ads based on
            users' browsing activity.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Public Content Disclaimer</h3>
          <p className={styles.lead}>
            All ratings, reviews, and comments are submitted by users.
            RateYourProfessor does not verify or guarantee the accuracy,
            completeness, or reliability of user-submitted content. Opinions
            expressed by users are solely their own.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Content Removal Requests</h3>
          <p className={styles.lead}>
            If you believe content published on RateYourProfessor is inaccurate,
            inappropriate, defamatory, or violates your rights, you may contact
            us to request a review or removal. We reserve the right to remove
            content at our discretion.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Third-Party Links</h3>
          <p className={styles.lead}>
            Our website may contain links to external websites. We are not
            responsible for the content or privacy practices of those websites.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Children's Privacy</h3>
          <p className={styles.lead}>
            RateYourProfessor is not directed toward children under 13, and we
            do not knowingly collect personal information from children.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Data Security</h3>
          <p className={styles.lead}>
            We take reasonable measures to protect the website and information
            we receive. However, no method of transmission or storage is
            completely secure, and we cannot guarantee absolute security.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>
            Changes to This Privacy Policy
          </h3>
          <p className={styles.lead}>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated date. Continued use of
            the website constitutes acceptance of the revised policy.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Contact Us</h3>
          <p className={styles.lead}>
            If you have questions, concerns, or content removal requests, please
            contact us at:
          </p>

          <p className={styles.lead}>
            <strong>Email:</strong> rateyourprofessor.in@gmail.com
          </p>
        </div>

        <div className={styles.cta}>
          <h3>Disclaimer</h3>
          <p>
            RateYourProfessor provides information based on user-submitted
            content. We do not guarantee the accuracy, reliability, or
            completeness of ratings, comments, or other content available on
            this website. Users are advised to exercise independent judgment and
            use the information provided at their own risk.
          </p>
        </div>

        <GoogleAd />
      </section>
    </>
  );
}
