// app/lib/getProfessors.js

import dbConnect from "@/app/utils/dbConnect";
import Professor from "@/app/models/Professor";

export async function getProfessors() {
  try {
    await dbConnect();

    const professors = await Professor.find()
      .populate({
        path: "college",
        select: "name",
        populate: {
          path: "university",
          select: "name",
        },
      })
      .select(
        "name title image department createdAt updatedAt college university feedbacks",
      )
      .lean();

    return JSON.parse(JSON.stringify(professors));
  } catch (err) {
    console.error("Error fetching professors:", err);
    return []; // fallback
  }
}
