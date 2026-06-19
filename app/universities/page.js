import UniversityPage from "./UniversityPage";

export const metadata = {
  title: "Universities",
  description:
    "Browse a list of universities on RateYourProfessor and explore student reviews and ratings to help you make informed academic decisions.",
  keywords: [
    "universities",
    "student reviews",
    "professor ratings",
    "university list",
    "college feedback",
    "RateYourProfessor",
    "RateMyProfessor",
  ],
};

async function getUniversities() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/universities`,
      {
        next: { revalidate: 3600 }, // cache for 1 hour
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch universities");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching universities:", error);
    return [];
  }
}

export default async function Page() {
  const universities = await getUniversities();

  return <UniversityPage universities={universities} />;
}
