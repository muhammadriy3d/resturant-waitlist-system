import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to the staff login page
  if (pathname === "/staff/login") {
    return NextResponse.next();
  }

  const isApiRoute = pathname.startsWith("/api/");
  const secret = process.env.JWT_SECRET;
  const token = request.cookies.get("staff-session")?.value;

  let isAuthenticated = false;

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
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated) {
    // Return 401 JSON for API requests instead of redirecting
    if (isApiRoute) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    // Redirect frontend requests to the login page
    return NextResponse.redirect(new URL("/staff/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/staff/:path*", "/api/staff/:path*", "/api/auth/staff"],
};
