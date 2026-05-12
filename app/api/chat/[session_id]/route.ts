import { NextRequest } from "next/server";

const CHATBOT_URL = process.env.CHATBOT_URL ?? "http://localhost:8000";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ session_id: string }> },
) {
  const { session_id } = await params;
  const { message } = await request.json();
  const token = request.cookies.get("token")?.value ?? "";

  const upstream = await fetch(`${CHATBOT_URL}/chat/${session_id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // FastAPI merges multiple Pydantic body params by wrapping each in its param name.
    // token must be inside both nested objects so body.token is populated server-side.
    body: JSON.stringify({ request: { message, token }, body: { message, token } }),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return new Response(text, { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ session_id: string }> },
) {
  const { session_id } = await params;
  await fetch(`${CHATBOT_URL}/chat/${session_id}`, { method: "DELETE" });
  return Response.json({ cleared: true });
}
