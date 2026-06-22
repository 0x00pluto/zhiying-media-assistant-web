import type { User } from "@supabase/supabase-js";

import {
  clearSessionCookies,
  createAuthClient,
  readSessionTokens,
  setSessionCookies,
} from "@/lib/auth/cookies";
import type { MeResponse } from "@/lib/openapi/schemas/auth";
import { maskChinaMobile } from "@/lib/phone";

export type { MeResponse };

function toMeResponse(user: User): MeResponse {
  const phone = user.phone ?? "";
  return {
    loggedIn: true,
    userId: user.id,
    phoneMasked: maskChinaMobile(phone),
  };
}

/** 读取并必要时刷新官网会话；失败时清除 Cookie */
export async function resolveAuthenticatedUser(): Promise<{
  user: User | null;
  me: MeResponse;
}> {
  const tokens = await readSessionTokens();
  if (!tokens) {
    return { user: null, me: { loggedIn: false } };
  }

  const supabase = createAuthClient();
  const { data: sessionData, error: sessionError } =
    await supabase.auth.setSession(tokens);

  if (sessionError || !sessionData.session) {
    await clearSessionCookies();
    return { user: null, me: { loggedIn: false } };
  }

  let session = sessionData.session;
  let user = sessionData.user;

  const expiresAtMs = (session.expires_at ?? 0) * 1000;
  const shouldRefresh = expiresAtMs - Date.now() < 60_000;

  if (shouldRefresh) {
    const { data: refreshData, error: refreshError } =
      await supabase.auth.refreshSession();

    if (refreshError || !refreshData.session || !refreshData.user) {
      await clearSessionCookies();
      return { user: null, me: { loggedIn: false } };
    }

    session = refreshData.session;
    user = refreshData.user;
    await setSessionCookies(session);
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    await clearSessionCookies();
    return { user: null, me: { loggedIn: false } };
  }

  return {
    user: userData.user ?? user,
    me: toMeResponse(userData.user ?? user),
  };
}
