"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Loading from "./Loading";
import styles from "./Notification.module.css";
import { motion } from "framer-motion";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const observer = useRef();

  const fetchNotifications = useCallback(async () => {
    if (loading && notifications.length > 0) return;
    setLoading(true);

    try {
      const token = process.env.NEXT_PUBLIC_PASSCODE || "";
      const url = `${
        process.env.NEXT_PUBLIC_NEXT_BASE_URL
      }/notifications?limit=10${nextCursor ? `&cursor=${nextCursor}` : ""}`;

      console.log("Fetching from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Authentication failed or other error.");
      }

      const { data, nextCursor: newCursor } = await response.json();

      setNotifications((prev) => {
        const existingIds = new Set(prev.map((item) => item._id));
        const newNotifications = data.filter(
          (item) => !existingIds.has(item._id),
        );
        return [...prev, ...newNotifications];
      });

      setNextCursor(newCursor);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [nextCursor, loading]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const lastNotificationRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextCursor) {
          fetchNotifications();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, nextCursor],
  );

  if (error) return <p>{error}</p>;

  return (
    <>
      <section className={styles.searchHero}>
        <div className={styles.heroBlob} />
        <div className={styles.heroInner}>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Notifications
          </motion.h1>
          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Stay updated with newly added professors, rating activity, and
            announcements from Rate Your Professor.
          </motion.p>
        </div>
      </section>
      {notifications.map((notification, index) => (
        <motion.div
          key={notification?._id || index}
          ref={index === notifications.length - 1 ? lastNotificationRef : null}
          className={styles.notificationCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <h3 className={styles.notificationTitle}>{notification?.title}</h3>
          <p className={styles.notificationMessage}>{notification?.message}</p>
        </motion.div>
      ))}
      {loading && <Loading />}
    </>
  );
};

export default Notifications;
