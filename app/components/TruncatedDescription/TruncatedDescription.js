"use client";

import { useState } from "react";
import styles from './TruncatedDescription.module.css'

export default function TruncatedDescription({ text, limit = 100 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  if (!text) return null;

  const shouldTruncate = text.length > limit;
  const displayedText =
    isExpanded || !shouldTruncate ? text : text.slice(0, limit) + "...";

  return (
    <p className={styles.truncatedDescription}>
      {displayedText}{" "}
      {shouldTruncate && (
        <span
          onClick={toggleExpanded}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {isExpanded ? "Show Less" : "Read More"}
        </span>
      )}
    </p>
  );
}
