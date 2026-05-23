'use client';

import { motion } from 'framer-motion';
import styles from './Hero.module.css';

const trustBadges = [
  { icon: '🔒', label: 'Anonymous Reviews' },
  { icon: '✅', label: 'Trusted by Students' },
  { icon: '💬', label: 'Real Experiences' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Animated background */}
      <div className={styles.bgGrid} />
      <div className={styles.blobPurple} />
      <div className={styles.blobBlue} />
      <div className={styles.blobCyan} />
      <div className={styles.noise} />

      <div className={styles.container}>
        {/* Trust badges */}
        <motion.div
          className={styles.badges}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          {trustBadges.map((b) => (
            <span key={b.label} className={styles.badge}>
              <span>{b.icon}</span>
              <span>{b.label}</span>
            </span>
          ))}
        </motion.div>

        {/* Heading */}
        <motion.h1
          className={styles.heading}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
        >
          India&apos;s Largest{' '}
          <span className={styles.gradientText}>Professor Rating</span>
          {' '}Platform
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className={styles.subheading}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
        >
          Discover honest and anonymous professor reviews from students across India
          and worldwide. Make smarter academic decisions.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className={styles.ctas}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
        >
          <a href="#search" className={styles.btnPrimary}>
            <span>Search Professors</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12 14 0M13 6l6 6-6 6" />
            </svg>
          </a>
          <a href="#universities" className={styles.btnSecondary}>
            <span>Explore Universities</span>
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className={styles.scrollDot} />
        </motion.div>
      </div>
    </section>
  );
}
