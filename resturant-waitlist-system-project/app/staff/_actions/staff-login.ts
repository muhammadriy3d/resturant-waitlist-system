"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { repositories } from "@/database";
import { createStaffToken } from "../_lib/auth";
import { verifyPassword } from "../_lib/password";

export type StaffLoginState = {
  message: string;
  success: boolean;
};

export async function staffLogin(
  _previousState: StaffLoginState,
  formData: FormData,
): Promise<StaffLoginState> {
  const usernameRaw = formData.get("username");
  const passwordRaw = formData.get("password");

  const username =
    typeof usernameRaw === "string" ? usernameRaw.trim().toLowerCase() : "";
  const password = typeof passwordRaw === "string" ? passwordRaw : "";

  if (!username || username.length > 80 || !password || password.length > 1024) {
    return {
      message: "Username and password are required.",
      success: false,
    };
  }

  const staff = repositories.users.findStaffByUsername(username);

  if (!staff || !verifyPassword(password, staff.passwordHash)) {
    return {
      message: "Username or password is incorrect.",
      success: false,
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("staff-session", createStaffToken(staff.id), {
    httpOnly: true,
    maxAge: 8 * 60 * 60,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/staff");
}
