import { NextResponse } from "next/server";

import { accountError } from "@/lib/account/errors";
import { toEntitlementSnapshot } from "@/lib/account/entitlement";
import { ensureProfile } from "@/lib/account/ensure-profile";
import type { AccountResponse } from "@/lib/account/types";
import { resolveAuthenticatedUser } from "@/lib/auth/session";
import { maskChinaMobile } from "@/lib/phone";

function toPhoneE164(phone: string): string {
  if (!phone) return "";
  if (phone.startsWith("+")) return phone;
  if (phone.startsWith("86")) return `+${phone}`;
  return `+86${phone}`;
}

export async function GET() {
  const { user, me } = await resolveAuthenticatedUser();

  if (!me.loggedIn || !user) {
    const body: AccountResponse = { loggedIn: false };
    return NextResponse.json(body);
  }

  const phone = user.phone ?? "";
  const phoneE164 = toPhoneE164(phone);

  try {
    const profile = await ensureProfile({
      userId: user.id,
      phoneE164: phoneE164 || phone,
    });

    const body: AccountResponse = {
      loggedIn: true,
      userId: user.id,
      phoneMasked: maskChinaMobile(phone),
      registeredAt: user.created_at,
      entitlement: toEntitlementSnapshot(profile),
    };

    return NextResponse.json(body);
  } catch (error) {
    console.error("[GET /api/web/account]", error);
    return accountError(
      503,
      "SERVICE_UNAVAILABLE",
      "账号信息暂时无法加载，请稍后重试",
    );
  }
}
