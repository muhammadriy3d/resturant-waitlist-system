import { NextRequest, NextResponse } from "next/server";
import { repositories } from "@/database";
import {
  createStaffToken,
} from "@/app/staff/_lib/auth";
import { verifyPassword } from "@/app/staff/_lib/password";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    throw error;
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid login request." }, { status: 400 });
  }

  const credentials = body as Record<string, unknown>;
  const username =
    typeof credentials.username === "string"
      ? credentials.username.trim().toLowerCase()
      : "";
  const password =
    typeof credentials.password === "string" ? credentials.password : "";
  if (!username || username.length > 80 || !password || password.length > 1024) {
    return NextResponse.json(
      { error: "Username or password is incorrect." },
      { status: 401 },
    );
  }

  const staff = repositories.users.findStaffByUsername(username);

  if (!staff || !verifyPassword(password, staff.passwordHash)) {
    return NextResponse.json(
      { error: "Username or password is incorrect." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    staff: {
      id: staff.id,
      name: staff.name,
      username: staff.username,
      role: staff.role,
    },
  });
  response.cookies.set("staff-session", createStaffToken(staff.id), {
    httpOnly: true,
    maxAge: 8 * 60 * 60,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
