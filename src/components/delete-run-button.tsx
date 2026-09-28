"use client";

import { useEffect, useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import clsx from "clsx";
import { deleteRun } from "@/app/(app)/runs/actions";

export function DeleteRunButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  // Auto-cancel the confirmation after a few seconds
  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(t);
  }, [confirming]);

  return (
    <button
      type="button"
      aria-label={confirming ? `Confirm delete ${name}` : `Delete ${name}`}
      disabled={pending}
      onClick={() => (confirming ? startTransition(() => deleteRun(id)) : setConfirming(true))}
      className={clsx(
        "btn px-2.5 py-2",
        confirming ? "bg-danger text-white hover:opacity-90" : "text-muted hover:bg-surface-2 hover:text-danger",
      )}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      {confirming && !pending && <span className="text-xs">Delete?</span>}
    </button>
  );
}
