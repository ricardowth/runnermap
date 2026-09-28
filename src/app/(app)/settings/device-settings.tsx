"use client";

import { Map as MapIcon, Monitor, Moon, RotateCcw, Ruler, Sun, Timer } from "lucide-react";
import clsx from "clsx";
import { useSettings, type MapStyle, type Theme } from "@/components/settings-provider";
import type { Units } from "@/lib/format";

export function DeviceSettings() {
  const { settings, update, reset } = useSettings();

  return (
    <section className="card divide-y divide-border">
      <Row icon={Moon} title="Appearance" description="Night mode for this device.">
        <Choice<Theme>
          value={settings.theme}
          onChange={(theme) => update({ theme })}
          options={[
            { value: "system", label: "System", icon: Monitor },
            { value: "light", label: "Light", icon: Sun },
            { value: "dark", label: "Dark", icon: Moon },
          ]}
        />
      </Row>

      <Row icon={Ruler} title="Units" description="Used for distance and pace.">
        <Choice<Units>
          value={settings.units}
          onChange={(units) => update({ units })}
          options={[
            { value: "km", label: "Kilometers" },
            { value: "mi", label: "Miles" },
          ]}
        />
      </Row>

      <Row icon={MapIcon} title="Map style" description="Auto follows light / dark mode.">
        <Choice<MapStyle>
          value={settings.mapStyle}
          onChange={(mapStyle) => update({ mapStyle })}
          options={[
            { value: "auto", label: "Auto" },
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "streets", label: "Streets" },
            { value: "satellite", label: "Satellite" },
          ]}
        />
      </Row>

      <Row icon={Timer} title="Show pace" description="Display average pace next to finish times.">
        <button
          role="switch"
          aria-checked={settings.showPace}
          onClick={() => update({ showPace: !settings.showPace })}
          className={clsx(
            "relative h-7 w-12 rounded-full transition",
            settings.showPace ? "bg-accent" : "bg-border",
          )}
        >
          <span
            className={clsx(
              "absolute top-1 size-5 rounded-full bg-white shadow transition-all",
              settings.showPace ? "left-6" : "left-1",
            )}
          />
        </button>
      </Row>

      <div className="flex justify-end p-4">
        <button onClick={reset} className="btn-ghost">
          <RotateCcw className="size-4" /> Reset device settings
        </button>
      </div>
    </section>
  );
}

function Row({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-muted">
          <Icon className="size-4" />
        </span>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Choice<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; icon?: React.ComponentType<{ className?: string }> }[];
}) {
  return (
    <div className="inline-flex flex-wrap rounded-xl border border-border bg-surface p-1">
      {options.map(({ value: v, label, icon: Icon }) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={clsx(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition",
            value === v ? "bg-accent text-white" : "text-muted hover:text-text",
          )}
        >
          {Icon && <Icon className="size-4" />}
          {label}
        </button>
      ))}
    </div>
  );
}
