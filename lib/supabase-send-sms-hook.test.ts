import { randomBytes } from "node:crypto";

import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { Webhook } from "standardwebhooks";

import {
  normalizeHookSecret,
  parseSendSmsHookPayload,
  verifySendSmsHook,
} from "@/lib/supabase-send-sms-hook";

function createSignedPayload(
  secret: string,
  body: Record<string, unknown>,
): { rawBody: string; headers: Record<string, string> } {
  const rawSecret = normalizeHookSecret(secret);
  const wh = new Webhook(rawSecret);
  const msgId = `msg_${randomBytes(8).toString("hex")}`;
  const timestamp = new Date();
  const rawBody = JSON.stringify(body);
  const signature = wh.sign(msgId, timestamp, rawBody);

  return {
    rawBody,
    headers: {
      "webhook-id": msgId,
      "webhook-timestamp": String(Math.floor(timestamp.getTime() / 1000)),
      "webhook-signature": signature,
    },
  };
}

describe("parseSendSmsHookPayload", () => {
  it("picks phone from user.phone", () => {
    expect(
      parseSendSmsHookPayload({
        user: { phone: "+8613812345678" },
        sms: { otp: "123456" },
      }),
    ).toEqual({
      user: { id: "", phone: "+8613812345678" },
      sms: { otp: "123456" },
    });
  });

  it("falls back to sms.phone when user.phone is empty", () => {
    expect(
      parseSendSmsHookPayload({
        user: { phone: "" },
        sms: { phone: "+8613912345678", otp: 654321 },
      }),
    ).toEqual({
      user: { id: "", phone: "+8613912345678" },
      sms: { otp: "654321" },
    });
  });

  it("falls back to user.phone_change", () => {
    expect(
      parseSendSmsHookPayload({
        user: { phone_change: "+8613712345678" },
        sms: { otp: "111222" },
      }),
    ).toEqual({
      user: { id: "", phone: "+8613712345678" },
      sms: { otp: "111222" },
    });
  });

  it("rejects missing phone or otp", () => {
    expect(() =>
      parseSendSmsHookPayload({
        user: { phone: "+8613812345678" },
        sms: {},
      }),
    ).toThrow("Invalid hook payload");
  });
});

describe("verifySendSmsHook", () => {
  const secret = "v1,whsec_" + randomBytes(24).toString("base64");

  beforeEach(() => {
    vi.stubEnv("SEND_SMS_HOOK_SECRET", secret);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("verifies valid webhook payload", () => {
    const payload = {
      user: { phone: "+8613812345678" },
      sms: { otp: "123456" },
    };
    const { rawBody, headers } = createSignedPayload(secret, payload);

    expect(verifySendSmsHook(rawBody, headers)).toEqual({
      user: { id: "", phone: "+8613812345678" },
      sms: { otp: "123456" },
    });
  });

  it("rejects invalid signature", () => {
    const payload = {
      user: { phone: "+8613812345678" },
      sms: { otp: "123456" },
    };
    const { rawBody, headers } = createSignedPayload(secret, payload);

    vi.stubEnv("SEND_SMS_HOOK_SECRET", "v1,whsec_invalid");
    expect(() => verifySendSmsHook(rawBody, headers)).toThrow();
  });
});
