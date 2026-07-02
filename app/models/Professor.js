// models/Professor.js
import mongoose from "mongoose";
import slugify from "slugify";

const feedbackSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5, required: true }, // always required
  clarity: { type: Number, min: 1, max: 5 }, // optional — legacy data may not have this
  helpfulness: { type: Number, min: 1, max: 5 }, // optional — legacy data may not have this
  fairness: { type: Number, min: 1, max: 5 }, // optional — legacy data may not have this
  comment: { type: String },
  courseTaken: { type: String },
  wouldRecommend: { type: Boolean },
  isAnonymous: { type: Boolean, default: true },
  date: {
    type: Date,
    default: () =>
      new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
      ),
  },
});

const professorSchema = new mongoose.Schema(
  {
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
    imageAlt: { type: String },
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

    // SEO / discovery fields
    seoTitle: { type: String },
    seoDescription: { type: String, maxlength: 300 },
    bio: { type: String },
    keywords: [{ type: String }],
    profileUrl: { type: String },
    isVerified: { type: Boolean, default: false },

    // Aggregate stats (derived from feedbacks — recalculated in pre-save hook below)
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    averageClarity: { type: Number, default: 0 },
    averageHelpfulness: { type: Number, default: 0 },
    averageFairness: { type: Number, default: 0 },

    feedbacks: [feedbackSchema],
  },
  { timestamps: true }, // adds createdAt/updatedAt in addition to `date`
);

// Text index for search/discovery
professorSchema.index({
  name: "text",
  department: "text",
  subjects: "text",
});

// Common query patterns
professorSchema.index({ college: 1, department: 1 });
professorSchema.index({ averageRating: -1 });

// Slug generation
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

// Recalculate aggregate stats whenever feedbacks change.
// Single source of truth — do NOT also call a manual stats-update
// function before .save(), this hook already handles it.
professorSchema.pre("save", function (next) {
  if (!this.isModified("feedbacks")) return next();

  const ratingCount = this.feedbacks.length;

  if (ratingCount === 0) {
    this.averageRating = 0;
    this.averageClarity = 0;
    this.averageHelpfulness = 0;
    this.averageFairness = 0;
    this.reviewCount = 0;
    return next();
  }

  const sums = this.feedbacks.reduce(
    (acc, f) => {
      acc.rating += f.rating || 0;

      if (typeof f.clarity === "number") {
        acc.clarity += f.clarity;
        acc.clarityCount++;
      }
      if (typeof f.helpfulness === "number") {
        acc.helpfulness += f.helpfulness;
        acc.helpfulnessCount++;
      }
      if (typeof f.fairness === "number") {
        acc.fairness += f.fairness;
        acc.fairnessCount++;
      }

      return acc;
    },
    {
      rating: 0,
      clarity: 0,
      clarityCount: 0,
      helpfulness: 0,
      helpfulnessCount: 0,
      fairness: 0,
      fairnessCount: 0,
    },
  );

  this.averageRating = +(sums.rating / ratingCount).toFixed(2);
  this.averageClarity = sums.clarityCount
    ? +(sums.clarity / sums.clarityCount).toFixed(2)
    : 0;
  this.averageHelpfulness = sums.helpfulnessCount
    ? +(sums.helpfulness / sums.helpfulnessCount).toFixed(2)
    : 0;
  this.averageFairness = sums.fairnessCount
    ? +(sums.fairness / sums.fairnessCount).toFixed(2)
    : 0;
  this.reviewCount = ratingCount;

  next();
});

const Professor =
  mongoose.models.Professor || mongoose.model("Professor", professorSchema);

export default Professor;
