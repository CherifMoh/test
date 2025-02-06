import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/dbConnect";
import Order from "../../models/orders";


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.nextUrl);
    const domain = searchParams.get("domain");
    const fields = searchParams.get("fields");

    if (!domain) {
      return NextResponse.json({ error: "Missing domain parameter" }, { status: 400 });
    }

    await dbConnect(domain);

    let result;
    if (fields) {
      // Convert space/comma separated fields string to object format for MongoDB
      const fieldSelection = fields.split(/[\s,]+/).reduce((acc, field) => {
        acc[field.trim()] = 1;
        return acc;
      }, {});
      
      result = await Order.find()
        .select(fieldSelection)
        .sort({ _id: -1 });
    } else {
      // If no fields specified, return all fields
      result = await Order.find().sort({ _id: -1 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Error: " + err.message }, { status: 500 });
  }
}
