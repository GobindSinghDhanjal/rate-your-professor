"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ReviewModal.module.css";
import Filter from "bad-words";
import { additionalBadWords } from "@/public/data/badwords";
import { useRouter } from "next/navigation";

const ALL_TAGS = [
  "Clear Explanations",
  "Tough Grader",
  "Helpful",
  "Inspirational",
  "Assignment Heavy",
  "Chill",
  "Research-focused",
  "Approachable",
  "Strict Attendance",
  "Boring Lectures",
  "Interactive",
  "Great Feedback",
];

function StarPicker({ value, onChange, label }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className={styles.starPickerWrap}>
      <span className={styles.starPickerLabel}>{label}</span>
      <div className={styles.starPicker}>
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            className={`${styles.starBtn} ${s <= (hovered || value) ? styles.starOn : ""}`}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(s)}
          >
            ★
          </button>
        ))}
        <span className={styles.starVal}>
          {value ? `${value}/5` : "Tap to rate"}
        </span>
      </div>
    </div>
  );
}

export default function ReviewModal({
  isOpen,
  onClose,
  professorName = "Professor",
  id,
}) {
  const [step, setStep] = useState(1);
  const [ratings, setRatings] = useState({
    overall: 0,
    clarity: 0,
    helpfulness: 0,
    fairness: 0,
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [course, setCourse] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [wouldTakeAgain, setWouldTakeAgain] = useState(null);
  const [difficulty, setDifficulty] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const MAX_CHARS = 500;

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < 5
          ? [...prev, tag]
          : prev,
    );
  };

  const [basicAlert, setBasicAlert] = useState({ display: false, alert: {} });
  const [commentAlert, setCommentAlert] = useState({
    display: false,
    alert: {},
  });

  const router = useRouter();
  const filter = new Filter();

  const getTodaySubmissions = () => {
    const rawData = localStorage.getItem("ratingSubmissions");
    const submissions = rawData ? JSON.parse(rawData) : [];

    const now = new Date();
    const last24Hours = submissions.filter((timestamp) => {
      const date = new Date(timestamp);
      return now - date < 24 * 60 * 60 * 1000;
    });

    return last24Hours;
  };

  const recordSubmission = () => {
    const rawData = localStorage.getItem("ratingSubmissions");
    const submissions = rawData ? JSON.parse(rawData) : [];
    const now = new Date().toISOString();
    submissions.push(now);
    localStorage.setItem("ratingSubmissions", JSON.stringify(submissions));
  };

  const handleSubmit = async () => {
    try {
      console.log("in submit");
      console.log("rating: ", ratings);
      const value = ratings.overall;
      const comment = reviewText.trim();

      console.log("review text: ", comment);

      const todaySubmissions = getTodaySubmissions();
      if (
        todaySubmissions.length >= 5 &&
        process.env.NODE_ENV !== "development"
      ) {
        setBasicAlert({
          display: true,
          alert: {
            severity: "error",
            message: "You’ve reached the daily limit of ratings.",
          },
        });
        throw new Error("Daily submission limit reached");
      }

      const lowerCaseComment = comment.toLowerCase();
      const lowerCaseBadWords = additionalBadWords.map((word) =>
        word.toLowerCase(),
      );

      if (value === 0 || value === null) {
        setBasicAlert({
          display: true,
          alert: {
            severity: "error",
            message: "Rating cannot be Null",
          },
        });
        throw new Error("Rating cannot be Null");
      } else if (
        filter.isProfane(lowerCaseComment) ||
        lowerCaseBadWords.some((word) => lowerCaseComment.includes(word))
      ) {
        setBasicAlert({ display: false, alert: {} });
        setCommentAlert({
          display: true,
          alert: {
            severity: "error",
            message: "Please avoid using offensive language.",
          },
        });
        throw new Error("Comment contains bad words");
      } else {
        setBasicAlert({ display: false, alert: {} });
        setCommentAlert({ display: false, alert: {} });
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors/${id}/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating: value, comment: comment }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit rating: " + response.statusText);
      }

      console.log("Rating submitted successfully.");
      recordSubmission();
    } catch (error) {
      console.error("Error submitting rating:", error.message);
    } finally {
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setStep(1);
        setRatings({ overall: 0, clarity: 0, helpfulness: 0, fairness: 0 });
        setSelectedTags([]);
        setCourse("");
        setReviewText("");
        setWouldTakeAgain(null);
        setDifficulty(0);
        onClose();
        setTimeout(() => {
          router.replace("/");
        }, 200);
      }, 1800);
    }
  };

  const canProceedStep1 = ratings.overall > 0;
  const canProceedStep2 = reviewText.trim().length >= 20;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            {submitted ? (
              <motion.div
                className={styles.successState}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className={styles.successIcon}>✅</div>
                <h3 className={styles.successTitle}>Review Submitted!</h3>
                <p className={styles.successDesc}>
                  Your anonymous review has been submitted. Thank you for
                  helping fellow students!
                </p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className={styles.modalHeader}>
                  <div>
                    <div className={styles.anonBadge}>🔒 Anonymous Review</div>
                    <h2 className={styles.modalTitle}>Rate {professorName}</h2>
                  </div>
                  <button
                    className={styles.closeBtn}
                    onClick={onClose}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* Step indicators */}
                <div className={styles.steps}>
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`${styles.step} ${step >= s ? styles.stepActive : ""} ${step > s ? styles.stepDone : ""}`}
                    >
                      <div className={styles.stepDot}>{step > s ? "✓" : s}</div>
                      <span className={styles.stepLabel}>
                        {["Ratings", "Review", "Details"][s - 1]}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.modalBody}>
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        className={styles.stepContent}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                      >
                        <StarPicker
                          label="Overall Rating *"
                          value={ratings.overall}
                          onChange={(v) =>
                            setRatings((r) => ({ ...r, overall: v }))
                          }
                        />
                        <StarPicker
                          label="Clarity of Teaching"
                          value={ratings.clarity}
                          onChange={(v) =>
                            setRatings((r) => ({ ...r, clarity: v }))
                          }
                        />
                        <StarPicker
                          label="Helpfulness"
                          value={ratings.helpfulness}
                          onChange={(v) =>
                            setRatings((r) => ({ ...r, helpfulness: v }))
                          }
                        />
                        <StarPicker
                          label="Grading Fairness"
                          value={ratings.fairness}
                          onChange={(v) =>
                            setRatings((r) => ({ ...r, fairness: v }))
                          }
                        />
                      </motion.div>
                    )}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        className={styles.stepContent}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Your Review</label>
                          <textarea
                            className={styles.textarea}
                            placeholder="Share your honest experience with this professor..."
                            value={reviewText}
                            onChange={(e) =>
                              e.target.value.length <= MAX_CHARS &&
                              setReviewText(e.target.value)
                            }
                            rows={5}
                          />
                          <div className={styles.charCount}>
                            <span
                              className={
                                reviewText.length < 20
                                  ? styles.charWarn
                                  : styles.charOk
                              }
                            >
                              {reviewText.length > 20 && "Looks good!"}
                            </span>
                            <span className={styles.charNum}>
                              {reviewText.length}/{MAX_CHARS}
                            </span>
                          </div>
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>
                            Select Tags (up to 5)
                          </label>
                          <div className={styles.tagGrid}>
                            {ALL_TAGS.map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                className={`${styles.tagBtn} ${selectedTags.includes(tag) ? styles.tagBtnActive : ""}`}
                                onClick={() => toggleTag(tag)}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        className={styles.stepContent}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className={styles.formGroup}>
                          <label className={styles.label}>
                            Course Name (optional)
                          </label>
                          <input
                            type="text"
                            className={styles.input}
                            placeholder="e.g. Data Structures & Algorithms"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>
                            Would you take this professor again?
                          </label>
                          <div className={styles.yesNo}>
                            <button
                              type="button"
                              className={`${styles.yesNoBtn} ${wouldTakeAgain === true ? styles.yesActive : ""}`}
                              onClick={() => setWouldTakeAgain(true)}
                            >
                              👍 Yes
                            </button>
                            <button
                              type="button"
                              className={`${styles.yesNoBtn} ${wouldTakeAgain === false ? styles.noActive : ""}`}
                              onClick={() => setWouldTakeAgain(false)}
                            >
                              👎 No
                            </button>
                          </div>
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>
                            Difficulty Level: <strong>{difficulty}/5</strong>
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            step="0.5"
                            className={styles.slider}
                            value={difficulty || 1}
                            onChange={(e) =>
                              setDifficulty(parseFloat(e.target.value))
                            }
                          />
                          <div className={styles.sliderLabels}>
                            <span>Easy</span>
                            <span>Medium</span>
                            <span>Hard</span>
                          </div>
                        </div>
                        <div className={styles.anonNote}>
                          🔒 Your identity will never be revealed. This review
                          is completely anonymous.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer nav */}
                <div className={styles.modalFooter}>
                  {step > 1 && (
                    <button
                      className={styles.backBtn}
                      onClick={() => setStep((s) => s - 1)}
                    >
                      ← Back
                    </button>
                  )}
                  <div style={{ flex: 1 }} />
                  {step < 3 ? (
                    <button
                      className={styles.nextBtn}
                      disabled={step === 1 && !canProceedStep1}
                      onClick={() => setStep((s) => s + 1)}
                    >
                      Next →
                    </button>
                  ) : (
                    <button className={styles.submitBtn} onClick={handleSubmit}>
                      Submit Review ✓
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
