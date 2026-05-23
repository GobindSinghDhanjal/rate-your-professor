'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Universities.module.css';

const universities = [
  { abbr: 'DTU', name: 'Delhi Technological University', location: 'New Delhi', color: '#7c3aed', reviews: '1.8K+' },
  { abbr: 'NSUT', name: 'Netaji Subhas University of Technology', location: 'New Delhi', color: '#3b82f6', reviews: '1.2K+' },
  { abbr: 'IIT-D', name: 'IIT Delhi', location: 'New Delhi', color: '#06b6d4', reviews: '2.5K+' },
  { abbr: 'VIT', name: 'Vellore Institute of Technology', location: 'Vellore', color: '#8b5cf6', reviews: '900+' },
  { abbr: 'SRM', name: 'SRM Institute of Science & Technology', location: 'Chennai', color: '#10b981', reviews: '780+' },
  { abbr: 'AUL', name: 'Amity University', location: 'Noida', color: '#f59e0b', reviews: '650+' },
  { abbr: 'USICT', name: 'USICT, GGSIPU', location: 'New Delhi', color: '#ef4444', reviews: '540+' },
  { abbr: 'IIT-B', name: 'IIT Bombay', location: 'Mumbai', color: '#7c3aed', reviews: '2.1K+' },
  { abbr: 'NIT', name: 'NIT Trichy', location: 'Tiruchirappalli', color: '#3b82f6', reviews: '420+' },
  { abbr: 'BITS', name: 'BITS Pilani', location: 'Pilani', color: '#06b6d4', reviews: '710+' },
  { abbr: 'JNU', name: 'Jawaharlal Nehru University', location: 'New Delhi', color: '#8b5cf6', reviews: '380+' },
  { abbr: 'BHU', name: 'Banaras Hindu University', location: 'Varanasi', color: '#10b981', reviews: '290+' },
];

export default function Universities() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="universities" className={styles.section} ref={ref}>
      <div className={styles.bgAccent} />
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.eyebrow}>Universities</span>
          <h2 className={styles.title}>Top Institutions on the Platform</h2>
          <p className={styles.subtitle}>
            From IITs to private universities — find professors from India&apos;s best colleges.
          </p>
        </motion.div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
        >
          {universities.map((u) => (
            <motion.a
              key={u.abbr}
              href="#"
              className={styles.card}
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
              }}
              style={{ '--uni-color': u.color }}
            >
              <div className={styles.abbrWrap}>
                <span className={styles.abbr}>{u.abbr}</span>
              </div>
              <div className={styles.uniInfo}>
                <h3 className={styles.uniName}>{u.name}</h3>
                <p className={styles.uniLocation}>📍 {u.location}</p>
              </div>
              <div className={styles.reviewCount}>
                <span>{u.reviews}</span>
                <span className={styles.reviewLabel}>reviews</span>
              </div>
              <div className={styles.cardGlow} />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
