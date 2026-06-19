import { NextResponse } from "next/server";

export type AuthErrorCode =
  | "INVALID_PHONE"
  | "INVALID_OTP"
  | "RATE_LIMITED"
  | "INVALID_REQUEST"
  | "SERVER_ERROR"
  | "HOOK_UNAUTHORIZED"
  | "SMS_SEND_FAILED";

type ErrorBody = {
  ok: false;
  code: AuthErrorCode;
  error: string;
  retryAfter?: number;
};

export function authError(
  status: number,
  code: AuthErrorCode,
  error: string,
  retryAfter?: number,
) {
  const body: ErrorBody = { ok: false, code, error };
  if (retryAfter !== undefined) {
    body.retryAfter = retryAfter;
  }
  return NextResponse.json(body, { status });
}

export function authOk<T extends Record<string, unknown>>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, ...data }, init);
}
