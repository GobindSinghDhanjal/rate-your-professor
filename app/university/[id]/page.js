import { notFound } from "next/navigation";
import University from "./University";

export async function generateMetadata({ params }) {
  const university = await getUniversity(params.id);

  if (!university) {
    return {
      title: "University not found",
      description: "The requested university does not exist.",
    };
  }

  return {
    title: `${university.name}`,
    description: `${university.description}`,
    openGraph: {
      title: `${university.name}`,
      description: `${university.description}`,
      images: [
        {
          url: university.image || "/default-university-image.jpg", // fallback image
          width: 1200,
          height: 630,
          alt: `${university.name} Image`,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/universities`
    );
    const universities = await res.json();

    return universities.map((university) => ({
      id: university._id,
    }));
  } catch (error) {
    console.error("Error fetching universities for static params:", error);
    return [];
  }
}

async function getUniversity(id) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/universities/${id}`
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
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return [];
  }
}

const Page = async ({ params }) => {
  const { id } = await params;
  const university = await getUniversity(id);
  const professors = await getProfessorsByUniversity(id);

  if (!university) {
    return (
      <div>
        <h1>University not found</h1>
        <p>Please check the URL or go back to the homepage.</p>
      </div>
    );
  }

  return <University university={university} professors={professors} />;
};

export default Page;
