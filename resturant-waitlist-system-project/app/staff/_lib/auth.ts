import { verify, sign, type JwtPayload } from "jsonwebtoken";
import { repositories } from "@/database";
import type { StaffUser } from "@/database/types";

export type { StaffUser } from "@/database/types";

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters.");
  }
  return secret;
}

export function createStaffToken(staffId: number): string {
  return sign({ role: "staff" }, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: "8h",
    subject: String(staffId),
  });
}

export function getStaffFromToken(token: string | undefined): StaffUser | null {
  if (!token) {
    return null;
  }

  let payload: string | JwtPayload;
  try {
    payload = verify(token, getJwtSecret(), { algorithms: ["HS256"] });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError" ||
        error.name === "NotBeforeError")
    ) {
      return null;
    }
    throw error;
  }

  if (
    typeof payload === "string" ||
    payload.role !== "staff" ||
    typeof payload.sub !== "string" ||
    !/^[1-9]\d*$/.test(payload.sub)
  ) {
    return null;
  }

  const staffId = Number(payload.sub);
  if (!Number.isSafeInteger(staffId)) {
    return null;
  }

  return repositories.users.findStaffById(staffId) ?? null;
}
