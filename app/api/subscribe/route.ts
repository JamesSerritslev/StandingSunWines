import { NextResponse } from "next/server"

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof (body as { email: unknown }).email === "string"
      ? (body as { email: string }).email.trim()
      : ""

  const firstName =
    typeof body === "object" &&
    body !== null &&
    "firstName" in body &&
    typeof (body as { firstName: unknown }).firstName === "string"
      ? (body as { firstName: string }).firstName.trim()
      : ""

  const lastName =
    typeof body === "object" &&
    body !== null &&
    "lastName" in body &&
    typeof (body as { lastName: unknown }).lastName === "string"
      ? (body as { lastName: string }).lastName.trim()
      : ""

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  const API_KEY = process.env.MAILCHIMP_API_KEY
  const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID
  const SERVER = process.env.MAILCHIMP_SERVER

  if (!API_KEY || !AUDIENCE_ID || !SERVER) {
    return NextResponse.json(
      { error: "Newsletter signup is temporarily unavailable." },
      { status: 503 },
    )
  }

  const url = `https://${SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `apikey ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName || "",
        LNAME: lastName || "",
      },
    }),
  })

  const data = (await response.json()) as {
    title?: string
    detail?: string
  }

  if (!response.ok) {
    if (data.title === "Member Exists") {
      return NextResponse.json(
        { error: "You are already subscribed." },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { error: data.detail || "Something went wrong" },
      { status: 400 },
    )
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
