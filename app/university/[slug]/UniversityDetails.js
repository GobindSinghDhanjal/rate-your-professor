import styles from "./university.module.css";
import { Avatar } from "@mui/material";
import FilteredProfessors from "./FilteredProfessors";
import SearchBox from "@/app/components/SearchBox/SearchBox";
import TruncatedDescription from "../../components/TruncatedDescription/TruncatedDescription";

const UniversityDetails = ({ university, professors }) => {
  return (
    <div className="container">
      <div className="sub-container">
        <div className={styles.universityHeader}>
          <div className={styles.image}>
            <Avatar
              className={styles.universityImage}
              alt={university.name}
              src={university.image}
            />
          </div>
          <div className={styles.details}>
            <h2 className={styles.universityName}>{university.name}</h2>
            <TruncatedDescription text={university.description} />
          </div>
        </div>

        <SearchBox page="university" university={university} />

        {/* <FilteredProfessors universityId={university._id} /> */}
        <FilteredProfessors professors={professors} />
      </div>
    </div>
  );
};

export default UniversityDetails;
