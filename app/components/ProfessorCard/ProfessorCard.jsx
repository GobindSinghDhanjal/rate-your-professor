import { Avatar, Rating } from "@mui/material";
import styles from "./ProfessorCard.module.css";
import avgRating from "../avgRatingUtil";
import Link from "next/link";

export default function ProfessorCard({ prop, onButtonClick }) {
  return (
    <Link
      className={`${styles.professorCard} plain-link`}
      href={`/professor/${prop._id}`}
    >
      <div className={styles.image}>
        <Avatar
          alt={prop.name}
          src={prop.image}
          sx={{ width: 70, height: 70 }}
        ></Avatar>
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
  );
}
