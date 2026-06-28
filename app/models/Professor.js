// models/Professor.js
import mongoose from "mongoose";
import slugify from "slugify";

const feedbackSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  date: {
    type: Date,
    default: () =>
      new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      ),
  },
});

const professorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  title: {
    type: String,
    enum: [
      "Assistant Professor",
      "Associate Professor",
      "Professor",
      "Ph.D. Scholar",
    ],
    required: true,
  },
  image: { type: String },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  date: {
    type: Date,
    default: () =>
      new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      ),
  },
  subjects: [{ type: String }], // Array of subjects the professor teaches
  averageRating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  averageClarity: {
    type: Number,
    default: 0,
  },
  averageHelpfulness: {
    type: Number,
    default: 0,
  },
  averageFairness: {
    type: Number,
    default: 0,
  },
  feedbacks: [feedbackSchema], // Array of feedback objects
});

professorSchema.pre("save", async function (next) {
  if (!this.isNew && !this.isModified("name")) {
    return next();
  }

  const Professor = mongoose.model("Professor");

  const baseSlug = slugify(this.name, {
    lower: true,
    strict: true,
  });

  let slug = baseSlug;
  let counter = 2;

  while (
    await Professor.findOne({
      slug,
      _id: { $ne: this._id },
    })
  ) {
    slug = `${baseSlug}-${counter++}`;
  }

  this.slug = slug;

  next();
});

// module.exports = mongoose.model("Professor", professorSchema);
const Professor =
  mongoose.models.Professor || mongoose.model("Professor", professorSchema);

export default Professor;
