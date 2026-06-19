import ProfessorList from "@/app/components/ProfessorList/ProfessorList";

const FilteredProfessors = ({ professors }) => {
  if (!professors || professors.length === 0) {
    return <p>No professors found for this university.</p>;
  }

  return <ProfessorList props={professors} />;
};

export default FilteredProfessors;
