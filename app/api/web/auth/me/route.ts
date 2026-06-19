import { NextResponse } from "next/server";

import { resolveAuthenticatedUser } from "@/lib/auth/session";

export async function GET() {
  const { me } = await resolveAuthenticatedUser();
  return NextResponse.json(me);
}
