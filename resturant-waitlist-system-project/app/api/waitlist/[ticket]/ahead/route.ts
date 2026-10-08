import { NextResponse } from "next/server";
import { getPartiesAhead } from "@/app/waitlist/_lib/waitlist";

const noStoreHeaders = { "Cache-Control": "no-store, max-age=0" };

export function GET(
  _request: Request,
  context: { params: Promise<{ ticket: string }> },
) {
  return context.params.then(({ ticket: rawTicket }) => {
    if (!/^[1-9]\d*$/.test(rawTicket)) {
      return NextResponse.json(
        { error: "Ticket must be a whole number greater than 0." },
        { status: 400, headers: noStoreHeaders },
      );
    }

    const ticket = Number(rawTicket);
    if (!Number.isSafeInteger(ticket)) {
      return NextResponse.json(
        { error: "Ticket must be a whole number greater than 0." },
        { status: 400, headers: noStoreHeaders },
      );
    }

    const ahead = getPartiesAhead(ticket);
    if (ahead === null) {
      return NextResponse.json(
        { error: "Ticket not found." },
        { status: 404, headers: noStoreHeaders },
      );
    }

    return NextResponse.json({ ticket, ahead }, { headers: noStoreHeaders });
  });
}
