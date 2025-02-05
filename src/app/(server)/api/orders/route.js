import { NextResponse } from "next/server";
import { dbConnect } from "../../../lib/dbConnect";
import Order from "../../models/orders";


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return NextResponse.json({ error: "Missing domain parameter" }, { status: 400 });
    }

    await dbConnect(domain);

    const result = await Order.find().sort({ _id: -1 });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Error: " + err.message }, { status: 500 });
  }
}
