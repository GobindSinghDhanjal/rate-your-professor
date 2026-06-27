import dbConnect from "@/app/utils/dbConnect";
import University from "@/app/models/University";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const universities = await University.find()
      .select(
        "name description image slug city state country universityType abbreviation",
      )
      .collation({ locale: "en", strength: 1 })
      .sort({ name: 1 })
      .limit(3);
    return NextResponse.json(universities);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
