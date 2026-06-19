import Avatar from "@mui/material/Avatar";
import { Rating, Skeleton } from "@mui/material";
import styles from "./TopUniversities.module.css";
import Link from "next/link";

export default function TopUniversities({ universities }) {
  if (!universities || !universities.length) {
    return (
      <div className={styles.container}>
        {[1, 2, 3].map((_, i) => (
          <div className="homepage-avatar" key={i}>
            <Skeleton variant="circular" width={76} height={76} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {universities.map(
        (university, i) =>
          i < 3 && (
            <Link
              className="homepage-avatar plain-link"
              href={`/university/${university.slug}`}
              key={i}
            >
              <Avatar
                className="avatar-image"
                alt={university.name}
                src={university.image}
                sx={{
                  width: 76,
                  height: 76,
                }}
              />
            </Link>
          ),
      )}
    </div>
  );
}
