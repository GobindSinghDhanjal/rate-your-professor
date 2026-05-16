import dbConnect from "@/app/utils/dbConnect";
import Professor from "@/app/models/Professor";
import College from "@/app/models/College";
import University from "@/app/models/University";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { universityId } = params;

  try {
    await dbConnect();

    // 1) Get college ids for the given university (ensure College.university is indexed)
    const collegeDocs = await College.find({ university: universityId })
      .select("_id")
      .lean()
      .exec();

    const collegeIds = collegeDocs.map((c) => c._id);
    if (collegeIds.length === 0) {
      return NextResponse.json([]);
    }

    // 2) Query professors whose college is in the set (server-side filter)
    // Use lean() for faster reads and project out heavy fields if not needed
    const professors = await Professor.find({ college: { $in: collegeIds } })
      .populate({ path: "college", populate: { path: "university" } })
      .collation({ locale: "en", strength: 1 })
      .sort({ name: 1 })
      .lean()
      .exec();

    return NextResponse.json(professors);
  } catch (error) {
    console.error("Error fetching professors:", error);
    return NextResponse.json(
      { message: "Error fetching professors" },
      { status: 500 }
    );
  }
}