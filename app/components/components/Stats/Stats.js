'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Stats.module.css';

const stats = [
  { value: 2000, suffix: '+', label: 'Professors Listed', icon: '👨‍🏫', desc: 'Across all disciplines' },
  { value: 20, suffix: '+', label: 'Universities', icon: '🏛️', desc: 'Top Indian institutions' },
  { value: 10000, suffix: '+', label: 'Student Reviews', icon: '📝', desc: 'Honest & anonymous' },
  { value: 98, suffix: '%', label: 'Growing Every Day', icon: '📈', desc: 'Month-over-month growth' },
];

function CountUp({ target, suffix, active }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, target]);

  return (
    <span className={styles.statValue}>
      {count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className={styles.stats}>
      <div className={styles.container}>
        <motion.div
          className={styles.grid}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className={styles.card}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <div className={styles.cardInner}>
                <span className={styles.icon}>{s.icon}</span>
                <CountUp target={s.value} suffix={s.suffix} active={inView} />
                <p className={styles.label}>{s.label}</p>
                <p className={styles.desc}>{s.desc}</p>
              </div>
              <div className={styles.cardGlow} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
