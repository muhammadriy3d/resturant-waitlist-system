import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getStaffFromToken } from "./_lib/auth";
import { getWaitlistEntries } from "@/app/waitlist/_lib/waitlist";

export default function StaffPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-screen max-w-2xl bg-stone-50 px-5 py-12 text-stone-500">
          Loading staff waitlist...
        </main>
      }
    >
      <StaffDashboard />
    </Suspense>
  );
}

async function StaffDashboard() {
  // Opt into dynamic rendering for incoming HTTP request context (not a database connection)
  await connection();
  const cookieStore = await cookies();
  const staff = getStaffFromToken(cookieStore.get("staff-session")?.value);
  if (!staff) {
    redirect("/staff/login");
  }

  const entries = getWaitlistEntries();

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-stone-50 px-5 py-12 text-stone-900">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-700">
          Restaurant staff
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Waiting parties
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Signed in as {staff.name}
        </p>
      </header>
      <ol className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        {entries.length === 0 ? (
          <li className="px-5 py-8 text-center text-stone-500">
            No parties are waiting.
          </li>
        ) : (
          entries.map((entry) => (
            <li
              key={entry.ticket}
              className="flex items-center justify-between gap-4 border-b border-stone-100 px-5 py-4 last:border-0"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-800">
                  {entry.ticket}
                </span>
                <div>
                  <p className="font-medium">{entry.name}</p>
                  <p className="mt-1 text-sm text-stone-500">
                    {entry.partySize}{" "}
                    {entry.partySize === 1 ? "guest" : "guests"} · Joined{" "}
                    {entry.createdAt}
                  </p>
                </div>
              </div>
            </li>
          ))
        )}
      </ol>
    </main>
  );
}
