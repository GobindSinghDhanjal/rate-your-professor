// app/api/universities/[slug]/route.js

import dbConnect from "@/app/utils/dbConnect";
import University from "@/app/models/University";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { slug } = params;

  try {
    await dbConnect();

    const university = await University.findOne({ slug });

    if (!university) {
      return NextResponse.json(
        { message: "University not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(university);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const { slug } = params;
  const { name, description } = await req.json();

  try {
    await dbConnect();

    const university = await University.findOne({ slug });

    if (!university) {
      return NextResponse.json(
        { message: "University not found" },
        { status: 404 },
      );
    }

    if (name != null) university.name = name;
    if (description != null) university.description = description;

    const updatedUniversity = await university.save();

    return NextResponse.json(updatedUniversity);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const { slug } = params;

  try {
    await dbConnect();

    const university = await University.findOne({ slug });

    if (!university) {
      return NextResponse.json(
        { message: "University not found" },
        { status: 404 },
      );
    }

    await University.deleteOne({ _id: university._id });

    return NextResponse.json({
      message: "University deleted",
    });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
