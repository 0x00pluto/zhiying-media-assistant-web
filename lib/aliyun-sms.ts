import Dypnsapi20170525, * as $Dypnsapi20170525 from "@alicloud/dypnsapi20170525";
import Credential from "@alicloud/credentials";
import * as $OpenApi from "@alicloud/openapi-client";
import * as $Util from "@alicloud/tea-util";

export type AliyunSmsError = {
  retryable: boolean;
  httpCode: number;
  message: string;
  code?: string;
};

export function e164ToChinaMobile(phoneE164: string): string | null {
  const trimmed = phoneE164.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return digits;
  }
  if (digits.length === 13 && digits.startsWith("86")) {
    return digits.slice(2);
  }
  if (trimmed.startsWith("+86") && digits.length === 13) {
    return digits.slice(2);
  }
  return null;
}

/** 阿里云号码认证赠送签名/模板；未配置对应 env 时使用。 */
export const ALIYUN_SMS_DEFAULTS = {
  signName: "速通互联验证码",
  templateCode: "100001",
  validMinutes: "5",
  countryCode: "86",
} as const;

export function readAliyunSmsConfig() {
  return {
    signName:
      process.env.ALIYUN_SMS_SIGN_NAME?.trim() || ALIYUN_SMS_DEFAULTS.signName,
    templateCode:
      process.env.ALIYUN_SMS_TEMPLATE_CODE?.trim() ||
      ALIYUN_SMS_DEFAULTS.templateCode,
    validMinutes:
      process.env.ALIYUN_SMS_VALID_MINUTES?.trim() ||
      ALIYUN_SMS_DEFAULTS.validMinutes,
    countryCode:
      process.env.ALIYUN_SMS_COUNTRY_CODE?.trim() ||
      ALIYUN_SMS_DEFAULTS.countryCode,
  };
}

/** 对齐阿里云控制台 TypeScript 示例；Vercel 优先显式 AK/SK。 */
export function createDypnsClient(): Dypnsapi20170525 {
  const ak = process.env.ALIYUN_ACCESS_KEY_ID?.trim();
  const sk = process.env.ALIYUN_ACCESS_KEY_SECRET?.trim();

  const config = new $OpenApi.Config(
    ak && sk
      ? { accessKeyId: ak, accessKeySecret: sk }
      : { credential: new Credential() },
  );
  config.endpoint = "dypnsapi.aliyuncs.com";
  return new Dypnsapi20170525(config);
}

function mapAliyunError(error: unknown): AliyunSmsError {
  const err = error as {
    message?: string;
    code?: string;
    data?: { Code?: string; Recommend?: string };
  };
  const message =
    err.message ??
    err.data?.Code ??
    (typeof err === "object" && err !== null
      ? JSON.stringify(err)
      : "Aliyun SMS failed");
  const code = err.code ?? err.data?.Code;
  const retryable =
    /FREQUENCY|BUSINESS_LIMIT|流控|频繁/i.test(message) ||
    code === "FREQUENCY_FAIL" ||
    code === "BUSINESS_LIMIT_CONTROL";

  return {
    retryable,
    httpCode: retryable ? 429 : 500,
    message,
    code,
  };
}

export async function sendSupabaseOtpSms(input: {
  phoneE164: string;
  otp: string;
}): Promise<void> {
  const phoneNumber = e164ToChinaMobile(input.phoneE164);
  if (!phoneNumber) {
    throw Object.assign(new Error("Invalid phone for China SMS"), {
      aliyunSms: {
        retryable: false,
        httpCode: 400,
        message: "Invalid phone number",
      } satisfies AliyunSmsError,
    });
  }

  const otp = input.otp.trim();
  if (!/^\d{4,8}$/.test(otp)) {
    throw Object.assign(new Error("Invalid OTP"), {
      aliyunSms: {
        retryable: false,
        httpCode: 400,
        message: "Invalid OTP format",
      } satisfies AliyunSmsError,
    });
  }

  const { signName, templateCode, validMinutes, countryCode } =
    readAliyunSmsConfig();
  const client = createDypnsClient();
  const request = new $Dypnsapi20170525.SendSmsVerifyCodeRequest({
    phoneNumber,
    countryCode,
    signName,
    templateCode,
    // 透传 Supabase OTP，禁止使用 ##code## 占位符
    templateParam: JSON.stringify({ code: otp, min: validMinutes }),
  });
  const runtime = new $Util.RuntimeOptions({});

  try {
    const resp = await client.sendSmsVerifyCodeWithOptions(request, runtime);
    const body = resp.body;
    if (body?.success === true && body?.code === "OK") {
      return;
    }
    const msg = body?.message ?? body?.code ?? "Aliyun SendSmsVerifyCode failed";
    const retryable = /FREQUENCY|BUSINESS_LIMIT|流控/i.test(msg);
    throw Object.assign(new Error(msg), {
      aliyunSms: {
        retryable,
        httpCode: retryable ? 429 : 500,
        message: msg,
        code: body?.code,
      } satisfies AliyunSmsError,
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "aliyunSms" in error &&
      (error as { aliyunSms?: AliyunSmsError }).aliyunSms
    ) {
      throw error;
    }
    const mapped = mapAliyunError(error);
    throw Object.assign(new Error(mapped.message), { aliyunSms: mapped });
  }
}

export function getAliyunSmsError(error: unknown): AliyunSmsError | null {
  if (typeof error === "object" && error !== null && "aliyunSms" in error) {
    return (error as { aliyunSms: AliyunSmsError }).aliyunSms;
  }
  return null;
}
