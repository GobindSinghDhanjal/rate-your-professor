"use client";

import GoogleAd from "../GoogleAd/GoogleAd";
import styles from "./About.module.css";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Star,
  Users,
  PenLine,
  Search,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Anonymous Reviews",
    desc: "Submit reviews without login or signup. Your privacy is our priority.",
  },
  {
    icon: Star,
    title: "Comprehensive Ratings",
    desc: "Rate teaching style, communication, and overall effectiveness.",
  },
  {
    icon: Users,
    title: "Unbiased Insights",
    desc: "Diverse perspectives give you a complete view of each professor.",
  },
];

const steps = [
  {
    icon: PenLine,
    title: "Submit Your Review",
    desc: "Share your experience anonymously to help fellow students.",
  },
  {
    icon: Search,
    title: "Explore Ratings",
    desc: "Discover insights from peers before selecting your courses.",
  },
  {
    icon: Sparkles,
    title: "Promote Accountability",
    desc: "Your feedback encourages educators to keep improving.",
  },
];

const values = [
  {
    title: "Transparency",
    desc: "Open and honest feedback helps students and educators grow together.",
  },
  {
    title: "Privacy",
    desc: "Reviews are anonymous and do not require creating an account.",
  },
  {
    title: "Community",
    desc: "Built by students and strengthened by shared experiences.",
  },
  {
    title: "Respect",
    desc: "Constructive criticism and respectful discussions are encouraged.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

export default function About() {
  return (
    <>
      <section className={`${styles.searchHero} sub-container page-top`}>
        <div className={styles.heroBlob} />
        <div className={styles.heroInner}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About RateYourProfessor
          </motion.span>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Honest reviews.{" "}
            <span className={styles.gradient}>Better classes.</span>
          </motion.h1>
          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            A student-first platform to share anonymous, unfiltered insights
            about professors — no login, no signup. Just real experiences that
            help you choose with confidence.
          </motion.p>
        </div>
      </section>

      <section className={`${styles.about} sub-container`}>
        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>Our Vision</h3>
          <p className={styles.lead}>
            We're building a community-driven platform that promotes
            transparency and open communication between students and educators —
            because honest feedback creates better learning environments.
          </p>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>What makes it different</h3>
          <div className={styles.cardGrid}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className={styles.card}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                custom={i}
              >
                <div className={styles.iconChip}>
                  <f.icon size={20} strokeWidth={2} />
                </div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className={styles.block}>
          <h3 className={styles.sectionTitle}>How it works</h3>
          <div className={styles.steps}>
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                className={styles.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                custom={i}
              >
                <div className={styles.stepNum}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className={styles.stepBody}>
                  <div className={styles.stepHead}>
                    <s.icon size={18} strokeWidth={2} />
                    <h4>{s.title}</h4>
                  </div>
                  <p>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className={styles.valuesGrid}>
          {values.map((v, i) => (
            <div key={i} className={styles.valueCard}>
              <div className={styles.valueNum}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <h3>Join the community</h3>
          <p>
            Your voice matters. Together we can make picking the right class
            easier for every student.
          </p>
        </div>

        <GoogleAd />
      </section>
    </>
  );
}
