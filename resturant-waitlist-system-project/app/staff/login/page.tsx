"use client";

import { useActionState, useState } from "react";
import { staffLogin, type StaffLoginState } from "../_actions/staff-login";

const initialState: StaffLoginState = {
  message: "",
  success: false,
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(staffLogin, initialState);

  return (
    <main className="grid min-h-screen place-items-center bg-stone-50 px-5 py-12 text-stone-900">
      <section className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-700">
          Restaurant
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Log in</h1>

        <form className="mt-6 space-y-5" action={formAction}>
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
            />
            <label className="mt-3 flex w-fit items-center gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(event) => setShowPassword(event.target.checked)}
                className="accent-emerald-800"
              />
              Show password
            </label>
          </div>

          {state.message && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mx-auto block min-h-11 w-full max-w-48 rounded-lg bg-emerald-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending ? "Logging in..." : "Log in"}
          </button>
        </form>
      </section>
    </main>
  );
}
