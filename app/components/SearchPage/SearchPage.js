"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./SearchPage.module.css";
import { ProfessorAverageRating } from "@/app/utils/ProfessorAverageRating";
import Loader from "../Loader/Loader";

const departments = [
  "All",
  "Computer Science",
  "Electronics & Communication",
  "Mathematics",
  "Mechanical Engineering",
  "Management Studies",
  "Information Technology",
  "Physics",
];
const sortOptions = [
  { value: "rating-desc", label: "Highest Rated" },
  { value: "rating-asc", label: "Lowest Rated" },
  { value: "reviews-desc", label: "Most Reviews" },
  { value: "name-asc", label: "Name A–Z" },
];

function StarRow({ rating }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            color: s <= Math.round(rating) ? "#f59e0b" : "var(--text-muted)",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function RatingBar({ label, value }) {
  return (
    <div className={styles.ratingBarRow}>
      <span className={styles.ratingBarLabel}>{label}</span>
      <div className={styles.ratingBarTrack}>
        <div
          className={styles.ratingBarFill}
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className={styles.ratingBarVal}>{value}</span>
    </div>
  );
}

function ProfCard({ prof, index }) {
  const profReviews = [
    {
      text: '"Absolutely brilliant professor. Changed the way I think."',
      author: "Arjun M.",
    },
    { text: '"Best in the department. Highly recommend."', author: "Sneha K." },
    { text: '"Tough but fair. You\'ll learn a lot."', author: "Rahul T." },
  ];
  const snippet = profReviews[index % 3];

  const { averageRating, numberOfRatings } = ProfessorAverageRating(prof);

  return (
    <motion.a
      href={`/professor/${prof?._id}`}
      className={styles.profCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className={styles.profCardLeft}>
        <div className={styles.avatar} style={{ background: prof?.avatarBg }}>
          <img
            src={prof?.image}
            alt={prof?.name}
            className={styles.profAvatar}
          />
        </div>
      </div>

      <div className={styles.profCardBody}>
        <div className={styles.profCardTop}>
          <div>
            <h3 className={styles.profName}>{prof?.name}</h3>
            <p className={styles.profTitle}>
              {prof?.title} · {prof?.college?.name}
            </p>
            <p className={styles.profUni}>
              🏛 {prof?.college?.university?.name}
            </p>
          </div>
          <div className={styles.profCardRating}>
            <span className={styles.bigRating}>{averageRating}</span>
            <StarRow rating={averageRating} />
            <span className={styles.reviewCount}>
              {numberOfRatings} reviews
            </span>
          </div>
        </div>

        <div className={styles.ratingBars}>
          <RatingBar label="Clarity" value={prof?.ratingBreakdown?.clarity} />
          <RatingBar
            label="Helpful"
            value={prof?.ratingBreakdown?.helpfulness}
          />
        </div>

        <div className={styles.profCardBottom}>
          <div className={styles.tags}>
            {prof?.tags?.slice(0, 3).map((t) => (
              <span key={t} className={styles.tag}>
                {t}
              </span>
            ))}
          </div>
          <div className={styles.metaRow}>
            {prof?.wouldTakeAgain && (
              <>
                <span className={styles.metaItem}>
                  <span className={styles.metaGreen}>
                    {prof?.wouldTakeAgain}%
                  </span>{" "}
                  would take again
                </span>
                <span className={styles.metaSep}>·</span>
              </>
            )}

            <span className={styles.metaItem}>
              Difficulty:{" "}
              <strong>
                {prof?.difficultyLevel ? prof?.difficultyLevel + "/5" : "NA"}
              </strong>
            </span>
          </div>
        </div>

        {/* <p className={styles.snippet}>
          {snippet.text} — <em>{snippet.author}</em>
        </p> */}
      </div>

      <div className={styles.profCardArrow}>→</div>
    </motion.a>
  );
}

export default function SearchPage({ universities }) {
  const [query, setQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedUni, setSelectedUni] = useState("All");
  const [sortBy, setSortBy] = useState("rating-desc");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setProfessors(data || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Error fetching professors");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...professors];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p?.name?.toLowerCase().includes(q) ||
          p?.dept?.toLowerCase().includes(q) ||
          p?.college?.name?.toLowerCase().includes(q) ||
          p?.college?.university?.name?.toLowerCase().includes(q) ||
          p?.courses?.some((c) => c?.toLowerCase()?.includes(q)),
      );
    }
    if (selectedDept !== "All")
      list = list.filter((p) => p.dept === selectedDept);
    if (selectedUni !== "All")
      list = list.filter((p) => p?.college?.university?._id === selectedUni);
    list.sort((a, b) => {
      if (sortBy === "rating-desc") return b.rating - a.rating;
      if (sortBy === "rating-asc") return a.rating - b.rating;
      if (sortBy === "reviews-desc") return b.totalReviews - a.totalReviews;
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return 0;
    });
    return list;
  }, [query, selectedDept, selectedUni, sortBy, professors]);

  return (
    <>
      {/* <Navbar /> */}
      <main className={styles.main}>
        {/* Hero search bar */}
        <section className={styles.searchHero}>
          <div className={styles.heroBlob} />
          <div className={styles.heroInner}>
            <motion.h1
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Find Your Professor
            </motion.h1>
            <motion.p
              className={styles.heroSub}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Search by name, department, university or course
            </motion.p>

            <motion.div
              className={styles.searchBarWrap}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <svg
                className={styles.searchIcon}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search professors, departments, courses..."
                className={styles.searchInput}
              />
              {query && (
                <button
                  className={styles.clearBtn}
                  onClick={() => setQuery("")}
                >
                  ✕
                </button>
              )}
            </motion.div>
          </div>
        </section>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.sidebar}>
            <div className={styles.filterBlock}>
              <h3 className={styles.filterTitle}>University</h3>
              <div className={styles.filterOptions}>
                <button
                  className={`${styles.filterOpt} ${selectedUni === "All" ? styles.filterActive : ""}`}
                  onClick={() => setSelectedUni("All")}
                >
                  All Universities
                </button>
                {universities.map((u) => (
                  <button
                    key={u?._id}
                    className={`${styles.filterOpt} ${selectedUni === u?._id ? styles.filterActive : ""}`}
                    onClick={() => setSelectedUni(u?._id)}
                  >
                    {u?.name}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterBlock}>
              <h3 className={styles.filterTitle}>Department</h3>
              <div className={styles.filterOptions}>
                {departments.map((d) => (
                  <button
                    key={d}
                    className={`${styles.filterOpt} ${selectedDept === d ? styles.filterActive : ""}`}
                    onClick={() => setSelectedDept(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.results}>
            <div className={styles.resultsHeader}>
              <p className={styles.resultsCount}>
                <strong>{filtered.length}</strong> professor
                {filtered.length !== 1 ? "s" : ""} found
              </p>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className={styles.loaderWrap}>
                <Loader />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                  <motion.div
                    key="empty"
                    className={styles.empty}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className={styles.emptyIcon}>🔍</span>
                    <h3>No professors found</h3>
                    <p>Try a different search term or adjust your filters.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    className={styles.list}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {filtered.map((prof, i) => (
                      <ProfCard key={prof?._id} prof={prof} index={i} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}
