import Link from "next/link";
import { requireUser } from "@/auth";
import { Avatar } from "@/components/avatar";
import { Logo } from "@/components/logo";
import { BottomNav, SideNav } from "@/components/nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-surface px-4 py-6 lg:flex">
        <Link href="/overview" className="px-2">
          <Logo />
        </Link>
        <div className="mt-8 flex-1">
          <SideNav />
        </div>
        <Link href="/settings" className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface-2">
          <Avatar name={user.name} image={user.image} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{user.name}</span>
            <span className="block truncate text-xs text-muted">{user.email}</span>
          </span>
        </Link>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-[1000] flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur-lg lg:hidden">
        <Link href="/overview">
          <Logo />
        </Link>
        <Link href="/settings" aria-label="Settings">
          <Avatar name={user.name} image={user.image} size={32} />
        </Link>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">{children}</main>

      <BottomNav />
    </div>
  );
}
