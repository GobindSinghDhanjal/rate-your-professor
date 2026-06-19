import University from "@/app/models/University";
import dbConnect from "@/app/utils/dbConnect";
import { notFound } from "next/navigation";
import Professor from "@/app/models/Professor";
import College from "@/app/models/College";
import UniversityDetails from "./UniversityDetails";

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
    await dbConnect();

    // const universities = await University.find({}, "slug").lean();
    const universities = await University.find({}, { slug: 1, _id: 0 }).lean();

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
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/universities/${slug}`,
    // );
    // if (!response.ok) throw new Error("University not found");
    // return await response.json();
    await dbConnect();

    const university = await University.findOne({ slug }).lean();

    return JSON.parse(JSON.stringify(university));
  } catch (error) {
    console.error("Error fetching university:", error);
    return null;
  }
}

async function getProfessorsByUniversity(universityId) {
  try {
    await dbConnect();

    const collegeDocs = await College.find({ university: universityId })
      .select("_id")
      .lean();

    const collegeIds = collegeDocs.map((c) => c._id);

    if (!collegeIds.length) return [];

    const professors = await Professor.find({
      college: { $in: collegeIds },
    })
      .populate({
        path: "college",
        populate: { path: "university" },
      })
      .collation({ locale: "en", strength: 1 })
      .sort({ name: 1 })
      .lean();

    return JSON.parse(JSON.stringify(professors));
  } catch (error) {
    console.error("Error fetching professors:", error);
    return [];
  }
}

const Page = async ({ params }) => {
  const { slug } = await params;
  const university = await getUniversity(slug);

  if (!university) {
    return notFound();
  }

  const professors = await getProfessorsByUniversity(university._id);

  return <UniversityDetails university={university} professors={professors} />;
};

export default Page;
