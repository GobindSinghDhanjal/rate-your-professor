import Avatar from "@mui/material/Avatar";
import { Skeleton } from "@mui/material";
import styles from "./MostRatedProfessors.module.css";
import Link from "next/link";

export default function MostRatedProfessors({ props }) {

  if (!props || !props.length) {
    return (
      <div className={styles.container}>
        {[1, 2, 3].map((_, i) => (
          <div className="homepage-avatar" key={i}>
            <Skeleton variant="circular" width={76} height={76} />
            <Skeleton variant="text" width={76} height={20} />
            <Skeleton variant="text" width={76} height={20} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {props.map(
        (prop, i) =>
          i < 3 && (
            <Link
              className="homepage-avatar plain-link"
              href={`/professor/${prop._id}`}
              key={i}
            >
              <Avatar
                className="avatar-image"
                alt={prop.name}
                src={prop.image}
                sx={{
                  width: 76,
                  height: 76,
                }}
              />
              <p>{prop.name}</p>

              <p className={styles.ratingCount}>
                ({prop.feedbackCount} Rating{prop.feedbackCount !== 1 && "s"})
              </p>
            </Link>
          )
      )}
    </div>
  );
}
