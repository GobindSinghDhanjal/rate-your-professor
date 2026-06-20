"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./SearchPage.module.css";
import { ProfessorAverageRating } from "@/app/utils/ProfessorAverageRating";
import Loader from "../Loader/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/app/hooks/use-debounce";
import { useLoader } from "../LoaderContext/LoaderContext";
import Link from "next/link";

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
  const router = useRouter();

  const { setLoadingScreen } = useLoader();

  const handleClick = () => {
    setLoadingScreen(true);
    router.push(`/professor/${prof._id}`);
  };

  return (
    <motion.div
      className={styles.profCard}
      onClick={handleClick}
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
    </motion.div>
  );
}

export default function SearchPage({ universities }) {
  // ... inside component
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setLoadingScreen } = useLoader();

  // 1. Initialize state from URL (so refreshing/sharing works)
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedDept, setSelectedDept] = useState(
    searchParams.get("dept") || "All",
  );
  const [selectedUni, setSelectedUni] = useState(
    searchParams.get("uni") || "All",
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "rating-desc",
  );

  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterParams = useMemo(
    () => ({ q: query, dept: selectedDept, uni: selectedUni, sort: sortBy }),
    [query, selectedDept, selectedUni, sortBy],
  );

  const {
    q: debouncedQuery,
    dept: debouncedDept,
    uni: debouncedUni,
    sort: debouncedSort,
  } = useDebounce(filterParams, 800);

  useEffect(() => {
    setLoading(true);
  }, [query, selectedDept, selectedUni, sortBy]);

  // 3. Fetch Data (Keep this simple)
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/professors`);
        const data = await res.json();
        if (mounted) setProfessors(data || []);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) {
          setLoading(false);
          setLoadingScreen(false);
        }
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // 4. Update URL whenever filters change (Debounced)
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (debouncedDept !== "All") params.set("dept", debouncedDept);
    if (debouncedUni !== "All") params.set("uni", debouncedUni);
    if (debouncedSort !== "rating-desc") params.set("sort", debouncedSort);

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, debouncedDept, debouncedUni, debouncedSort, router]);

  // 5. Optimized Filtering logic
  const filtered = useMemo(() => {
    if (!professors.length) return [];

    const q = debouncedQuery.toLowerCase().trim();

    return professors
      .filter((p) => {
        if (debouncedDept !== "All" && p.dept !== debouncedDept) return false;

        if (
          debouncedUni !== "All" &&
          p?.college?.university?._id !== debouncedUni
        )
          return false;

        if (q) {
          return (
            p.name?.toLowerCase().includes(q) ||
            p.dept?.toLowerCase().includes(q) ||
            p.courses?.some((c) => c?.toLowerCase().includes(q)) ||
            p.college?.name?.toLowerCase().includes(q) ||
            p.college?.university?.name?.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        switch (debouncedSort) {
          case "rating-desc":
            return b.rating - a.rating;
          case "rating-asc":
            return a.rating - b.rating;
          case "reviews-desc":
            return b.totalReviews - a.totalReviews;
          case "name-asc":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [professors, debouncedQuery, debouncedDept, debouncedUni, debouncedSort]);

  // 2. Stop loading once the debounced filtering is complete
  useEffect(() => {
    setLoading(false);
  }, [filtered]);
  return (
    <>
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
              <button className={styles.clearBtn} onClick={() => setQuery("")}>
                ✕
              </button>
            )}
          </motion.div>

          <motion.div
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/addprofessor" className={`${styles.link} plain-link`}>
              Didn't find your professor?
              <span className={styles.addNow}> Add Now</span>
            </Link>
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
    </>
  );
}
