"use client";

import {
  useState,
  useMemo,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./SearchPage.module.css";
import { ProfessorAverageRating } from "@/app/utils/ProfessorAverageRating";
import Loader from "../Loader/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/app/hooks/use-debounce";
import { useLoader } from "../LoaderContext/LoaderContext";
import Link from "next/link";

const MIN_FILTERED_RESULTS = 20;

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

function ProfCard({ prof, index, cardRef }) {
  const profReviews = [
    {
      text: '"Absolutely brilliant professor. Changed the way I think."',
      author: "Arjun M.",
    },
    { text: '"Best in the department. Highly recommend."', author: "Sneha K." },
    { text: '"Tough but fair. You\'ll learn a lot."', author: "Rahul T." },
  ];

  const { averageRating, numberOfRatings } = ProfessorAverageRating(
    prof?.feedbacks,
  );
  const router = useRouter();
  const { setLoadingScreen } = useLoader();

  const handleClick = () => {
    setLoadingScreen(true);
    router.push(`/professor/${prof._id}`);
  };

  return (
    <motion.div
      ref={cardRef}
      className={styles.profCard}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.06, 0.3),
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
            {averageRating !== 0 && (
              <span className={styles.bigRating}>{averageRating}</span>
            )}
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

// ─── Filtering helper (pure function, no hooks) ───────────────────────────────
function applyFilters(professors, { query, dept, uni, sort }) {
  const q = query.toLowerCase().trim();

  return professors
    .filter((p) => {
      if (dept !== "All" && p.dept !== dept) return false;
      if (uni !== "All" && p?.college?.university?._id !== uni) return false;
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
      const ratingA = ProfessorAverageRating(a?.feedbacks);
      const ratingB = ProfessorAverageRating(b?.feedbacks);
      switch (sort) {
        case "rating-desc":
          return ratingB.averageRating - ratingA.averageRating;
        case "rating-asc":
          return ratingA.averageRating - ratingB.averageRating;
        case "reviews-desc":
          return ratingB.numberOfRatings - ratingA.numberOfRatings;
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SearchPage({ universities }) {
  const { loadingScreen, setLoadingScreen } = useLoader();
  const router = useRouter();
  const searchParams = useSearchParams();

  useLayoutEffect(() => {
    setLoadingScreen(true);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter state — initialised from URL
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

  // Debounce all filter params together
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

  // ── Data refs (stable across renders) ───────────────────────────────────────
  // All professors fetched so far — never reset, only appended to
  const allProfessors = useRef([]);
  // Current page cursor
  const currentPage = useRef(1);
  // Whether the API has more pages
  const hasMore = useRef(true);
  // Guard against concurrent fetches
  const isFetching = useRef(false);

  // Derived state that actually triggers re-renders
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Core fetch (one page) ────────────────────────────────────────────────────
  const fetchOnePage = useCallback(async (page) => {
    const res = await fetch(`/api/professors/v2?page=${page}`);
    if (!res.ok) throw new Error("Failed to fetch professors.");
    const result = await res.json();
    if (!result.success) throw new Error(result.message);
    return result; // { data: [...], meta: { hasMore: bool } }
  }, []);

  // ── "Fill to MIN_FILTERED_RESULTS" fetcher ───────────────────────────────────
  // Keeps fetching pages until the filtered list has ≥ MIN_FILTERED_RESULTS
  // entries, or we run out of data on the API.
  const fillToMinResults = useCallback(
    async (activeFilters) => {
      if (isFetching.current) return;
      isFetching.current = true;
      setLoading(true);

      try {
        // Work on a local snapshot so we don't fight React state mid-loop
        let localAll = [...allProfessors.current];
        let localPage = currentPage.current;
        let localHasMore = hasMore.current;

        let currentFiltered = applyFilters(localAll, activeFilters);

        while (currentFiltered.length < MIN_FILTERED_RESULTS && localHasMore) {
          const nextPage = localPage + 1;
          const result = await fetchOnePage(nextPage);

          localAll = [...localAll, ...result.data];
          localPage = nextPage;
          localHasMore = result.meta.hasMore;

          currentFiltered = applyFilters(localAll, activeFilters);
        }

        // Commit everything back to refs
        allProfessors.current = localAll;
        currentPage.current = localPage;
        hasMore.current = localHasMore;

        setFiltered(currentFiltered);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        isFetching.current = false;
        setLoading(false);
      }
    },
    [fetchOnePage],
  );

  // ── Initial load ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    const MAX_RETRIES = 5;

    const initialLoad = async () => {
      setLoadingScreen(true);
      setLoading(true);

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const result = await fetchOnePage(1);

          if (!mounted) return;

          allProfessors.current = result.data || [];
          currentPage.current = 1;
          hasMore.current = result.meta.hasMore;

          // After first page, immediately try to fill to MIN_FILTERED_RESULTS
          // with whatever the current (un-debounced) filters are
          const initialFilters = {
            query: searchParams.get("q") || "",
            dept: searchParams.get("dept") || "All",
            uni: searchParams.get("uni") || "All",
            sort: searchParams.get("sort") || "rating-desc",
          };

          const initialFiltered = applyFilters(
            allProfessors.current,
            initialFilters,
          );

          setFiltered(initialFiltered);
          setLoadingScreen(false);
          setLoading(false);

          // If first page didn't fill enough results, keep fetching
          if (
            initialFiltered.length < MIN_FILTERED_RESULTS &&
            hasMore.current
          ) {
            fillToMinResults(initialFilters);
          }

          return;
        } catch (err) {
          if (attempt === MAX_RETRIES) {
            if (mounted) {
              setError(err.message);
              setLoadingScreen(false);
              setLoading(false);
            }
          } else {
            await new Promise((r) => setTimeout(r, 1000 * attempt));
          }
        }
      }
    };

    initialLoad();
    return () => {
      mounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load next page (called by scroll observer) ────────────────────────────────
  const loadNextPage = useCallback(
    async (activeFilters) => {
      if (isFetching.current || !hasMore.current) return;
      isFetching.current = true;
      setLoading(true);

      try {
        const nextPage = currentPage.current + 1;
        const result = await fetchOnePage(nextPage);

        allProfessors.current = [...allProfessors.current, ...result.data];
        currentPage.current = nextPage;
        hasMore.current = result.meta.hasMore;

        // Apply filters to the full accumulated list and update UI
        setFiltered(applyFilters(allProfessors.current, activeFilters));
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        isFetching.current = false;
        setLoading(false);
      }
    },
    [fetchOnePage],
  );

  // ── Re-filter + auto-fill when debounced filters change ─────────────────────
  // Runs whenever the user changes search/dept/uni/sort (after debounce)
  useEffect(() => {
    const activeFilters = {
      query: debouncedQuery,
      dept: debouncedDept,
      uni: debouncedUni,
      sort: debouncedSort,
    };

    // First: apply filters to what we already have
    const immediate = applyFilters(allProfessors.current, activeFilters);
    setFiltered(immediate);

    // Then: if not enough results and API has more, keep fetching
    if (immediate.length < MIN_FILTERED_RESULTS && hasMore.current) {
      fillToMinResults(activeFilters);
    }
  }, [
    debouncedQuery,
    debouncedDept,
    debouncedUni,
    debouncedSort,
    fillToMinResults,
  ]);

  // ── Show loading spinner while debounce is in-flight ────────────────────────
  const isDebouncing =
    query !== debouncedQuery ||
    selectedDept !== debouncedDept ||
    selectedUni !== debouncedUni ||
    sortBy !== debouncedSort;

  // ── Infinite scroll — load next page when last card is visible ───────────────
  const observerRef = useRef();
  const lastCardRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            hasMore.current &&
            !isFetching.current
          ) {
            const activeFilters = {
              query: debouncedQuery,
              dept: debouncedDept,
              uni: debouncedUni,
              sort: debouncedSort,
            };
            loadNextPage(activeFilters); // ← was fillToMinResults
          }
        },
        { rootMargin: "800px" },
      );

      if (node) observerRef.current.observe(node);
    },
    [
      loading,
      debouncedQuery,
      debouncedDept,
      debouncedUni,
      debouncedSort,
      loadNextPage,
    ],
  );

  // ── Sync filters → URL ────────────────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (debouncedDept !== "All") params.set("dept", debouncedDept);
    if (debouncedUni !== "All") params.set("uni", debouncedUni);
    if (debouncedSort !== "rating-desc") params.set("sort", debouncedSort);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, debouncedDept, debouncedUni, debouncedSort, router]);

  // ── Render ────────────────────────────────────────────────────────────────────
  const showLoader = (loading || isDebouncing) && !loadingScreen;

  return (
    <>
      {/* Hero search bar */}
      <section className={`${styles.searchHero} sub-container page-top`}>
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
      <div className={`${styles.body} sub-container`}>
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

          {showLoader && filtered.length === 0 ? (
            // Full loader only on first load or when nothing is shown yet
            <div className={styles.loaderWrap}>
              <Loader />
            </div>
          ) : (
            <AnimatePresence mode="sync">
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
                  <hr className={styles.divider} />
                  <Link
                    href="/addprofessor"
                    className={`${styles.link} plain-link`}
                  >
                    Didn't find your professor?
                    <span className={styles.addNow}> Add Now</span>
                  </Link>
                </motion.div>
              ) : (
                <div key="list" className={styles.list}>
                  {filtered.map((prof, i) => (
                    <ProfCard
                      key={prof?._id}
                      prof={prof}
                      index={i}
                      // Attach scroll observer only to the last card
                      cardRef={i === filtered.length - 10 ? lastCardRef : null}
                    />
                  ))}
                  {/* Inline loader at bottom while fetching more */}
                  {showLoader && (
                    <div className={styles.loaderWrap}>
                      <Loader />
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          )}

          {error && (
            <p style={{ color: "var(--text-danger)", textAlign: "center" }}>
              {error}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
