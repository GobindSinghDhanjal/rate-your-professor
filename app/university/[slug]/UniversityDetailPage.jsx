"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import StarRating from "../../components/components/shared/StarRating";
import styles from "./UniversityDetailPage.module.css";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

function RatingBar({ label, value, color }) {
  return (
    <div className={styles.rBar}>
      <span className={styles.rBarLabel}>{label}</span>
      <div className={styles.rBarTrack}>
        <motion.div
          className={styles.rBarFill}
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{
            width: typeof value === "number" ? `${(value / 5) * 100}%` : "0%",
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className={styles.rBarVal}>
        {typeof value === "number" ? value : "NA"}
      </span>
    </div>
  );
}

function ProfMiniCard({ prof }) {
  return (
    <Link href={`/professor/${prof?._id}`} className={styles.miniProfCard}>
      <div className={styles.miniAvatar} style={{ background: prof?.avatarBg }}>
        <Image src={prof?.image} alt={prof?.name} width={40} height={40} />
      </div>
      <div className={styles.miniInfo}>
        <p className={styles.miniName}>{prof?.name}</p>
        <p className={styles.miniDept}>{prof?.dept}</p>
      </div>
      <div className={styles.miniRating}>
        <span className={styles.miniStar}>★</span>
        <span className={styles.miniRatingNum}>{prof?.rating}</span>
      </div>
    </Link>
  );
}

export default function UniversityDetailPage({ university, professors }) {
  const displayProfs = professors || [];
  const uniReviews = [];
  const [activeDept, setActiveDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const filteredProfs = useMemo(() => {
    let list = displayProfs;
    if (activeDept !== "All")
      list = list.filter((p) => p?.college?.name === activeDept);
    if (searchQuery.trim())
      list = list.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return list;
  }, [activeDept, searchQuery, displayProfs]);

  const depts = ["All", ...new Set(displayProfs.map((p) => p?.college?.name))];

  return (
    <>
      {/* Hero Banner */}
      <section
        className={`${styles.hero} small-page-top`}
        style={{ "--uni-color": university?.color }}
      >
        <div className={styles.heroBg} />
        <div className={styles.heroPattern} />
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.heroInner}
          >
            <Link href="/universities" className={styles.breadcrumb}>
              ← All Universities
            </Link>
            <div className={styles.heroTop}>
              <img
                src={university?.image}
                alt={`${university?.name} logo`}
                className={styles.logoImg}
              />
              <div className={styles.heroInfo}>
                <div className={styles.heroBadges}>
                  {university?.universityType && (
                    <span className={styles.typeBadge}>
                      {university.universityType}
                    </span>
                  )}

                  {university?.naacGrade && (
                    <span className={styles.naacBadge}>
                      NAAC {university.naacGrade}
                    </span>
                  )}

                  {university?.nirfRank && (
                    <span className={styles.nirfBadge}>
                      NIRF #{university.nirfRank}
                    </span>
                  )}
                </div>
                <h1 className={styles.heroTitle}>{university?.name}</h1>
                <p className={styles.heroLocation}>
                  📍 {university?.city}, {university?.state},{" "}
                  {university?.country} · Est. {university?.establishedYear}
                </p>
                {university?.rating && (
                  <div className={styles.heroRating}>
                    <span className={styles.heroRatingNum}>
                      {university?.rating}
                    </span>
                    <StarRating rating={university?.rating} size="lg" />
                    <span className={styles.heroRatingCount}>
                      ({university?.reviews?.toLocaleString()} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stat strip */}
      <div className={styles.statStrip}>
        {[
          {
            icon: "👨‍🏫",
            val: university?.totalProfessors?.toLocaleString() + "+",
            label: "Professors",
          },
          {
            icon: "📝",
            val: 100 + "+",
            label: "Student Reviews",
          },
          {
            icon: "🏛",
            val: university?.departments.length,
            label: "Departments",
          },
          {
            icon: "⭐",
            val:
              university?.rating !== undefined
                ? university?.rating.toFixed(1) + "/5"
                : "NA",
            label: "Avg Rating",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className={styles.statItem}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={i}
          >
            <span className={styles.statIcon}>{s.icon}</span>
            <span className={styles.statVal}>{s.val}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Main body */}
      <div className={styles.body}>
        <div className={styles.mainCol}>
          {/* Tabs */}
          <div className={styles.tabs}>
            {["overview", "professors", "reviews"].map((t) => (
              <button
                key={t}
                className={`${styles.tab} ${activeTab === t ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.tabContent}
            >
              <div className={styles.aboutCard}>
                <h2 className={styles.cardTitle}>About {university?.name}</h2>
                <p className={styles.aboutText}>{university?.description}</p>
              </div>
              {university?.departments && (
                <div className={styles.deptGrid}>
                  <h3 className={styles.subTitle}>Departments</h3>
                  <div className={styles.deptTags}>
                    {university?.departments.map((d) => (
                      <span key={d} className={styles.deptTag}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className={styles.ratingCard}>
                <h3 className={styles.subTitle}>Rating Breakdown</h3>
                <RatingBar
                  label="Teaching Quality"
                  // value={university?.rating}
                  color={university?.color}
                />
                <RatingBar
                  label="Helpfulness"
                  // value={Math.min(5, university?.rating - 0.1)}
                  color={university?.color}
                />
                <RatingBar
                  label="Course Value"
                  // value={Math.min(5, university?.rating + 0.1)}
                  color={university?.color}
                />
                <RatingBar
                  label="Campus Culture"
                  // value={Math.min(5, university?.rating - 0.3)}
                  color={university?.color}
                />
              </div>
            </motion.div>
          )}

          {activeTab === "professors" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.tabContent}
            >
              <div className={styles.profFilters}>
                <div className={styles.profSearch}>
                  <svg
                    width="16"
                    height="16"
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
                    placeholder="Search professors…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.profSearchInput}
                  />
                </div>
                <div className={styles.deptChips}>
                  {depts.map((d) => (
                    <button
                      key={d}
                      className={`${styles.deptChip} ${activeDept === d ? styles.deptChipActive : ""}`}
                      onClick={() => setActiveDept(d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.profList}>
                {filteredProfs.map((prof, i) => (
                  <motion.div
                    key={prof?._id}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                  >
                    <ProfMiniCard prof={prof} />
                  </motion.div>
                ))}
                {filteredProfs.length === 0 && (
                  <div className={styles.empty}>
                    <span>👨‍🏫</span>
                    <p>No professors match your search.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.tabContent}
            >
              {uniReviews.length === 0 && (
                <div className={styles.empty}>
                  <span>📝</span>
                  <p>No reviews yet for this university.</p>
                </div>
              )}
              {uniReviews.map((rev, i) => {
                const prof = professors.find((p) => p.id === rev.professorId);
                return (
                  <motion.div
                    key={rev.id}
                    className={styles.reviewCard}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                  >
                    <div className={styles.revTop}>
                      <div className={styles.revMeta}>
                        <span className={styles.revAuthor}>{rev.author}</span>
                        <span className={styles.revYear}>{rev.year}</span>
                      </div>
                      <StarRating rating={rev.rating} size="sm" />
                    </div>
                    {prof && (
                      <p className={styles.revProf}>
                        on {prof?.name} · <em>{rev.course}</em>
                      </p>
                    )}
                    <p className={styles.revText}>{rev.text}</p>
                    <div className={styles.revFooter}>
                      <span className={styles.revHelpful}>
                        👍 {rev.helpful} found helpful
                      </span>
                      <span className={styles.revDate}>
                        {new Date(rev.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}>Quick Info</h3>
            <div className={styles.infoList}>
              {[
                [
                  "🌐",
                  "Website",
                  university?.website?.replace("https://", "") || "NA",
                ],
                ["📞", "Phone", university?.contactPhone || "NA"],
                ["📧", "Email", university?.contactEmail || "NA"],
                ["📅", "Established", university?.establishedYear || "NA"],
                ["🏛", "Affiliation", university?.affiliation || "NA"],
              ].map(([icon, label, val]) => (
                <div key={label} className={styles.infoRow}>
                  <span className={styles.infoIcon}>{icon}</span>
                  <div>
                    <p className={styles.infoLabel}>{label}</p>
                    <p className={styles.infoVal}>{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}>Top Professors</h3>
            <div className={styles.topProfList}>
              {displayProfs.slice(0, 3).map((p) => (
                <ProfMiniCard key={p.id} prof={p} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
