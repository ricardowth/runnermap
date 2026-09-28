import { Award, Star } from "lucide-react";
import clsx from "clsx";
import { SERIES, type Series } from "@/data/races";

const SERIES_STYLE: Record<Series, { className: string; icon: typeof Star }> = {
  major: { className: "bg-violet-500/15 text-violet-600 dark:text-violet-300", icon: Star },
  superhalf: { className: "bg-sky-500/15 text-sky-600 dark:text-sky-300", icon: Award },
};

export function PbBadge({ className }: { className?: string }) {
  return <span className={clsx("chip shrink-0 bg-yellow-400/20 text-yellow-600 dark:text-yellow-400", className)}>PB</span>;
}

export function SeriesBadge({ series, className }: { series: Series | undefined; className?: string }) {
  if (!series) return null;
  const { className: color, icon: Icon } = SERIES_STYLE[series];
  return (
    <span className={clsx("chip shrink-0", color, className)} title={SERIES[series].name}>
      <Icon className="size-3" /> {SERIES[series].label}
    </span>
  );
}
