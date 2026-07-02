"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeader from "../components/components/shared/SectionHeader";
import styles from "./UniversityPage.module.css";
import Image from "next/image";

const filters = ["All", "Public", "Private", "Deemed"];

const MotionLink = motion(Link);

function UniCard({ uni, index }) {
  const location = [uni?.state || uni?.city, uni?.country]
    .filter(Boolean)
    .join(", ");

  return (
    <MotionLink
      href={`/university/${uni?.slug}`}
      className={styles.uniCard}
      style={{ "--uni-color": uni?.color }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className={styles.cardGlow} />
      <div className={styles.cardTop}>
        <Image
          src={uni?.image}
          alt={uni?.name}
          className={styles.uniImg}
          width={64}
          height={64}
        />
        {uni?.rating && (
          <div className={styles.uniRatingBadge}>
            <span className={styles.uniRatingNum}>{uni?.rating}</span>
            <span className={styles.uniRatingStar}>★</span>
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.uniName}>{uni?.name}</h3>
        <p className={styles.uniLocation}>{location && `📍 ${location}`}</p>
        <p className={styles.uniDesc}>
          {uni?.description?.slice(0, 60) + "..."}
        </p>
      </div>
      {/* <div className={styles.cardStats}>
        <div className={styles.statItem}>
          <span className={styles.statVal}>
            {uni?.professors ? uni?.totalProfessors?.toLocaleString() : "NA"}
          </span>
          <span className={styles.statLbl}>Professors</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statVal}>
            {uni?.reviews ? uni?.reviews?.toLocaleString() : "NA"}
          </span>
          <span className={styles.statLbl}>Reviews</span>
        </div>
        <div className={styles.statDivider} />
        {uni?.naacGrade && (
          <div className={styles.statItem}>
            <span className={styles.statVal}>{uni?.naacGrade}</span>
            <span className={styles.statLbl}>NAAC</span>
          </div>
        )}
      </div> */}
      <div className={styles.cardMeta}>
        <span className={styles.typeBadge}>{uni?.universityType}</span>
        {uni?.nirfRank && (
          <span className={styles.nirfBadge}>NIRF #{uni?.nirfRank}</span>
        )}
      </div>
    </MotionLink>
  );
}

export default function UniversitiesPage({ universities }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [visible, setVisible] = useState(8);

  const filtered = useMemo(() => {
    let list = [...universities];
    if (query.trim()) {
      const q = query?.toLowerCase();
      list = list.filter(
        (u) =>
          u?.name?.toLowerCase().includes(q) ||
          u?.abbreviation?.toLowerCase().includes(q) ||
          u?.state?.toLowerCase().includes(q) ||
          u?.country?.toLowerCase().includes(q),
      );
    }
    if (activeFilter !== "All") {
      if (activeFilter === "IIT")
        list = list.filter((u) => u?.name?.includes("IIT"));
      else
        list = list.filter((u) =>
          u?.universityType?.toLowerCase().includes(activeFilter.toLowerCase()),
        );
    }
    return list;
  }, [query, activeFilter]);

  const trending = [...universities]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 3);

  const MotionLink = motion(Link);

  return (
    <>
      {/* Hero */}
      <section className={`${styles.hero} sub-container page-top`}>
        <div className={styles.heroBg} />
        <div className={styles.heroInner}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader
              eyebrow="Browse Universities"
              title="Find Your University"
              subtitle="Explore professor ratings and honest student reviews from World's top institutions."
            />
          </motion.div>
          <motion.div
            className={styles.searchWrap}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--text-muted)", flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or location…"
              className={styles.searchInput}
            />
          </motion.div>
          <motion.div
            className={styles.filterChips}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filters.map((f) => (
              <button
                key={f}
                className={`${styles.chip} ${activeFilter === f ? styles.chipActive : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trending */}
      {query.length === 0 && activeFilter == "All" && (
        <section className={`${styles.trendingSection} sub-container`}>
          <div className={styles.container}>
            <h2 className={styles.sectionLabel}>🔥 Trending This Week</h2>
            <div className={styles.trendingGrid}>
              {trending.map((uni, i) => (
                <MotionLink
                  key={uni?.slug}
                  href={`/university/${uni?.slug}`}
                  className={styles.trendCard}
                  style={{ "--uni-color": uni.color }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className={styles.trendRank}>#{i + 1}</div>
                  <div className={styles.trendLogo}>
                    <img
                      src={uni?.image}
                      alt={uni?.name}
                      className={styles.trendImg}
                    />
                  </div>
                  <div className={styles.trendInfo}>
                    <p className={styles.trendName}>{uni?.name}</p>
                    {uni?.reviews && (
                      <p className={styles.trendMeta}>
                        {uni?.reviews?.toLocaleString()} reviews · {uni?.rating}
                        ★
                      </p>
                    )}
                  </div>
                  <span className={styles.trendArrow}>→</span>
                </MotionLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className={`${styles.gridSection} sub-container`}>
        <div className={styles.container}>
          <div className={styles.gridHeader}>
            {/* <p className={styles.gridCount}>
              <strong>{filtered.length}</strong> universities found
            </p> */}
          </div>
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <span>🏛️</span>
              <h3>No universities found</h3>
              <p>Try adjusting your search or filter.</p>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {filtered.slice(0, visible).map((uni, i) => (
                  <UniCard key={uni?.slug} uni={uni} index={i} />
                ))}
              </div>
              {visible < filtered.length && (
                <div className={styles.loadMore}>
                  <button
                    className={styles.loadMoreBtn}
                    onClick={() => setVisible((v) => v + 8)}
                  >
                    Load More Universities
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
