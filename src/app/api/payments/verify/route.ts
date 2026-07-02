import { NextResponse } from "next/server";
import crypto from "crypto";

// Verifies a Razorpay payment signature server-side. This is what actually
// confirms a payment is real — the client-returned order/payment ids alone can
// be spoofed. Razorpay signs `${order_id}|${payment_id}` with your key secret;
// we recompute the HMAC-SHA256 and constant-time compare.
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || /^(your_|mock|xxx|placeholder)/i.test(secret)) {
    return NextResponse.json(
      { error: "Payment verification unavailable: RAZORPAY_KEY_SECRET is not configured." },
      { status: 503 }
    );
  }

  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { error: "Missing razorpay_order_id, razorpay_payment_id, or razorpay_signature" },
      { status: 400 }
    );
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  // Constant-time comparison to avoid timing attacks.
  const a = Buffer.from(expected);
  const b = Buffer.from(razorpay_signature);
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!valid) {
    return NextResponse.json({ verified: false, error: "Signature mismatch" }, { status: 400 });
  }

  // Payment is authentic. (Persist the successful order here once billing
  // records are wired to the DB — e.g. mark the user's plan active.)
  return NextResponse.json({ verified: true, paymentId: razorpay_payment_id });
}
