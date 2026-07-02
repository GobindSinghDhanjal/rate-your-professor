"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./Testimonials.module.css";
const testimonials = [
  {
    id: 1,
    name: "Anonymous Student",
    year: "B.Sc 2nd Year, Computer Science",
    university: "University of Toronto, Canada",
    avatar: "AS",
    avatarBg: "linear-gradient(135deg, #7c3aed, #3b82f6)",
    rating: 5,
    text: "I found this platform while looking up one of my professors before course enrollment. The reviews matched my experience almost perfectly and helped me make much better decisions for the semester.",
  },
  {
    id: 2,
    name: "Anonymous Student",
    year: "M.Sc 1st Year, Data Science",
    university: "National University of Singapore",
    avatar: "AS",
    avatarBg: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
    rating: 5,
    text: "The anonymous feedback gave me insights that course descriptions never could. It was especially useful for understanding teaching style, workload, and how approachable professors are outside class.",
  },
  {
    id: 3,
    name: "Anonymous Student",
    year: "B.Eng 3rd Year, Mechanical Engineering",
    university: "University of Manchester, United Kingdom",
    avatar: "AS",
    avatarBg: "linear-gradient(135deg, #10b981, #3b82f6)",
    rating: 4,
    text: "I appreciate that reviews focus on actual classroom experiences instead of popularity. Reading feedback from previous students helped me choose modules that suited my learning style.",
  },
  {
    id: 4,
    name: "Anonymous Student",
    year: "B.A. 2nd Year, Economics",
    university: "University of Melbourne, Australia",
    avatar: "AS",
    avatarBg: "linear-gradient(135deg, #f59e0b, #ef4444)",
    rating: 5,
    text: "As an international student, I didn't know what to expect from different lecturers. This platform made the transition much easier by giving honest perspectives from students who had already taken the courses.",
  },
  {
    id: 5,
    name: "Anonymous Student",
    year: "M.A. 1st Year, International Relations",
    university: "Sciences Po, France",
    avatar: "AS",
    avatarBg: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
    rating: 5,
    text: "The interface is easy to use and the reviews are surprisingly detailed. I now check professor ratings before every registration period, and it has helped me avoid a few difficult surprises.",
  },
  {
    id: 6,
    name: "Anonymous Student",
    year: "B.Sc 4th Year, Mathematics",
    university: "ETH Zurich, Switzerland",
    avatar: "AS",
    avatarBg: "linear-gradient(135deg, #ef4444, #8b5cf6)",
    rating: 5,
    text: "It's refreshing to see a platform where students can share constructive feedback anonymously. I contributed my own reviews after realizing how valuable previous students' experiences were to me.",
  },
];

function StarRow({ rating }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{ color: s <= rating ? "#f59e0b" : "var(--text-muted)" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

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
          <h2 className={styles.title}>Loved by Students Across Asia</h2>
          <p className={styles.subtitle}>
            Join thousands of students who make smarter academic decisions every
            day.
          </p>
        </motion.div>

        <motion.div
          className={styles.columns}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
        >
          {[col1, col2, col3].map((col, ci) => (
            <div key={ci} className={styles.col}>
              {col.map((t) => (
                <motion.div
                  key={t.id}
                  className={styles.card}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
                  <div className={styles.quoteIcon}>"</div>
                  <p className={styles.text}>{t.text}</p>
                  <StarRow rating={t.rating} />
                  <div className={styles.author}>
                    <div
                      className={styles.avatar}
                      style={{ background: t.avatarBg }}
                    >
                      {t.avatar}
                    </div>
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
