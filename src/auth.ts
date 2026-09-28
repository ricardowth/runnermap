import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  // Needed for `next start` / self-hosting behind a proxy (Vercel sets this automatically).
  trustHost: true,
  pages: { signIn: "/" },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});

/** Returns the signed-in user or redirects to the landing page. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  return session.user as typeof session.user & { id: string };
}
