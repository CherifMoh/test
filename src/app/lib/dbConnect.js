import mongoose from "mongoose";

const connection = {
  isConnected: false,
};

export async function dbConnect(domain) {
  // Normalize domain parameter
  if (!domain || domain === "undefined") {
    domain = "global";
  }

  // Check if already connected to the same domain
  if (connection.isConnected && mongoose.connection.db.databaseName === domain) {
    return;
  }

  try {

    if (connection.isConnected) {
      await mongoose.connection.close();
      connection.isConnected = false;
    }

    // Extract the base URI and append the domain as the database name
    const baseUri = process.env.MongoDB_URI.split("?")[0]; // Get the URI before the query params
    const queryParams = process.env.MongoDB_URI.split("?")[1]; // Get the query params
    const dbUri = `${baseUri}${domain || "global"}?${queryParams}`; // Construct the new URI
    const db = await mongoose.connect(dbUri);

    connection.isConnected = db.connections[0].readyState === 1;
    console.log(`MongoDB connected successfully to ${domain}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB: " + error.message);
  }
}
