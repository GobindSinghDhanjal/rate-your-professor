import dbConnect from "@/app/utils/dbConnect";
import Professor from "@/app/models/Professor";
import College from "@/app/models/College";
import University from "@/app/models/University";
import { NextResponse } from "next/server";

export const POST = async (request, { params }) => {
  const { id } = params;

  try {
    const body = await request.json();

    const { overallRating, comment, course, year, difficulty, wouldTakeAgain } =
      body;

    if (!overallRating || overallRating <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Rating cannot be zero.",
        },
        { status: 400 },
      );
    }

    await dbConnect();

    const professor = await Professor.findById(id);

    if (!professor) {
      return NextResponse.json(
        {
          success: false,
          message: "Professor not found.",
        },
        { status: 404 },
      );
    }

    const submitFeedback = { rating: overallRating, comment };

    professor.feedbacks.push(submitFeedback);
    // Create new feedback
    // professor.feedbacks.push({
    //   overallRating,
    //   comment,
    //   course,
    //   year,
    //   difficulty,
    //   wouldTakeAgain,
    // });

    await professor.save();

    // Newly inserted review
    const feedback = professor.feedbacks[professor.feedbacks.length - 1];

    // return new Response(JSON.stringify(professor), { status: 201 });
    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully.",
        feedback,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 },
    );
  }
};
