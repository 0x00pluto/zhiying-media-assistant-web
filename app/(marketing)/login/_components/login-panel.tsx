"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { COOLDOWN_SECONDS } from "@/lib/auth/constants";
import { sanitizeNext } from "@/lib/auth/sanitize-next";
import { isValidChinaMobile, maskChinaMobile } from "@/lib/phone";

const OTP_VALID_MINUTES_DISPLAY = 10;

const OTP_SLOT_CLASSNAME =
  "relative flex size-11 items-center justify-center rounded-md border border-input text-base shadow-xs outline-none first:rounded-md first:border-l last:rounded-md aria-invalid:border-destructive data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50 dark:bg-input/30";

type LoginStep = "phone" | "otp";

type ApiErrorBody = {
  ok?: false;
  code?: string;
  error?: string;
  retryAfter?: number;
};

type LoginPanelProps = {
  next?: string;
};

export function LoginPanel({ next }: LoginPanelProps) {
  const router = useRouter();
  const redirectTo = sanitizeNext(next) ?? "/";

  const [step, setStep] = useState<LoginStep>("phone");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const phoneValid = isValidChinaMobile(phone);
  const canSend = phoneValid && agreed && !loading && cooldown === 0;
  const canVerify = otp.length === 6 && !loading;
  const maskedPhoneE164 = phoneValid
    ? `+86${maskChinaMobile(phone)}`
    : "";

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setCooldown((value) => (value <= 1 ? 0 : value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleApiError = useCallback((body: ApiErrorBody, fallback: string) => {
    setError(body.error ?? fallback);
    if (typeof body.retryAfter === "number" && body.retryAfter > 0) {
      setCooldown(body.retryAfter);
    }
  }, []);

  const sendOtp = useCallback(
    async (fromOtpStep = false) => {
      const allowed = fromOtpStep
        ? phoneValid && !loading && cooldown === 0
        : canSend;

      if (!allowed) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/web/auth/sign-in/phone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        });
        const body = (await response.json()) as ApiErrorBody & { ok?: boolean };

        if (!response.ok) {
          handleApiError(body, "发送验证码失败，请稍后重试");
          return;
        }

        setStep("otp");
        setOtp("");
        setCooldown(COOLDOWN_SECONDS);
      } catch {
        setError("网络异常，请稍后重试");
      } finally {
        setLoading(false);
      }
    },
    [canSend, cooldown, handleApiError, loading, phone, phoneValid],
  );

  const verifyOtp = useCallback(async () => {
    if (!canVerify) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/web/auth/sign-in/phone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, token: otp }),
      });
      const body = (await response.json()) as ApiErrorBody & { ok?: boolean };

      if (!response.ok) {
        handleApiError(body, "验证码错误或已过期，请重新输入");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("网络异常，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, [canVerify, handleApiError, otp, phone, redirectTo, router]);

  const backToPhone = () => {
    setStep("phone");
    setOtp("");
    setError(null);
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        {step === "phone" ? (
          <CardHeader>
            <CardTitle>登录 / 注册</CardTitle>
            <CardDescription>
              使用中国大陆手机号接收验证码，首次验证成功即完成注册。
            </CardDescription>
          </CardHeader>
        ) : null}
        <CardContent className={step === "otp" ? "space-y-6 pt-6" : "space-y-6"}>
          {step === "phone" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <div className="flex gap-2">
                  <div className="flex h-9 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
                    +86
                  </div>
                  <Input
                    id="phone"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="请输入 11 位手机号"
                    maxLength={11}
                    value={phone}
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, "");
                      setPhone(digits.slice(0, 11));
                    }}
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked === true)}
                />
                <Label
                  htmlFor="terms"
                  className="text-sm leading-relaxed font-normal text-muted-foreground"
                >
                  我已阅读并同意
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    用户协议
                  </Link>
                  与
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    隐私政策
                  </Link>
                </Label>
              </div>

              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}

              <Button
                className="w-full"
                disabled={!canSend}
                onClick={() => sendOtp()}
              >
                {loading ? "发送中..." : "发送验证码"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <button
                type="button"
                className="inline-flex items-center gap-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={backToPhone}
              >
                <ChevronLeft className="size-4" />
                返回
              </button>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">
                  输入手机号验证码
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  请输入发送至{" "}
                  <span className="font-medium text-foreground">
                    {maskedPhoneE164}
                  </span>{" "}
                  的 6 位验证码，有效期 {OTP_VALID_MINUTES_DISPLAY} 分钟
                </p>
              </div>

              <InputOTP
                id="otp"
                maxLength={6}
                value={otp}
                onChange={setOtp}
                inputMode="numeric"
                pattern="[0-9]*"
                containerClassName="justify-center gap-3"
              >
                <InputOTPGroup className="gap-2">
                  {[0, 1, 2].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={OTP_SLOT_CLASSNAME}
                    />
                  ))}
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="gap-2">
                  {[3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={OTP_SLOT_CLASSNAME}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              <div className="text-sm">
                {cooldown > 0 ? (
                  <p className="text-muted-foreground">
                    {cooldown} 秒后可重新获取验证码
                  </p>
                ) : (
                  <button
                    type="button"
                    className="text-primary transition-colors hover:text-primary/80 disabled:pointer-events-none disabled:opacity-50"
                    disabled={loading}
                    onClick={() => sendOtp(true)}
                  >
                    {loading ? "发送中..." : "重新获取验证码"}
                  </button>
                )}
              </div>

              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}

              <Button
                className="w-full"
                disabled={!canVerify}
                onClick={verifyOtp}
              >
                {loading ? "验证中..." : "下一步"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
