'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './CtaSection.module.css';

export default function CtaSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.gridLines} />

      <div className={styles.container}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.innerGlow} />
          <span className={styles.eyebrow}>Join 10,000+ Students</span>
          <h2 className={styles.title}>
            Help Students Make Better<br />
            <span className={styles.gradientText}>Academic Decisions</span>
          </h2>
          <p className={styles.subtitle}>
            Rate your professors, share your experiences, and guide the next generation of students. Every review makes a difference.
          </p>
          <div className={styles.actions}>
            <a href="#" className={styles.btnPrimary}>
              Start Exploring
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12 14 0M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href="#" className={styles.btnSecondary}>Write a Review</a>
          </div>

          <div className={styles.trust}>
            <span className={styles.trustItem}>🔒 100% Anonymous</span>
            <span className={styles.trustDot} />
            <span className={styles.trustItem}>⚡ Instant Access</span>
            <span className={styles.trustDot} />
            <span className={styles.trustItem}>🆓 Free Forever</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
