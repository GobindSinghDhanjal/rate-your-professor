import ProfRating from "@/app/ProfessorPage/[id]/ProfRating";
import { Avatar } from "@mui/material";
import styles from "./ProfessorProfile.module.css";

const ProfessorProfile = ({ professor }) => {
  return (
    <div className={styles.container}>
      <div className={styles.professorImage}>
        <Avatar
          className="professor-detail-avatar"
          alt={professor.name}
          src={professor.image}
        />
      </div>
      <div className={styles.professorDetails}>
        <h2>{professor.name}</h2>
        <p>{professor.title}</p>
        <hr />
        <h4>
          {professor.college.name}, {professor.college.university.name}
        </h4>

        <ProfRating id={professor._id} />
      </div>
    </div>
  );
};

export default ProfessorProfile;
