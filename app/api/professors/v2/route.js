import dbConnect from "@/app/utils/dbConnect";
import Professor from "@/app/models/Professor";
import Count from "@/app/models/Count";
import College from "@/app/models/College";
import University from "@/app/models/University";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = 20;
    const skip = (page - 1) * limit;

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
      .sort({ name: 1 }) // or { createdAt: -1 }
      .skip(skip)
      .limit(limit)
      .lean();

    await Count.findOneAndUpdate(
      {},
      { $inc: { count: 1 } },
      { new: true, upsert: true },
    );

    return NextResponse.json(
      {
        success: true,
        data: professors,
        meta: {
          page,
          limit,
          returned: professors.length,
          hasMore: professors.length === limit,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch professors.",
      },
      { status: 500 },
    );
  }
}
