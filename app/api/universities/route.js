// app/api/universities/route.js

import dbConnect from "@/app/utils/dbConnect";
import University from "@/app/models/University";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, description } = await req.json();

    // Create a new University document
    const university = new University({ name, description });
    await university.save();

    return NextResponse.json(university, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    await dbConnect();

    const universities = await University.find()
      .select("_id name description image slug city state country universityType abbreviation")
      .collation({ locale: "en", strength: 1 })
      .sort({ name: 1 });

    return NextResponse.json(universities);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
