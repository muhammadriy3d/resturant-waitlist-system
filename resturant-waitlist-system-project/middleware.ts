import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const secret = process.env.JWT_SECRET;
  const token = request.cookies.get("staff-session")?.value;

  let isValid = false;
  if (token && secret) {
    try {
      const payload = verify(token, secret, { algorithms: ["HS256"] });
      if (
        typeof payload === "object" &&
        payload !== null &&
        payload.role === "staff" &&
        typeof payload.sub === "string" &&
        /^[1-9]\d*$/.test(payload.sub)
      ) {
        isValid = true;
      }
    } catch {
      isValid = false;
    }
  }

  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");

  if (request.nextUrl.pathname === "/staff/login") {
    return NextResponse.next();
  }

  if (!isValid) {
    if (isApiRoute) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }
    return NextResponse.redirect(new URL("/staff/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/staff/:path*", "/api/staff/:path*", "/api/auth/staff"],
};
