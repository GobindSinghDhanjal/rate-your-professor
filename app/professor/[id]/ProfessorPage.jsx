"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import StarRating from "../../components/components/shared/StarRating";
import ReviewModal from "../../components/components/shared/ReviewModal";
import styles from "./ProfessorPage.module.css";
import { ProfessorAverageRating } from "@/app/utils/ProfessorAverageRating";
import Image from "next/image";
import Loader from "@/app/components/Loader/Loader";
import { useLoader } from "@/app/components/LoaderContext/LoaderContext";
import { Building2, GraduationCap } from "lucide-react";

async function copyTextFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand("copy");
  document.body.removeChild(textarea);
  return success;
}

const ALL_TAGS = [
  { label: "Helpful", icon: "🤝", positive: true },
  { label: "Clear Explanations", icon: "💡", positive: true },
  { label: "Inspirational", icon: "✨", positive: true },
  { label: "Research-focused", icon: "🔬", positive: true },
  { label: "Approachable", icon: "😊", positive: true },
  { label: "Interactive", icon: "🎯", positive: true },
  { label: "Tough Grader", icon: "📊", positive: false },
  { label: "Assignment Heavy", icon: "📚", positive: false },
  { label: "Strict Attendance", icon: "📋", positive: false },
];

function AnimatedBar({ label, value, color = "var(--accent-violet)" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div className={styles.animBar} ref={ref}>
      <div className={styles.animBarTop}>
        <span className={styles.animBarLabel}>{label}</span>
        <span className={styles.animBarNum}>{value ? value + "/5" : "NA"}</span>
      </div>
      <div className={styles.animBarTrack}>
        <motion.div
          className={styles.animBarFill}
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${(value / 5) * 100}%` } : {}}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  );
}

function ReviewCard({ rev, index }) {
  const [helpful, setHelpful] = useState(rev?.helpful);
  const [voted, setVoted] = useState(false);
  return (
    <motion.div
      className={styles.reviewCard}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
    >
      <div className={styles.revHeader}>
        <div className={styles.revLeft}>
          <div className={styles.revAvatar}>S</div>
          <div>
            <p className={styles.revAuthor}>Student</p>
            <p className={styles.revMeta}>
              {rev?.year} ·{" "}
              {new Date(rev?.date).toLocaleDateString("en-IN", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className={styles.revRight}>
          <StarRating rating={rev?.rating} size="sm" />
          <span className={styles.revRatingNum}>
            {rev?.rating ? `${rev?.rating}/5` : "NA"}
          </span>
        </div>
      </div>
      {rev?.course && (
        <p className={styles.revCourse}>
          Course: <em>{rev?.course}</em>
        </p>
      )}
      <p className={styles.revText}>{rev?.comment}</p>
      <div className={styles.revFooter}>
        <div className={styles.revMetas}>
          {rev?.wouldTakeAgain && (
            <span
              className={`${styles.revBadge} ${rev?.wouldTakeAgain ? styles.badgeGreen : styles.badgeRed}`}
            >
              {rev?.wouldTakeAgain
                ? "👍 Would take again"
                : "👎 Would not take again"}
            </span>
          )}

          {rev?.difficulty && (
            <span className={styles.revDiff}>
              Difficulty: {"★".repeat(rev?.difficulty)}
              {"☆".repeat(5 - rev?.difficulty)}
            </span>
          )}
        </div>
        {/* <button
          className={`${styles.helpfulBtn} ${voted ? styles.helpfulVoted : ""}`}
          onClick={() => {
            if (!voted) {
              setHelpful((h) => h + 1);
              setVoted(true);
            }
          }}
        >
          👍 Helpful ({helpful})
        </button> */}
      </div>
    </motion.div>
  );
}

export default function ProfessorPage({ prof }) {
  const { setLoadingScreen } = useLoader();

  const [feedbacks, setFeedbacks] = useState(null);

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors/${prof._id}`,
          { cache: "no-store" },
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setFeedbacks(data?.feedbacks);
      } catch (err) {
        console.error(err);
        setFeedbacks([]); // fallback to empty
      } finally {
        setLoadingScreen(false);
      }
    }
    fetchFeedbacks();
  }, [prof._id]);

  // Use live feedbacks if loaded, otherwise nothing yet
  const displayReviews = feedbacks
    ? [...feedbacks].sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  // const prof = professors.find((p) => p.id === id) || professors[0];
  // console.log("Professor data:", prof);
  // const displayReviews = [...(prof?.feedbacks || [])].sort(
  //   (a, b) => new Date(b.date) - new Date(a.date),
  // );
  const [activeTab, setActiveTab] = useState("reviews");
  const [modalOpen, setModalOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState("");

  const { averageRating, numberOfRatings } = ProfessorAverageRating(prof);

  // const avgRating =
  //   displayReviews.reduce((a, r) => a + r.rating, 0) / displayReviews.length ||
  //   prof?.rating;
  const wouldTakeAgainPct =
    Math.round(
      (displayReviews.filter((r) => r.wouldTakeAgain).length /
        displayReviews.length) *
        100,
    ) || prof?.wouldTakeAgain;

  const sharePage = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: `${prof?.name} - Rate Your Professor`,
      text: `Check out reviews for ${prof?.name}`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareStatus("Link shared successfully.");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Share failed", error);
          setShareStatus("Could not share. Try copying the link.");
        }
      }
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const copied = await copyTextFallback(shareUrl);
        if (!copied) throw new Error("Fallback copy failed");
      }
      setShareStatus("Link copied to clipboard.");
    } catch (error) {
      console.error("Copy to clipboard failed", error);
      setShareStatus("Copy failed. Please copy manually.");
    }
  };

  return (
    <>
      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        professorName={prof?.name}
        id={prof._id}
      />

      {/* Hero */}
      <section className={`${styles.hero} small-page-top`}>
        <div className={styles.heroBg} />
        <div className={styles.heroInner}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/search" className={styles.breadcrumb}>
              ← Back to Search
            </Link>
            <div className={styles.heroContent}>
              <div className={styles.avatarWrap}>
                <div
                  className={styles.avatar}
                  style={{ background: prof?.avatarBg }}
                >
                  <Image
                    src={prof?.image}
                    alt={prof?.name}
                    width={120}
                    height={120}
                  />
                </div>
                <div
                  className={styles.avatarGlow}
                  style={{ background: prof?.avatarBg }}
                />
              </div>
              <div className={styles.heroInfo}>
                {/* <div className={styles.heroBadge}>{prof?.dept}</div> */}
                <h1 className={styles.heroName}>{prof?.name}</h1>
                <p className={styles.heroTitle}>{prof?.title}</p>
                <Link
                  href={`/university/${prof?.college?.university?.slug}`}
                  className={styles.heroUni}
                >
                  <GraduationCap size={16} /> {prof?.college?.university?.name}
                </Link>

                {/* College - no page yet, render as plain span */}
                <span className={styles.heroUni}>
                  <Building2 size={16} />
                  {prof?.college?.name}
                </span>
                <div className={styles.heroRatingRow}>
                  <span className={styles.heroRatingBig}>{prof?.rating}</span>
                  <div className={styles.heroRatingRight}>
                    <StarRating rating={averageRating} size="lg" />
                    <span className={styles.heroRatingCount}>
                      Based on {numberOfRatings} reviews
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.heroActions}>
                <button
                  className={styles.writeReviewBtn}
                  onClick={() => setModalOpen(true)}
                >
                  ✍️ Write a Review
                </button>
                <button className={styles.shareBtn} onClick={sharePage}>
                  📤 Share
                </button>
              </div>
              {shareStatus && (
                <div className={styles.shareStatusWrap}>
                  <p className={styles.shareStatus}>{shareStatus}</p>
                  <button
                    type="button"
                    className={styles.shareStatusClose}
                    onClick={() => setShareStatus("")}
                    aria-label="Close share status"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick stats strip */}
      <div className={styles.statsStrip}>
        {[
          {
            val: averageRating !== 0 ? `${averageRating}/5` : "NA",
            label: "Overall Rating",
            icon: "⭐",
          },
          {
            val: `${prof?.wouldTakeAgain != null ? `${prof.wouldTakeAgain}%` : "NA"}`,
            label: "Would Take Again",
            icon: "🔄",
          },
          {
            val: `${prof?.difficultyLevel != null ? `${prof.difficultyLevel}/5` : "NA"}`,
            label: "Difficulty",
            icon: "🎯",
          },
          { val: numberOfRatings, label: "Total Reviews", icon: "📝" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className={styles.stripItem}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <span className={styles.stripIcon}>{s.icon}</span>
            <span className={styles.stripVal}>{s.val}</span>
            <span className={styles.stripLabel}>{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Main body */}
      <div className={styles.body}>
        <div className={styles.mainCol}>
          {/* Tags */}
          <div className={styles.tagsSection}>
            <h3 className={styles.sectionTitle}>Student Tags</h3>
            <div className={styles.tagCloud}>
              {prof?.tags?.map((t, i) => {
                const tagInfo = ALL_TAGS.find((a) => a.label === t) || {
                  positive: true,
                  icon: "📌",
                };
                return (
                  <motion.span
                    key={t}
                    className={`${styles.tag} ${tagInfo.positive ? styles.tagPos : styles.tagNeg}`}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    {tagInfo.icon} {t}
                  </motion.span>
                );
              })}
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            {["reviews", "subjects", "stats"].map((t) => (
              <button
                key={t}
                className={`${styles.tab} ${activeTab === t ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "reviews" && (
            <div className={styles.tabContent}>
              <div className={styles.reviewsHeader}>
                <p className={styles.reviewsCount}>
                  {displayReviews.length} reviews
                </p>
                <button
                  className={styles.writeBtn}
                  onClick={() => setModalOpen(true)}
                >
                  + Add Review
                </button>
              </div>
              {displayReviews.map((rev, i) => (
                <ReviewCard key={rev?._id} rev={rev} index={i} />
              ))}
            </div>
          )}

          {activeTab === "subjects" && (
            <motion.div
              className={styles.tabContent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className={styles.courseGrid}>
                {prof?.courses?.map((c, i) => (
                  <motion.div
                    key={c}
                    className={styles.courseCard}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <div className={styles.courseIcon}>📖</div>
                    <div className={styles.courseInfo}>
                      <p className={styles.courseName}>{c}</p>
                      <p className={styles.courseMeta}>
                        Taught by {prof?.name?.split(" ")[0]}
                      </p>
                    </div>
                    <span className={styles.courseArrow}>→</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "stats" && (
            <motion.div
              className={styles.tabContent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className={styles.statsCard}>
                <h3 className={styles.statsCardTitle}>Rating Breakdown</h3>
                <AnimatedBar
                  label="Clarity of Teaching"
                  value={prof?.ratingBreakdown?.clarity}
                  color="linear-gradient(90deg, #7c3aed, #8b5cf6)"
                />
                <AnimatedBar
                  label="Helpfulness"
                  value={prof?.ratingBreakdown?.helpfulness}
                  color="linear-gradient(90deg, #3b82f6, #06b6d4)"
                />
                <AnimatedBar
                  label="Subject Knowledge"
                  value={prof?.ratingBreakdown?.knowledge}
                  color="linear-gradient(90deg, #10b981, #3b82f6)"
                />
                <AnimatedBar
                  label="Grading Fairness"
                  value={prof?.ratingBreakdown?.fairness}
                  color="linear-gradient(90deg, #f59e0b, #10b981)"
                />
              </div>
              <div className={styles.statsGrid}>
                <div className={styles.statGlassCard}>
                  <div className={styles.statGlassIcon}>🔄</div>
                  <div className={styles.statGlassVal}>
                    {prof?.wouldTakeAgain != null
                      ? `${prof.wouldTakeAgain}%`
                      : "NA"}
                  </div>
                  <div className={styles.statGlassLabel}>Would Take Again</div>
                  <div className={styles.statGlassBar}>
                    <div
                      style={{
                        width: `${prof?.wouldTakeAgain}%`,
                        background: "#10b981",
                      }}
                    />
                  </div>
                </div>
                <div className={styles.statGlassCard}>
                  <div className={styles.statGlassIcon}>🎯</div>
                  <div className={styles.statGlassVal}>
                    {prof?.difficultyLevel != null
                      ? `${prof.difficultyLevel}/5`
                      : "NA"}
                  </div>
                  <div className={styles.statGlassLabel}>Difficulty Level</div>
                  <div className={styles.statGlassBar}>
                    <div
                      style={{
                        width: `${(prof?.difficultyLevel / 5) * 100}%`,
                        background: "#f59e0b",
                      }}
                    />
                  </div>
                </div>
                <div className={styles.statGlassCard}>
                  <div className={styles.statGlassIcon}>📝</div>
                  <div className={styles.statGlassVal}>{numberOfRatings}</div>
                  <div className={styles.statGlassLabel}>Total Reviews</div>
                </div>
                <div className={styles.statGlassCard}>
                  <div className={styles.statGlassIcon}>📅</div>
                  <div className={styles.statGlassVal}>
                    {prof?.joined != null
                      ? `${new Date().getFullYear() - prof.joined}y`
                      : "NA"}
                  </div>
                  <div className={styles.statGlassLabel}>
                    Teaching Experience
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <div className={styles.sideProfInfo}>
              <div
                className={styles.sideAvatar}
                style={{ background: prof?.avatarBg }}
              >
                <Image
                  src={prof?.image}
                  alt={prof?.name}
                  width={80}
                  height={80}
                />
              </div>
              <div className={styles.sideRatingBig}>{averageRating}</div>
              <StarRating rating={averageRating} size="md" />
              <p className={styles.sideReviewCount}>
                {numberOfRatings} student reviews
              </p>
            </div>
            <button
              className={styles.sideReviewBtn}
              onClick={() => setModalOpen(true)}
            >
              ✍️ Write a Review
            </button>
          </div>

          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}>Contact & Info</h3>
            <div className={styles.contactList}>
              {[
                ["🏛", "University", prof?.college?.university?.name],
                ["🎓", "College", prof?.college?.name],
                ["📚", "Department", prof?.dept],
                ["📧", "Email", prof?.email],
                ["📅", "Teaching Since", prof?.joined],
              ].map(([icon, label, val]) => (
                <div key={label} className={styles.contactRow}>
                  <span>{icon}</span>
                  <div>
                    <p className={styles.contactLabel}>{label}</p>
                    <p className={styles.contactVal}>
                      {val != null && val !== "" ? val : "NA"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {prof?.bio && (
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>About</h3>
              <p className={styles.sideBio}>{prof?.bio}</p>
            </div>
          )}
        </aside>
      </div>
    </>
    // </PageWrapper>
  );
}
