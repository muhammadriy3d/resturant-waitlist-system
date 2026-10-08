"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/_components/button";
import Card from "@/app/_components/card";
import {
  registerGuest,
  type RegisterGuestState,
} from "../_actions/register-guest";

const initialState: RegisterGuestState = { message: "", success: false };

export default function WaitlistCard() {
  const router = useRouter();
  const handledSuccess = useRef(false);
  const [state, formAction, isPending] = useActionState(
    registerGuest,
    initialState,
  );

  useEffect(() => {
    if (
      !state.success ||
      state.ticket === undefined ||
      handledSuccess.current
    ) {
      return;
    }

    handledSuccess.current = true;
    router.push(`/waitlist/results?ticket=${state.ticket}`);
  }, [router, state.success, state.ticket]);

  return (
    <Card>
      <div className="mb-8">
        <h2 className="mt-3 font-serif text-3xl tracking-tight text-stone-900">
          Let&apos;s get you a table.
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          Just a couple of details to get started.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <div>
          <label
            className="mb-2 block text-sm font-medium text-stone-800"
            htmlFor="name"
          >
            Your name
          </label>
          <input
            autoComplete="name"
            className="min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-base text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-800 focus:ring-4 focus:ring-emerald-900/10 disabled:opacity-50"
            id="name"
            maxLength={80}
            name="name"
            placeholder="e.g. Alex Morgan"
            required
            disabled={isPending}
          />
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-medium text-stone-800"
            htmlFor="partySize"
          >
            Party size
          </label>
          <input
            className="min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-base text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-800 focus:ring-4 focus:ring-emerald-900/10 disabled:opacity-50"
            id="partySize"
            max={20}
            min={1}
            name="partySize"
            placeholder="e.g. 2"
            required
            type="number"
            disabled={isPending}
          />
        </div>

        {isPending && (
          <p
            aria-live="polite"
            className="text-sm text-stone-600"
            role="status"
          >
            Assigning your ticket number...
          </p>
        )}

        {state.message && (
          <p
            aria-live="polite"
            className={`rounded-xl px-4 py-3 text-sm ${
              state.success
                ? "bg-emerald-50 text-emerald-900"
                : "bg-red-50 text-red-800"
            }`}
            role={state.success ? "status" : "alert"}
          >
            {state.message}
          </p>
        )}

        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? "Adding your party..." : "Join the waitlist"}
          {!isPending && (
            <svg
              aria-hidden="true"
              className="ml-2 size-4"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                d="M4 10h12m-5-5 5 5-5 5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
              />
            </svg>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs leading-5 text-stone-500">
        Your evening starts here. We can&apos;t wait to welcome you.
      </p>
    </Card>
  );
}
