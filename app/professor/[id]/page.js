import ProfessorPage from "./ProfessorPage";

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors`,
      { next: { revalidate: 60 } },
    );
    const data = await res.json();

    return data.map((prof) => ({
      id: prof._id,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors/${id}`,
      { next: { revalidate: 60 } },
    );

    if (!response.ok) {
      throw new Error("Professor not found");
    }

    const professor = await response.json();

    return {
      title: `${professor.name} | ${professor.college.name}`,
      description: `Read reviews and ratings for ${professor.name}, a professor at ${professor.college.name}, ${professor.college.university.name}.`,
      keywords: `${professor.name}, ${professor.college.name}, professor reviews, rate professors, rate my professor, student reviews, professor feedback, professor ratings India, university professors, college faculty reviews`,
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
      openGraph: {
        title: `${professor.name} | ${professor.college.name}`,
        description: `Read reviews and ratings for ${professor.name}, a professor at ${professor.college.name}, ${professor.college.university.name}.`,
        images: [`${professor.image}`],
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/professor/${professor._id}`,
        type: "profile",
        siteName: "Rate Your Professor",
      },
    };
  } catch (error) {
    console.error("Error fetching professor metadata:", error);
    return {
      title: "Error Loading Professor",
      description: "Unable to retrieve professor details.",
    };
  }
}

async function getProfessor(id) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors/${id}`,
      {
        cache: "no-store",
      },
    );
    if (!response.ok) throw new Error("Professor not found");
    return await response.json();
  } catch (error) {
    console.error("Error fetching professor:", error);
    return null;
  }
}

export default async function ProfessorPageWrapper({ params }) {
  const { id } = params;
  const professor = await getProfessor(id);

  if (!professor) {
    return <div>Professor not found</div>;
  }

  return <ProfessorPage prof={professor} />;
}
