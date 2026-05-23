'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './SearchPreview.module.css';

const trending = ['Rajesh Kumar', 'Priya Sharma', 'DTU CSE', 'IIT Delhi Faculty', 'Amity Noida'];

const professors = [
  {
    id: 1,
    name: 'Dr. Rajesh Kumar',
    dept: 'Computer Science',
    university: 'DTU, Delhi',
    rating: 4.7,
    reviews: 312,
    tags: ['Clear Explanations', 'Helpful', 'Research-focused'],
    snippet: '"Best professor for algorithms. Explains every concept with real-world examples."',
    avatar: 'RK',
    avatarBg: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
  },
  {
    id: 2,
    name: 'Prof. Priya Sharma',
    dept: 'Electronics & Communication',
    university: 'NSUT, Delhi',
    rating: 4.5,
    reviews: 198,
    tags: ['Interactive', 'Industry Connect', 'Projects'],
    snippet: '"Extremely knowledgeable. Makes complex circuits feel simple and fun."',
    avatar: 'PS',
    avatarBg: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
  },
  {
    id: 3,
    name: 'Dr. Amit Singh',
    dept: 'Mathematics',
    university: 'IIT Delhi',
    rating: 4.9,
    reviews: 520,
    tags: ['Brilliant', 'Rigorous', 'Inspiring'],
    snippet: '"If you want to truly understand maths, attend his lectures. Life-changing."',
    avatar: 'AS',
    avatarBg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  },
];

function StarRating({ rating }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
      <span className={styles.ratingNum}>{rating}</span>
    </div>
  );
}

export default function SearchPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="search" className={styles.section} ref={ref}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.eyebrow}>Search Preview</span>
          <h2 className={styles.title}>Find Your Professor Instantly</h2>
          <p className={styles.subtitle}>
            Search by name, department, or university. Get real reviews in seconds.
          </p>
        </motion.div>

        {/* Search UI */}
        <motion.div
          className={styles.searchBox}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.searchInputRow}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search professors, departments, or universities..."
              className={styles.searchInput}
            />
            <button className={styles.searchBtn}>Search</button>
          </div>

          <div className={styles.trending}>
            <span className={styles.trendingLabel}>Trending:</span>
            <div className={styles.trendingTags}>
              {trending.map((t) => (
                <span key={t} className={styles.trendingTag}>{t}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Professor cards */}
        <motion.div
          className={styles.cards}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } } }}
        >
          {professors.map((prof) => (
            <motion.div
              key={prof.id}
              className={styles.card}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <div className={styles.cardTop}>
                <div className={styles.avatar} style={{ background: prof.avatarBg }}>
                  {prof.avatar}
                </div>
                <div className={styles.profInfo}>
                  <h3 className={styles.profName}>{prof.name}</h3>
                  <p className={styles.profDept}>{prof.dept}</p>
                  <p className={styles.profUni}>🏛 {prof.university}</p>
                </div>
                <div className={styles.ratingBadge}>
                  <span className={styles.ratingNum2}>{prof.rating}</span>
                  <span className={styles.ratingOf}>/5</span>
                </div>
              </div>

              <StarRating rating={prof.rating} />

              <p className={styles.snippet}>{prof.snippet}</p>

              <div className={styles.tags}>
                {prof.tags.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.reviewCount}>{prof.reviews} reviews</span>
                <a href="#" className={styles.viewLink}>View Profile →</a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
