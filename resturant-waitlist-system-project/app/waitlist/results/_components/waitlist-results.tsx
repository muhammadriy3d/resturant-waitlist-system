"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function WaitlistResults() {
  const searchParams = useSearchParams();
  const rawTicket = searchParams.get("ticket");
  const isValidTicket = rawTicket !== null && /^[1-9]\d*$/.test(rawTicket);
  const ticket = isValidTicket ? Number(rawTicket) : 0;
  const [lookup, setLookup] = useState<{
    ticket: number;
    ahead: number | null;
    failed: boolean;
  } | null>(null);

  useEffect(() => {
    if (!isValidTicket || !Number.isSafeInteger(ticket)) {
      return;
    }

    let stopped = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;

    async function refreshPosition() {
      controller = new AbortController();
      try {
        const response = await fetch(`/api/waitlist/${ticket}/ahead`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          setLookup({ ticket, ahead: null, failed: true });
        } else {
          const result: unknown = await response.json();
          if (
            typeof result === "object" &&
            result !== null &&
            "ahead" in result &&
            typeof result.ahead === "number" &&
            Number.isSafeInteger(result.ahead) &&
            result.ahead >= 0
          ) {
            setLookup({ ticket, ahead: result.ahead, failed: false });
          } else {
            setLookup({ ticket, ahead: null, failed: true });
          }
        }
      } catch (error: unknown) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setLookup({ ticket, ahead: null, failed: true });
        }
      } finally {
        if (!stopped) {
          timeout = setTimeout(refreshPosition, 5000);
        }
      }
    }

    void refreshPosition();
    return () => {
      stopped = true;
      if (timeout !== undefined) {
        clearTimeout(timeout);
      }
      controller?.abort();
    };
  }, [isValidTicket, ticket]);

  return (
    <div className="grid min-h-screen place-items-center bg-[#f7f5f0] px-6 text-stone-900">
      <section className="w-full max-w-md text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-emerald-800">
          Restaurant waitlist
        </p>
        {isValidTicket && Number.isSafeInteger(ticket) ? (
          <>
            <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
              You&apos;re on the list.
            </h1>
            <p className="mt-8 text-sm text-stone-600">Your ticket number</p>
            <p className="mt-1 font-serif text-7xl text-emerald-800">
              {ticket}
            </p>
            {lookup?.ticket !== ticket ? (
              <p className="mt-4 text-lg text-stone-700">
                Checking how many parties are ahead of you...
              </p>
            ) : lookup.failed || lookup.ahead === null ? (
              <p className="mt-4 text-lg text-rose-700">
                We couldn&apos;t look up this ticket. Please try again.
              </p>
            ) : (
              <p className="mt-4 text-lg text-stone-700">
                {lookup.ahead} {lookup.ahead === 1 ? "party" : "parties"} ahead
                of you
              </p>
            )}
            {lookup?.ticket === ticket && !lookup.failed && (
              <p className="mt-2 text-xs text-stone-500">
                Your position updates automatically.
              </p>
            )}
          </>
        ) : (
          <>
            <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
              No ticket found.
            </h1>
            <p className="mt-4 text-stone-600">
              Join the waitlist to receive a ticket number.
            </p>
            <Link
              className="mt-6 inline-block text-sm font-medium text-emerald-800 underline underline-offset-4"
              href="/waitlist"
            >
              Join the waitlist
            </Link>
          </>
        )}
      </section>
    </div>
  );
}
