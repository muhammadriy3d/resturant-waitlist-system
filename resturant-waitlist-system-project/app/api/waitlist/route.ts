import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { registerWaitlistEntry, validateWaitlistInput } from "@/app/waitlist/_lib/waitlist";

export async function POST(request: Request) {
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
    return NextResponse.json({ error: "Invalid waitlist request." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const validated = validateWaitlistInput(input.name, input.partySize);
  if (!validated.success) {
    return NextResponse.json({ error: validated.message }, { status: 400 });
  }

  const ticket = registerWaitlistEntry(validated.name, validated.partySize);
  revalidatePath("/staff");
  return NextResponse.json(
    { ticket, name: validated.name, partySize: validated.partySize },
    { status: 201 },
  );
}
