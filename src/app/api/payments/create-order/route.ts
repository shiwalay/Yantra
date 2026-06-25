import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "mock_key_id",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "mock_key_secret",
    });

    const { amount, currency = "INR" } = await req.json();

    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency,
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });

    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
