"use client";

import GoogleAd from "../GoogleAd/GoogleAd";
import styles from "../Shared.module.css";
import { motion } from "framer-motion";

export default function FAQ() {
  return (
    <>
      <section className={`${styles.searchHero} sub-container page-top`}>
        <div className={styles.heroBlob} />
        <div className={styles.heroInner}>
          <motion.span className={styles.eyebrow}>
            Frequently Asked Questions
          </motion.span>

          <motion.h1 className={styles.heroTitle}>
            Got questions?
            <span className={styles.gradient}>We've got answers.</span>
          </motion.h1>

          <motion.p className={styles.heroSub}>
            Everything you need to know about RateYourProfessor.
          </motion.p>
        </div>
      </section>

      <section className={`${styles.about} sub-container`}>
        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>
            Is RateYourProfessor anonymous?
          </h3>
          <p className={styles.lead}>
            Yes. RateYourProfessor does not require users to create an account
            or sign in before submitting reviews. Reviews are intended to be
            anonymous, allowing students to share honest experiences and
            feedback freely.
          </p>
        </div>
        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Do I need to sign up?</h3>
          <p className={styles.lead}>
            No. There is no registration process or login requirement. You can
            search professors, browse reviews, and contribute your own ratings
            without creating an account.
          </p>
        </div>
        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>How do I find a professor?</h3>
          <p className={styles.lead}>
            You can use the search functionality to look up professors by name
            or browse universities available on the platform. Each professor
            page displays ratings and reviews submitted by students.
          </p>
        </div>
        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>How are ratings calculated?</h3>
          <p className={styles.lead}>
            Ratings are based on reviews submitted by users. Overall scores are
            derived from the average of available ratings. As more reviews are
            added, ratings may change over time.
          </p>
        </div>
        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Are reviews verified?</h3>
          <p className={styles.lead}>
            No. Reviews are user-submitted opinions and are not independently
            verified by RateYourProfessor. We encourage users to read multiple
            reviews and exercise their own judgment when evaluating information.
          </p>
        </div>
        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>
            Can I edit or delete my review later?
          </h3>
          <p className={styles.lead}>
            Currently, reviews are anonymous and are not linked to user
            accounts. Because of this, editing or deleting individual reviews
            after submission may not always be possible.
          </p>
        </div>
        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>
            Can professors request removal of content?
          </h3>
          <p className={styles.lead}>
            Yes. Professors or individuals who believe that content is
            inaccurate, inappropriate, defamatory, or violates their rights may
            contact us for a review. We reserve the right to remove content at
            our discretion.
          </p>
        </div>
        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>
            Is the information guaranteed to be accurate?
          </h3>
          <p className={styles.lead}>
            No. Ratings and reviews reflect the opinions and experiences of
            individual users. RateYourProfessor does not guarantee the accuracy,
            completeness, or reliability of user-submitted content.
          </p>
        </div>
        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>
            Is RateYourProfessor free to use?
          </h3>
          <p className={styles.lead}>
            Yes. RateYourProfessor is completely free. Students can search for
            professors, browse reviews, and submit their own feedback without
            paying any fees.
          </p>
        </div>
        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>
            Why are advertisements displayed?
          </h3>
          <p className={styles.lead}>
            Advertisements help support the operation and maintenance of
            RateYourProfessor, allowing the platform to remain free for
            everyone.
          </p>
        </div>
        <div className={styles.cta}>
          <h3>Still Have Questions?</h3>
          <p>
            If you have additional questions, suggestions, or content concerns,
            feel free to reach out. <br /> <br /> <strong>Email:</strong>
            rateyourprofessor.in@gmail.com
          </p>
        </div>
        <GoogleAd />
      </section>
    </>
  );
}
