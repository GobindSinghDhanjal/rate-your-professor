import dbConnect from "@/app/utils/dbConnect";
import Professor from "@/app/models/Professor";
import College from "@/app/models/College";
import University from "@/app/models/University";

export const getProfessorById = async (id) => {
  await dbConnect();

  return Professor.findById(id).populate({
    path: "college",
    select: "name university -_id",
    populate: {
      path: "university",
      select: "name slug",
    },
  });
};
