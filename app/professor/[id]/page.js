import Professor from "@/app/models/Professor";
import ProfessorPage from "./ProfessorPage";
import dbConnect from "@/app/utils/dbConnect";
import College from "@/app/models/College";
import University from "@/app/models/University";

export async function generateStaticParams() {
  try {

    await dbConnect();

    const data = await Professor.find();

    return data.map((prof) => ({
      id: prof._id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    await dbConnect();

    const professor = await Professor.findById(id)
      .populate({
        path: "college",
        populate: {
          path: "university",
        },
      })
      .lean();

    if (!professor) {
      throw new Error("Professor not found");
    }

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
    await dbConnect();

    const professor = await Professor.findById(id)
      .populate({
        path: "college",
        populate: {
          path: "university",
        },
      })
      .lean();

    return professor;
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

  return <ProfessorPage professor={professor} />;
}
