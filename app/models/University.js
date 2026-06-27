// models/University.js
import mongoose from "mongoose";
import slugify from "slugify";

const universitySchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    abbreviation: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
    },

    // Location
    city: {
      type: String,
      index: true,
    },

    state: {
      type: String,
      index: true,
    },

    country: {
      type: String,
      index: true,
    },

    address: {
      type: String,
    },

    // Establishment
    establishedYear: {
      type: Number,
      index: true,
    },

    // Contact
    website: String,
    contactEmail: String,
    contactPhone: String,

    // Academic Information
    accreditation: String,

    programsOffered: [
      {
        type: String,
      },
    ],

    departments: [
      {
        type: String,
      },
    ],

    degreesOffered: [
      {
        type: String,
      },
    ],

    // Classification
    universityType: {
      type: String,
      enum: ["Public", "Private", "Deemed", "Autonomous", "Other"],
    },

    // Campus
    campusSize: String,

    studentsEnrolled: Number,

    facultyCount: Number,

    // Rankings
    nirfRanking: Number,

    qsWorldRanking: Number,

    // Images
    image: String,

    bannerImage: String,

    logo: String,

    // Social Links
    facebook: String,
    instagram: String,
    linkedin: String,
    youtube: String,
    twitter: String,

    // Ratings & Statistics
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    totalProfessors: {
      type: Number,
      default: 0,
    },

    // Placement
    averagePackage: Number,

    highestPackage: Number,

    placementRate: Number,

    // Facilities
    campusFacilities: [String],

    // Popular Courses
    popularCourses: [String],

    // SEO
    metaTitle: String,

    metaDescription: String,

    keywords: [String],

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Created Date
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Auto-generate slug
universitySchema.pre("save", async function (next) {
  if (!this.isNew && !this.isModified("name")) {
    return next();
  }

  const University = mongoose.model("University");

  const baseSlug = slugify(this.name, {
    lower: true,
    strict: true,
  });

  let slug = baseSlug;
  let counter = 2;

  while (
    await University.findOne({
      slug,
      _id: { $ne: this._id },
    })
  ) {
    slug = `${baseSlug}-${counter++}`;
  }

  this.slug = slug;

  next();
});

const University =
  mongoose.models.University || mongoose.model("University", universitySchema);

export default University;

// module.exports = mongoose.model('University', universitySchema);
