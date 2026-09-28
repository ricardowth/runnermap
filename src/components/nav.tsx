"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Map, Settings, Trophy } from "lucide-react";
import clsx from "clsx";

export const NAV_ITEMS = [
  { href: "/overview", label: "Overview", icon: Map },
  { href: "/runs", label: "Runs", icon: Trophy },
  { href: "/find", label: "Find a run", icon: Compass },
  { href: "/settings", label: "Settings", icon: Settings },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

export function SideNav() {
  const isActive = useIsActive();
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={clsx(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
            isActive(href) ? "bg-accent-soft text-accent" : "text-muted hover:bg-surface-2 hover:text-text",
          )}
        >
          <Icon className="size-[18px]" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function BottomNav() {
  const isActive = useIsActive();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-[1000] border-t border-border bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden">
      <ul className="grid grid-cols-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={clsx(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                isActive(href) ? "text-accent" : "text-muted",
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
