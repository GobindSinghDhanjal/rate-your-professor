import dbConnect from "@/app/utils/dbConnect";
import Professor from "@/app/models/Professor";
import College from "@/app/models/College";
import University from "@/app/models/University";

function isObjectId(value) {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

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

export const getProfessorBySlug = async (slug) => {
  await dbConnect();

  return Professor.findOne({ slug }).populate({
    path: "college",
    select: "name university -_id",
    populate: {
      path: "university",
      select: "name slug",
    },
  });
};

export const getProfessorBySlugOrId = async (param) => {
  await dbConnect();

  if (isObjectId(param)) {
    return getProfessorById(param);
  }

  return getProfessorBySlug(param);
};
