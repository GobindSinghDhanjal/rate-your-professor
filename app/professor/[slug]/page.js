import { permanentRedirect } from "next/navigation";
import ProfessorPage from "./ProfessorPage";

function isObjectId(value) {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

export const dynamicParams = true; // allow IDs not covered by generateStaticParams

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors`,
      { next: { revalidate: 60 } },
    );
    const data = await res.json();

    return data.map((prof) => ({
      slug: prof.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/v2/professors/${slug}`,
      { next: { revalidate: 60 } },
    );

    if (!response.ok) {
      throw new Error("Professor not found");
    }

    const data = await response.json();
    const professor = data.professor;

    return {
      title: `${professor.name} | ${professor.college.name}`,
      description: `Read reviews and ratings for ${professor.name}, a professor at ${professor.college.name}, ${professor.college.university.name}.`,
      keywords: `${professor.name}, ${professor.college.name}, professor reviews, rate professors, rate my professor, student reviews, professor feedback, professor ratings Asia, university professors, college faculty reviews`,
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
      openGraph: {
        title: `${professor.name} | ${professor.college.name}`,
        description: `Read reviews and ratings for ${professor.name}, a professor at ${professor.college.name}, ${professor.college.university.name}.`,
        images: [`${professor.image}`],
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/professor/${professor.slug}`,
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

async function getProfessor(slug) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/v2/professors/${slug}`,
      { next: { revalidate: 60 } },
    );
    if (!response.ok) throw new Error("Professor not found");
    const data = await response.json();
    return data.professor;
  } catch (error) {
    console.error("Error fetching professor:", error);
    return null;
  }
}

export default async function ProfessorPageWrapper({ params }) {
  const { slug } = await params;
  const professor = await getProfessor(slug);

  if (!professor) {
    return <div>Professor not found</div>;
  }

  // Old ID-style URL — send the browser to the canonical slug URL
  if (isObjectId(slug) && professor.slug) {
    permanentRedirect(`/professor/${professor.slug}`);
  }

  return <ProfessorPage prof={professor} />;
}
