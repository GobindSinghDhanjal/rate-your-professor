"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./AppBar.module.css";

export default function AppBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={styles.appBarContainer}>
      <div className={styles.appBar}>
        <div className={styles.left}>
          <h3>Rate Your Professor</h3>
        </div>

        <div className={styles.desktopMenu}>
          <Link className={styles.link} href="/alluniversities">
            Universities
          </Link>

          <Link className={styles.link} href="/notifications">
            Notifications
          </Link>

          <Link className={styles.link} href="/about">
            About
          </Link>
        </div>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link
            className={styles.mobileLink}
            href="/alluniversities"
            onClick={() => setMenuOpen(false)}
          >
            Universities
          </Link>

          <Link
            className={styles.mobileLink}
            href="/notifications"
            onClick={() => setMenuOpen(false)}
          >
            Notifications
          </Link>

          <Link
            className={styles.mobileLink}
            href="/about"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
        </div>
      )}
    </div>
  );
}
