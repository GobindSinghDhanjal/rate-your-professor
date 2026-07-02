import { getProfessorBySlugOrId } from "@/app/utils/getProfessor";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  try {
    const professor = await getProfessorBySlugOrId(params.slug);

    if (!professor) {
      return NextResponse.json(
        { success: false, message: "Professor not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      professor,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}
