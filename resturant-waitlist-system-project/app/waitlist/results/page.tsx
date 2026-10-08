import { Suspense } from "react";
import WaitlistResults from "./_components/waitlist-results";

export default function WaitlistResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-[#f7f5f0] text-stone-600">
          Loading your position...
        </div>
      }
    >
      <WaitlistResults />
    </Suspense>
  );
}
