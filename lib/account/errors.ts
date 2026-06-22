import { NextResponse } from "next/server";

export type AccountErrorCode = "SERVICE_UNAVAILABLE" | "SERVER_ERROR";

type ErrorBody = {
  ok: false;
  code: AccountErrorCode;
  error: string;
};

export function accountError(
  status: number,
  code: AccountErrorCode,
  error: string,
) {
  const body: ErrorBody = { ok: false, code, error };
  return NextResponse.json(body, { status });
}
