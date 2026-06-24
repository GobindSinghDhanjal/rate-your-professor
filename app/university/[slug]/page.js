import { notFound } from "next/navigation";
import UniversityDetailPage from "./UniversityDetailPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const university = await getUniversity(slug);

  if (!university) {
    return {
      title: "University not found",
      description: "The requested university does not exist.",
    };
  }

  return {
    title: `${university?.name}`,
    description:
      `${university?.description}` ||
      `Read reviews and ratings for ${university.name}, a university in ${university.city}, ${university.state}.`,
    keywords: `${university?.name}, ${university?.city}, ${university?.state}, ${university?.establishedYear}, university reviews, rate universities, student reviews, university feedback, university ratings India, college professors, faculty reviews`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
    openGraph: {
      title: `${university?.name} | ${university?.city}, ${university?.state}`,
      description: `Read reviews and ratings for ${university?.name}, a university in ${university?.city}, ${university?.state}.`,
      images: [`${university?.image}`],
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/university/${university.slug}`,
      type: "website",
      siteName: "Rate Your Professor",
    },
  };
}

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/universities`,
    );
    const universities = await res.json();

    return universities.map((university) => ({
      slug: university.slug,
    }));
  } catch (error) {
    console.error("Error fetching universities for static params:", error);
    return [];
  }
}

async function getUniversity(slug) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/universities/${slug}`,
      {
        next: { revalidate: 60 },
      },
    );
    if (!response.ok) throw new Error("University not found");
    return await response.json();
  } catch (error) {
    console.error("Error fetching university:", error);
    return null;
  }
}

async function getProfessorsByUniversity(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors/byUniversity/${id}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return [];
  }
}

const Page = async ({ params }) => {
  const { slug } = await params;
  const university = await getUniversity(slug);

  if (!university) {
    return (
      <div>
        <h1>University not found</h1>
        <p>Please check the URL or go back to the homepage.</p>
      </div>
    );
  }

  const professors = await getProfessorsByUniversity(university._id);

  return (
    <UniversityDetailPage university={university} professors={professors} />
  );
};

export default Page;
