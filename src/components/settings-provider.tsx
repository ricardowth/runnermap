"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Units } from "@/lib/format";

export type Theme = "system" | "light" | "dark";
export type MapStyle = "auto" | "light" | "dark" | "streets" | "satellite";

export type Settings = {
  theme: Theme;
  units: Units;
  mapStyle: MapStyle;
  showPace: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  theme: "system",
  units: "km",
  mapStyle: "auto",
  showPace: true,
};

export const SETTINGS_KEY = "runnermap:settings";

/** Runs before paint so the page never flashes the wrong theme. */
export const themeInitScript = `(function(){try{var s=JSON.parse(localStorage.getItem('${SETTINGS_KEY}')||'{}');var t=s.theme||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

type Ctx = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  reset: () => void;
  /** Resolved theme after applying "system" */
  isDark: boolean;
};

const SettingsContext = createContext<Ctx | null>(null);

function readSettings(): Settings {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "{}") };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    setSettings(readSettings());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const isDark = settings.theme === "dark" || (settings.theme === "system" && systemDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const persist = (next: Settings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable (private mode) — settings still apply for this session
    }
  };

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      persist(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(SETTINGS_KEY);
    } catch {}
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return <SettingsContext.Provider value={{ settings, update, reset, isDark }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside <SettingsProvider>");
  return ctx;
}
