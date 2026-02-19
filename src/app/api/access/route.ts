import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
} as const;

function jsonResponse(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: NO_STORE_HEADERS,
  });
}

export async function POST(request: Request) {
  const expectedCode = process.env.CODE;

  if (!expectedCode) {
    return jsonResponse(
      {
        authorized: false,
        message: "Access code is not configured",
      },
      500,
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse(
      {
        authorized: false,
        message: "Invalid request payload",
      },
      400,
    );
  }

  const code =
    typeof payload === "object" &&
    payload !== null &&
    "code" in payload &&
    typeof payload.code === "string"
      ? payload.code
      : "";

  if (!code) {
    return jsonResponse(
      {
        authorized: false,
        message: "Code is required",
      },
      400,
    );
  }

  if (code !== expectedCode) {
    return jsonResponse(
      {
        authorized: false,
        message: "Invalid code",
      },
      401,
    );
  }

  return jsonResponse({ authorized: true }, 200);
}
