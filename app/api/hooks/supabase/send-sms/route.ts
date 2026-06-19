import { NextRequest, NextResponse } from "next/server";

import {
  getAliyunSmsError,
  sendSupabaseOtpSms,
} from "@/lib/aliyun-sms";
import { verifySendSmsHook } from "@/lib/supabase-send-sms-hook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hookErrorResponse(
  message: string,
  httpCode: number,
  retryable = false,
): NextResponse {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (retryable) {
    headers["retry-after"] = "true";
  }
  return NextResponse.json(
    {
      error: {
        http_code: httpCode,
        message,
      },
    },
    { status: httpCode, headers },
  );
}

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  let payload;
  try {
    payload = verifySendSmsHook(raw, headers);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const isPayload = message.includes("Invalid hook payload");
    const isMissingSecret = message.includes("Missing SEND_SMS_HOOK_SECRET");
    console.error(
      isPayload
        ? "send-sms hook payload invalid:"
        : isMissingSecret
          ? "send-sms hook secret missing:"
          : "send-sms hook verify failed:",
      error,
    );
    if (isMissingSecret) {
      return hookErrorResponse("Send SMS Hook 未配置", 500);
    }
    return hookErrorResponse(
      isPayload ? "Invalid hook payload" : "Invalid webhook signature",
      403,
    );
  }

  try {
    await sendSupabaseOtpSms({
      phoneE164: payload.user.phone,
      otp: payload.sms.otp,
    });
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    const aliyun = getAliyunSmsError(error);
    if (aliyun) {
      console.error("send-sms aliyun error:", aliyun.message);
      return hookErrorResponse(aliyun.message, aliyun.httpCode, aliyun.retryable);
    }
    console.error("send-sms hook failed:", error);
    const message =
      error instanceof Error ? error.message : "Failed to send SMS";
    return hookErrorResponse(message, 500);
  }
}
