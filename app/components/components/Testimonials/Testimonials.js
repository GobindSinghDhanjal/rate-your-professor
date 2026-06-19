'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    id: 1,
    name: 'Arjun Mehta',
    year: 'B.Tech 3rd Year, CSE',
    university: 'DTU, Delhi',
    avatar: 'AM',
    avatarBg: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
    rating: 5,
    text: 'RateYourProfessor completely changed how I choose electives. I checked ratings before registering and ended up with the best sem of my life. The anonymous reviews are so honest!',
  },
  {
    id: 2,
    name: 'Sneha Kapoor',
    year: 'M.Tech 1st Year, ECE',
    university: 'IIT Delhi',
    avatar: 'SK',
    avatarBg: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
    rating: 5,
    text: "As a postgrad student, finding the right research supervisor is critical. This platform helped me shortlist professors based on real student feedback. 10/10 would recommend to every student.",
  },
  {
    id: 3,
    name: 'Rahul Tiwari',
    year: 'B.Tech Final Year, IT',
    university: 'NSUT, Delhi',
    avatar: 'RT',
    avatarBg: 'linear-gradient(135deg, #10b981, #3b82f6)',
    rating: 4,
    text: 'Finally a platform that gives students a real voice. The search UI is super clean and I found detailed reviews for all my department professors. This should be an official tool for every college.',
  },
  {
    id: 4,
    name: 'Priyanka Nair',
    year: 'B.Sc 2nd Year, Physics',
    university: 'Amity University, Noida',
    avatar: 'PN',
    avatarBg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    rating: 5,
    text: "I was nervous about my professors before starting college. The honest reviews here helped me prepare mentally and academically. The community here genuinely cares about each other's academic success.",
  },
  {
    id: 5,
    name: 'Karan Bhatt',
    year: 'MBA 1st Year',
    university: 'VIT Vellore',
    avatar: 'KB',
    avatarBg: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
    rating: 5,
    text: 'The university-wise filtering is brilliant. I could see all professors in the management department and compare them side by side. Helped me plan my academic journey from day one.',
  },
  {
    id: 6,
    name: 'Divya Sharma',
    year: 'B.Tech 4th Year, Mech',
    university: 'SRM Chennai',
    avatar: 'DS',
    avatarBg: 'linear-gradient(135deg, #ef4444, #8b5cf6)',
    rating: 5,
    text: "Simple, clean, and brutally honest. I've been using it for 2 years now and it has never steered me wrong. The rating system is fair and the reviews feel genuinely written by real students.",
  },
];

function StarRow({ rating }) {
  return (
    <div className={styles.stars}>
      {[1,2,3,4,5].map((s) => (
        <span key={s} style={{ color: s <= rating ? '#f59e0b' : 'var(--text-muted)' }}>★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const col1 = testimonials.slice(0, 2);
  const col2 = testimonials.slice(2, 4);
  const col3 = testimonials.slice(4, 6);

  return (
    <section id="testimonials" className="section" ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.eyebrow}>Student Stories</span>
          <h2 className={styles.title}>Loved by Students Across India</h2>
          <p className={styles.subtitle}>
            Join thousands of students who make smarter academic decisions every day.
          </p>
        </motion.div>

        <motion.div
          className={styles.columns}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
        >
          {[col1, col2, col3].map((col, ci) => (
            <div key={ci} className={styles.col}>
              {col.map((t) => (
                <motion.div
                  key={t.id}
                  className={styles.card}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  <div className={styles.quoteIcon}>"</div>
                  <p className={styles.text}>{t.text}</p>
                  <StarRow rating={t.rating} />
                  <div className={styles.author}>
                    <div className={styles.avatar} style={{ background: t.avatarBg }}>{t.avatar}</div>
                    <div>
                      <p className={styles.authorName}>{t.name}</p>
                      <p className={styles.authorMeta}>{t.year}</p>
                      <p className={styles.authorUni}>🏛 {t.university}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
