import { NextRequest, NextResponse } from "next/server";
import { getStaffFromToken } from "@/app/staff/_lib/auth";

export function GET(request: NextRequest) {
  const staff = getStaffFromToken(request.cookies.get("staff-session")?.value);
  if (!staff) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  return NextResponse.json({ staff });
}
