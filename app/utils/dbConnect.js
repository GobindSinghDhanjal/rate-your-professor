import mongoose from "mongoose";

let isConnected = false; // Track connection state

// Regular database connection handler
const dbConnect = async () => {
  if (isConnected) {
    console.log("Database is already connected.");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI);

    isConnected = db.connections[0].readyState;
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw new Error(error);
  }
};

// Forced reconnect function for real-time data
export const forceReconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from DB");
    await dbConnect(); // Reconnect after disconnect
    console.log("Reconnected to DB");
  } catch (error) {
    console.error("Forced reconnect failed:", error.message);
  }
};

export default dbConnect;
