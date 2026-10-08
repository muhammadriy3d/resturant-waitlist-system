"use server";

import { revalidatePath } from "next/cache";
import {
  registerWaitlistEntry,
  validateWaitlistInput,
} from "../_lib/waitlist";

export type RegisterGuestState = {
  message: string;
  success: boolean;
  ticket?: number;
};

export async function registerGuest(
  _previousState: RegisterGuestState,
  formData: FormData,
): Promise<RegisterGuestState> {
  const validated = validateWaitlistInput(
    formData.get("name"),
    formData.get("partySize"),
  );
  if (!validated.success) {
    return { message: validated.message, success: false };
  }

  const ticket = registerWaitlistEntry(validated.name, validated.partySize);
  revalidatePath("/staff");

  return {
    message: "Your party has been added to the waitlist.",
    success: true,
    ticket,
  };
}
