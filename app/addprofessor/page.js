import AddProfessor from "./AddProfessor";

export const metadata = {
  title: "Add Professor",
  description:
    "Add a new professor to RateYourProfessor. Help other students by sharing details and enabling reviews and ratings for faculty members.",
  keywords: [
    "add professor",
    "submit professor",
    "faculty registration",
    "professor details",
    "RateYourProfessor",
    "RateMyProfessors",
    "college faculty",
  ],
};

const page = () => {
  return <AddProfessor />;
};

export default page;
