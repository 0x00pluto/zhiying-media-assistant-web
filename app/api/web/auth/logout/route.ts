import { createAuthClient, clearSessionCookies, readSessionTokens } from "@/lib/auth/cookies";
import { authOk } from "@/lib/auth/errors";

export async function POST() {
  const tokens = await readSessionTokens();

  if (tokens) {
    try {
      const supabase = createAuthClient();
      await supabase.auth.setSession(tokens);
      await supabase.auth.signOut();
    } catch {
      // 清 Cookie 优先，signOut 失败不阻塞
    }
  }

  await clearSessionCookies();
  return authOk({});
}
