import { redirect } from "next/navigation";
import { Globe2, ListChecks, Medal, Timer } from "lucide-react";
import { auth, signIn } from "@/auth";
import { Logo } from "@/components/logo";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/overview");

  return (
    <main className="relative isolate flex min-h-dvh flex-col overflow-hidden">
      {/* backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60 dark:opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, var(--accent-soft), transparent 45%), radial-gradient(circle at 85% 60%, var(--half-soft), transparent 40%)",
        }}
      />
      <RouteDecoration />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <Logo />
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pb-16">
        <p className="chip-full mb-5 w-fit">Half &amp; full marathons</p>
        <h1 className="font-display max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Every finish line you&apos;ve crossed, <span className="text-accent">on one map.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted">
          Log your races with date, bib number and finish time. Watch your personal running world fill up — one
          pin at a time.
        </p>

        <form
          className="mt-9"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/overview" });
          }}
        >
          <button type="submit" className="btn-secondary px-5 py-3 text-base shadow-card">
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        <ul className="mt-16 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Globe2, title: "Your race map", text: "Every race pinned where it happened." },
            { icon: Timer, title: "Times & PBs", text: "Finish times, pace and personal bests." },
            { icon: Medal, title: "Bib numbers", text: "Keep the details you'll want to remember." },
            { icon: ListChecks, title: "Race catalog", text: "Find your next half or full marathon." },
          ].map(({ icon: Icon, title, text }) => (
            <li key={title} className="card p-4">
              <Icon className="size-5 text-accent" />
              <p className="mt-3 font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-5 py-6 text-xs text-muted">
        © {new Date().getFullYear()} RunnerMap
      </footer>
    </main>
  );
}

function RouteDecoration() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 600 600"
      className="pointer-events-none absolute -right-40 top-10 -z-10 hidden w-[720px] text-accent/25 lg:block"
      fill="none"
    >
      <path
        d="M40 520C120 420 90 330 190 300s160 60 230-20 30-170 120-230"
        stroke="currentColor"
        strokeWidth="6"
        strokeDasharray="2 18"
        strokeLinecap="round"
      />
      {[
        [40, 520],
        [190, 300],
        [420, 280],
        [540, 50],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="12" fill="var(--accent)" opacity="0.8" />
      ))}
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}
