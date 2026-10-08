import Link from "next/link";
import { cn } from "@/app/_lib/cn";

const linkButtonClassName =
  "inline-flex min-h-10 items-center justify-center rounded-xl bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 p-6 text-stone-900">
      <section className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-7 shadow-sm sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          A simpler way to welcome every guest.
        </h1>
        <p className="mt-4 mb-6 leading-relaxed text-stone-600">
          Your waitlist starts here. Keep things simple while you get set up.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/waitlist" className={linkButtonClassName}>
            Get started
          </Link>
          {/* Keep proxy auth redirects out of the App Router RSC stream. */}
          <a
            href="/staff"
            className={cn(
              linkButtonClassName,
              "bg-stone-200 text-stone-800 hover:bg-stone-300",
            )}
          >
            Staff dashboard
          </a>
        </div>
      </section>
    </main>
  );
}
