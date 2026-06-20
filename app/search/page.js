import SearchPage from "../components/SearchPage/SearchPage";

export const metadata = {
  title: "Search Professors — RateYourProfessor",
  description:
    "Search and discover professors across India's top universities.",
};

async function getUniversities() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/universities`, {
    next: { revalidate: 1728000 },
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function Search() {
  const universities = await getUniversities();

  return <SearchPage universities={universities} />;
}
