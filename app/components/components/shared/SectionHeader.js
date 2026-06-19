import styles from "./SectionHeader.module.css";

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
}) {
  return (
    <div className={`${styles.header} ${centered ? styles.centered : ""}`}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
