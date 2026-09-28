import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { requireUser, signOut } from "@/auth";
import { Avatar } from "@/components/avatar";
import { PageHeader } from "@/components/page-header";
import { DeviceSettings } from "./device-settings";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <>
      <PageHeader title="Settings" description="Preferences are saved on this device only." />

      <div className="grid max-w-3xl gap-6">
        <DeviceSettings />

        <section className="card p-5">
          <h2 className="font-semibold">Account</h2>
          <p className="text-sm text-muted">Signed in with Google.</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-surface-2 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={user.name} image={user.image} size={44} />
              <div className="min-w-0">
                <p className="truncate font-semibold">{user.name}</p>
                <p className="truncate text-sm text-muted">{user.email}</p>
              </div>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="btn-secondary text-danger">
                <LogOut className="size-4" /> Log out
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
