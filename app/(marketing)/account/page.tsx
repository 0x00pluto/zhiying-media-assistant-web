import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AccountPanel } from "@/app/(marketing)/account/_components/account-panel";
import { ACCOUNT_COPY } from "@/app/(marketing)/_config/marketing-content";
import { resolveAuthenticatedUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: ACCOUNT_COPY.pageTitle,
  description: ACCOUNT_COPY.pageDescription,
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AccountPage() {
  const { me } = await resolveAuthenticatedUser();

  if (!me.loggedIn) {
    redirect("/login?next=/account");
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:px-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {ACCOUNT_COPY.pageTitle}
        </h1>
        <p className="text-sm text-muted-foreground">
          {ACCOUNT_COPY.pageDescription}
        </p>
      </div>
      <AccountPanel />
    </div>
  );
}
