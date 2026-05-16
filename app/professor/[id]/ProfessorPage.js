import StudentRating from "./StudentRating";
import ProfessorRating from "./ProfessorRating";
import ProfessorProfile from "@/app/components/ProfessorProfile/ProfessorProfile";

const ProfessorPage = ({ professor }) => {
  return (
    <>
      <div className="professor container">
        <div className="sub-container">
          <ProfessorProfile professor={professor} />

          <br />
          <hr />

          <ProfessorRating id={professor._id} />
          <br />
          <hr />

          <h3>Student Ratings</h3>
          <StudentRating professorId={professor._id} />
          
        </div>
      </div>
    </>
  );
};

export default ProfessorPage;
