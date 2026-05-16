import dbConnect from "@/app/utils/dbConnect";
import Notification from "@/app/models/Notification";
import { authenticate } from "@/app/utils/authenticate";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 10;
    const cursor = searchParams.get("cursor") || null;

    let query = cursor ? { _id: { $lt: cursor } } : {};

    const notifications = await Notification.find(query)
      .sort({ _id: -1 }) // Always sort by _id descending
      .limit(limit)
      .lean(); // Convert Mongoose documents to plain objects

    const nextCursor = notifications.length
      ? notifications[notifications.length - 1]._id.toString()
      : null;

    return new Response(JSON.stringify({ data: notifications, nextCursor }), {
      status: 200,
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}

export async function POST(req) {
  try {
    authenticate(req);
    await dbConnect();

    const { title, message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { error: "Missing title or message" },
        { status: 400 }
      );
    }

    const newNotification = new Notification({ title: title || " ", message });
    await newNotification.save();

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
