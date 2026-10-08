import { repositories } from "@/database";
import type { WaitlistEntry } from "@/database/types";

export type WaitlistInputResult =
  | { success: true; name: string; partySize: number }
  | { success: false; message: string };

export type { WaitlistEntry } from "@/database/types";

export function validateWaitlistInput(
  rawName: unknown,
  rawPartySize: unknown,
): WaitlistInputResult {
  if (typeof rawName !== "string") {
    return { success: false, message: "Please enter your name." };
  }

  const name = rawName
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!name) {
    return { success: false, message: "Please enter your name." };
  }
  if (name.length > 80) {
    return {
      success: false,
      message: "Your name must be 80 characters or fewer.",
    };
  }

  const partySizeText =
    typeof rawPartySize === "number"
      ? String(rawPartySize)
      : typeof rawPartySize === "string"
        ? rawPartySize.trim()
        : "";
  if (!/^[1-9]\d*$/.test(partySizeText)) {
    return {
      success: false,
      message: "Party size must be a whole number greater than 0.",
    };
  }

  const partySize = Number(partySizeText);
  if (!Number.isSafeInteger(partySize) || partySize > 20) {
    return {
      success: false,
      message: "Choose a party size between 1 and 20.",
    };
  }

  return { success: true, name, partySize };
}

export function registerWaitlistEntry(
  name: string,
  partySize: number,
): number {
  return repositories.waitlist.registerEntry(name, partySize);
}

export function getWaitlistEntry(ticket: number): WaitlistEntry | undefined {
  return repositories.waitlist.findEntry(ticket);
}

export function getPartiesAhead(ticket: number): number | null {
  return repositories.waitlist.countPartiesAhead(ticket);
}

export function getWaitlistEntries(): WaitlistEntry[] {
  return repositories.waitlist.listEntries();
}
