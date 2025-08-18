import Avatar from "@mui/material/Avatar";
import { Rating, Skeleton } from "@mui/material";
import styles from "./TopUniversities.module.css";
import Link from "next/link";

export default function TopUniversities({ props }) {
  
  if (!props || !props.length) {
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
      {props.map(
        (prop, i) =>
          i < 3 && (
            <Link
              className="homepage-avatar plain-link"
              href={`/university/${prop._id}`}
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
              {prop.title && <p>{prop.name}</p>}

              {prop.title && (
                <Rating
                  name="read-only"
                  value={prop.averageRating}
                  precision={0.5}
                  sx={{ margin: "1px auto", fontSize: 16 }}
                  readOnly
                />
              )}
            </Link>
          )
      )}
    </div>
  );
}
