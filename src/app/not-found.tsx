import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center p-6 text-center">
      <div>
        <p className="font-display text-6xl font-bold text-accent">404</p>
        <p className="mt-2 text-lg font-semibold">Wrong turn on the course.</p>
        <p className="mt-1 text-sm text-muted">This page doesn&apos;t exist.</p>
        <Link href="/overview" className="btn-primary mt-6">
          Back to overview
        </Link>
      </div>
    </main>
  );
}
