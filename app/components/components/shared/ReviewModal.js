"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ReviewModal.module.css";
import Link from "next/link";
import leoProfanity from "leo-profanity";
import { additionalBadWords } from "@/public/data/badwords";

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

const STORAGE_KEY = "ratingSubmissions";
const DAILY_LIMIT = 5;

function getSessionSubmissions() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const submissions = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    // Still filter to last 24 h in case the tab stays open overnight
    return submissions.filter((ts) => now - ts < 24 * 60 * 60 * 1000);
  } catch {
    return [];
  }
}

function recordSessionSubmission() {
  try {
    const current = getSessionSubmissions();
    current.push(Date.now());
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // storage unavailable — fail silently
  }
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
  const [profanityError, setProfanityError] = useState("");

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

  const handleReviewChange = (e) => {
    const text = e.target.value;
    if (text.length > MAX_CHARS) return;
    setReviewText(text);

    if (text.trim().length > 0 && leoProfanity.check(text)) {
      setProfanityError("Please remove offensive language before continuing.");
    } else {
      setProfanityError("");
    }
  };

  const canProceedStep1 = ratings.overall > 0;
  const canProceedStep2 = profanityError === "";

  const handleSubmit = async () => {
    // Re-validate profanity on submit (in case paste bypassed onChange)
    if (leoProfanity.check(reviewText)) {
      setProfanityError("Please remove offensive language before submitting.");
      return;
    }

    // Check session-based rate limit
    const sessionSubs = getSessionSubmissions();
    if (sessionSubs.length >= DAILY_LIMIT) {
      setSubmitted("limit_exceeded");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors/${id}/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: ratings.overall,
            comment: reviewText.trim(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit rating: " + response.statusText);
      }

      recordSessionSubmission();
      setSubmitted("success");
    } catch (error) {
      console.error("Error submitting rating:", error.message);
    }
  };

  const resetForm = () => {
    setStep(1);
    setRatings({ overall: 0, clarity: 0, helpfulness: 0, fairness: 0 });
    setSelectedTags([]);
    setCourse("");
    setReviewText("");
    setWouldTakeAgain(null);
    setDifficulty(0);
    setProfanityError("");
    setSubmitted(false);
  };

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
          <div className={styles.modalWrapper}>
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
            >
              {submitted === "success" && (
                <motion.div
                  className={styles.successState}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={styles.successIcon}>✅</div>
                  <h3 className={styles.successTitle}>Review submitted!</h3>
                  <p className={styles.successDesc}>
                    Your anonymous review has been submitted. Thank you for
                    helping fellow students!
                    <br />
                    <br />
                    AI moderation is now reviewing your submission. Approved
                    reviews are typically published within 6 hours.
                  </p>
                  <Link className={styles.link} href="/">
                    Go back to homepage
                  </Link>
                </motion.div>
              )}

              {submitted === "limit_exceeded" && (
                <motion.div
                  className={styles.successState}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={styles.successIcon}>⏳</div>
                  <h3 className={styles.successTitle}>Daily limit reached</h3>
                  <p className={styles.successDesc}>
                    You've submitted {DAILY_LIMIT} reviews today — that's the
                    daily maximum to keep ratings fair.
                    <br />
                    <br />
                    Come back tomorrow and your review will be waiting for you!
                  </p>
                  <button className={styles.link} onClick={onClose}>
                    Close
                  </button>
                </motion.div>
              )}

              {!submitted && (
                <>
                  <div className={styles.modalHeader}>
                    <div>
                      <div className={styles.anonBadge}>
                        🔒 Anonymous Review
                      </div>
                      <h2 className={styles.modalTitle}>
                        Rate {professorName}
                      </h2>
                    </div>
                    <button
                      className={styles.closeBtn}
                      onClick={onClose}
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>

                  <div className={styles.steps}>
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`${styles.step} ${step >= s ? styles.stepActive : ""} ${step > s ? styles.stepDone : ""}`}
                      >
                        <div className={styles.stepDot}>
                          {step > s ? "✓" : s}
                        </div>
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
                            <label className={styles.label}>Your review</label>
                            <textarea
                              className={`${styles.textarea} ${profanityError ? styles.textareaError : ""}`}
                              placeholder="Share your honest experience with this professor..."
                              value={reviewText}
                              onChange={handleReviewChange}
                              rows={5}
                            />
                            {/* Profanity error — shown inline, blocks Next */}
                            {profanityError && (
                              <motion.div
                                className={styles.inlineError}
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                              >
                                ⚠️ {profanityError}
                              </motion.div>
                            )}
                            <div className={styles.charCount}>
                              <span
                                className={
                                  reviewText.length < 20
                                    ? styles.charWarn
                                    : styles.charOk
                                }
                              >
                                {reviewText.length >= 20 &&
                                  !profanityError &&
                                  "Looks good!"}
                              </span>
                              <span className={styles.charNum}>
                                {reviewText.length}/{MAX_CHARS}
                              </span>
                            </div>
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>
                              Select tags (up to 5)
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
                              Course name (optional)
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
                              Difficulty level: <strong>{difficulty}/5</strong>
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
                        disabled={
                          (step === 1 && !canProceedStep1) ||
                          (step === 2 && !canProceedStep2)
                        }
                        onClick={() => setStep((s) => s + 1)}
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        className={styles.submitBtn}
                        onClick={handleSubmit}
                      >
                        Submit review ✓
                      </button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
