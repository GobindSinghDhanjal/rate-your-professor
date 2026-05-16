"use client";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Rating } from "@mui/material";
import styles from "./ProfessorCard.module.css";
import avgRating from "../avgRatingUtil";
import Link from "next/link";
import LoadingScreen from "../LoadingScreen";

export default function ProfessorCard({ prop, onButtonClick }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [clicked, setClicked] = useState(false);
  const href = `/professor/${prop._id}`;

  useEffect(() => {
    // optional: change cursor to indicate wait while overlay active
    if (isPending || clicked) {
      document.body.style.cursor = "wait";
    } else {
      document.body.style.cursor = "";
    }
    return () => {
      document.body.style.cursor = "";
    };
  }, [isPending, clicked]);

  const safePrefetch = (url) => {
    try {
      const maybe = router?.prefetch?.(url);
      if (maybe && typeof maybe.then === "function") {
        maybe.catch(() => {});
      }
    } catch (e) {
      // ignore
    }
  };

  const safePush = (url, onFail) => {
    try {
      const maybe = router.push(url);
      if (maybe && typeof maybe.then === "function") {
        maybe.catch(() => onFail && onFail());
      }
    } catch (e) {
      // if push throws synchronously
      onFail && onFail();
    }
  };

  const handleMouseEnter = () => {
    safePrefetch(href);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (clicked) return;
    setClicked(true);

    safePrefetch(href);

    startTransition(() => {
      safePush(href, () => {
        // navigation failed, remove overlay so user can retry
        setClicked(false);
      });
    });
  };

  return (
    <>
      <Link
        href={href}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        prefetch={false}
        className={`${styles.professorCard} plain-link`}
        aria-busy={isPending || clicked}
      >
        <div className={styles.image}>
          <Avatar
            alt={prop.name}
            src={prop.image}
            sx={{ width: 70, height: 70 }}
          />
        </div>
        <div className={styles.details}>
          <h3>{prop.name}</h3>
          <div className={styles.college}>
            <p>
              {prop.college.name}, {prop.college.university.name}
            </p>
          </div>

          <Rating
            name="read-only"
            value={avgRating(prop)}
            precision={0.5}
            sx={{ display: "flex", fontSize: 16 }}
            readOnly
          />
        </div>
      </Link>

      {(isPending || clicked) && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.85)",
            zIndex: 9999,
            pointerEvents: "auto", // block interaction
          }}
        >
          <LoadingScreen />
        </div>
      )}
    </>
  );
}
