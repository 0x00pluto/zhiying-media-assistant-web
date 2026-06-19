import { createClient, type Session } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth/constants";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
};

export function createAuthClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("缺少 Supabase 环境变量");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function readSessionTokens(): Promise<{
  access_token: string;
  refresh_token: string;
} | null> {
  const cookieStore = await cookies();
  const access_token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refresh_token = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

  if (!access_token || !refresh_token) {
    return null;
  }

  return { access_token, refresh_token };
}

export async function setSessionCookies(session: Session): Promise<void> {
  const cookieStore = await cookies();
  const maxAge = session.expires_in ?? 60 * 60;

  cookieStore.set(ACCESS_TOKEN_COOKIE, session.access_token, {
    ...cookieOptions,
    maxAge,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, session.refresh_token, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}
