"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import styles from "./Universities.module.css";
import Image from "next/image";
import Link from "next/link";

// const universities = [
//   {
//     abbr: "DTU",
//     name: "Delhi Technological University",
//     location: "New Delhi",
//     color: "#7c3aed",
//     reviews: "1.8K+",
//   },
//   {
//     abbr: "NSUT",
//     name: "Netaji Subhas University of Technology",
//     location: "New Delhi",
//     color: "#3b82f6",
//     reviews: "1.2K+",
//   },
//   {
//     abbr: "IIT-D",
//     name: "IIT Delhi",
//     location: "New Delhi",
//     color: "#06b6d4",
//     reviews: "2.5K+",
//   },
//   {
//     abbr: "VIT",
//     name: "Vellore Institute of Technology",
//     location: "Vellore",
//     color: "#8b5cf6",
//     reviews: "900+",
//   },
//   {
//     abbr: "SRM",
//     name: "SRM Institute of Science & Technology",
//     location: "Chennai",
//     color: "#10b981",
//     reviews: "780+",
//   },
//   {
//     abbr: "AUL",
//     name: "Amity University",
//     location: "Noida",
//     color: "#f59e0b",
//     reviews: "650+",
//   },
//   {
//     abbr: "USICT",
//     name: "USICT, GGSIPU",
//     location: "New Delhi",
//     color: "#ef4444",
//     reviews: "540+",
//   },
//   {
//     abbr: "IIT-B",
//     name: "IIT Bombay",
//     location: "Mumbai",
//     color: "#7c3aed",
//     reviews: "2.1K+",
//   },
//   {
//     abbr: "NIT",
//     name: "NIT Trichy",
//     location: "Tiruchirappalli",
//     color: "#3b82f6",
//     reviews: "420+",
//   },
//   {
//     abbr: "BITS",
//     name: "BITS Pilani",
//     location: "Pilani",
//     color: "#06b6d4",
//     reviews: "710+",
//   },
//   {
//     abbr: "JNU",
//     name: "Jawaharlal Nehru University",
//     location: "New Delhi",
//     color: "#8b5cf6",
//     reviews: "380+",
//   },
//   {
//     abbr: "BHU",
//     name: "Banaras Hindu University",
//     location: "Varanasi",
//     color: "#10b981",
//     reviews: "290+",
//   },
// ];

export default function Universities() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/universities/top`,
          {
            next: { revalidate: 2592000 }, // revalidate every 30 days (in seconds)
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch universities");
        }
        const data = await response.json();
        setUniversities(data);
        // console.log("Fetched universities:", data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  return (
    <section id="universities" className="section" ref={ref}>
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
            From IITs to private universities — find professors from
            India&apos;s best colleges.
          </p>
        </motion.div>

        <motion.div
          className={styles.flex}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: { staggerChildren: 0.06, delayChildren: 0.1 },
            },
          }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className={`${styles.card} ${styles.skeletonCard}`}
                ></div>
              ))
            : universities.map((university) => (
                <Link
                  key={university.slug}
                  className="plain-link"
                  href={`/university/${university.slug}`}
                >
                  <motion
                    key={university.slug}
                    className={styles.card}
                    variants={{
                      hidden: { opacity: 0, scale: 0.95 },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    style={{ "--uni-color": university?.color || "#7c3aed" }}
                  >
                    <div className={styles.abbrWrap}>
                      <img
                        src={university?.image}
                        alt={university?.name}
                        className={styles.uniLogo}
                      />
                      {/* <span className={styles.abbr}>
                      {university?.abbreviation}
                    </span> */}
                    </div>
                    <div className={styles.uniInfo}>
                      <h3 className={styles.uniName}>{university?.name}</h3>
                      <p className={styles.uniLocation}>
                        📍 {university?.state}, {university?.country}
                      </p>
                    </div>
                    {/* <div className={styles.reviewCount}>
                      <span>
                        {university.reviews ??
                          Math.floor(Math.random() * 401) + 100}
                      </span>
                      <span className={styles.reviewLabel}>reviews</span>
                    </div> */}
                    <div className={styles.cardGlow} />
                  </motion>
                </Link>
              ))}
        </motion.div>
      </div>
    </section>
  );
}
