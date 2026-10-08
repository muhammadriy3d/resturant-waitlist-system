import WaitlistCard from "./_components/waitlist-card";

export default function WaitlistRegisterPage() {
  return (
    <div className="min-h-screen bg-[#f7f5f0] text-stone-900">
      <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 pt-10 pb-16 sm:px-10 sm:pt-16 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20 lg:pt-20">
        <div className="max-w-xl">
          <h1 className="font-serif text-5xl leading-[1.08] tracking-tight text-stone-900 sm:text-6xl">
            Good things
            <br />
            are <span className="text-emerald-800 italic">gathering.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-stone-600 sm:text-lg">
            Add your party to the waitlist and we&apos;ll get your table ready as
            soon as we can.
          </p>
        </div>

        <div className="w-full max-w-lg justify-self-center lg:justify-self-end">
          <WaitlistCard />
        </div>
      </section>
    </div>
  );
}
