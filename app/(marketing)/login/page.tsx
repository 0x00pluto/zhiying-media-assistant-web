import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginPanel } from "@/app/(marketing)/login/_components/login-panel";
import { sanitizeNext } from "@/lib/auth/sanitize-next";
import { resolveAuthenticatedUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "登录",
  description: "使用手机号验证码登录智赢媒体助手官网",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const redirectTo = sanitizeNext(next) ?? "/";
  const { me } = await resolveAuthenticatedUser();

  if (me.loggedIn) {
    redirect(redirectTo);
  }

  return <LoginPanel next={next} />;
}
