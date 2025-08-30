import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import TempProfessor from "@/app/models/TempProfessor";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, department, gender, title, college, university, subjects } =
      await req.json();
    await dbConnect();

    const subjectsArray = subjects.split(",");

    const newTempProfessor = new TempProfessor({
      name,
      department,
      gender,
      title,
      college,
      university,
      subjects: subjectsArray,
    });

    await newTempProfessor.save();

    // Send email notification using Resend's sandbox email
    await sendEmailNotification(newTempProfessor);

    return NextResponse.json(newTempProfessor);
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

async function sendEmailNotification(professor) {
  try {
    await resend.emails.send({
      from: process.env.NEXT_PUBLIC_RESEND_EMAIL,
      to: process.env.NEXT_PUBLIC_GMAIL,
      subject: "New Temp Professor Added",
      text: `A new temporary professor has been added:\n\nName: ${
        professor.name
      }\nDepartment: ${professor.department}\nCollege: ${
        professor.college
      }\nUniversity: ${
        professor.university
      }\nSubjects: ${professor.subjects.join(", ")}`,
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Email sending failed:", error);
  }
}

// DELETE a temporary professor
export async function DELETE(req) {
  try {
    const body = await req.json();
    if (body.passcode === process.env.NEXT_PUBLIC_PASSCODE) {
      await dbConnect();
      const tempProfessor = await TempProfessor.findById(body.id);

      if (!tempProfessor) {
        return NextResponse.json(
          { msg: "TempProfessor not found" },
          { status: 404 }
        );
      }

      await TempProfessor.deleteOne({ _id: body.id });
      return NextResponse.json({ msg: "TempProfessor removed" });
    } else {
      return NextResponse.json({ msg: "Incorrect passcode" }, { status: 403 });
    }
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
