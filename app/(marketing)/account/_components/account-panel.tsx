"use client";

import { AlertCircle, ExternalLink, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ACCOUNT_COPY } from "@/app/(marketing)/_config/marketing-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { AccountResponse } from "@/lib/account/types";
import { SITE_CONFIG } from "@/lib/site-config";

type ApiErrorBody = {
  ok?: false;
  code?: string;
  error?: string;
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Shanghai",
  }).format(new Date(iso));
}

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Shanghai",
  }).format(new Date(iso));
}

function statusBadgeVariant(
  status: "active" | "expired" | "revoked",
): "default" | "secondary" | "destructive" {
  if (status === "active") return "default";
  if (status === "expired") return "secondary";
  return "destructive";
}

function statusLabel(status: "active" | "expired" | "revoked"): string {
  if (status === "active") return ACCOUNT_COPY.statusActive;
  if (status === "expired") return ACCOUNT_COPY.statusExpired;
  return ACCOUNT_COPY.statusRevoked;
}

export function AccountPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/web/account", {
          credentials: "include",
        });

        if (cancelled) return;

        if (response.status === 503) {
          const body = (await response.json()) as ApiErrorBody;
          setError(body.error ?? ACCOUNT_COPY.loadError);
          setAccount(null);
          return;
        }

        const body = (await response.json()) as AccountResponse;

        if (!body.loggedIn) {
          router.replace("/login?next=/account");
          return;
        }

        setAccount(body);
      } catch {
        if (!cancelled) {
          setError(ACCOUNT_COPY.loadError);
          setAccount(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, reloadKey]);

  const handleRetry = useCallback(() => {
    setReloadKey((value) => value + 1);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/web/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="size-5" />
            加载失败
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleRetry}>
            <RefreshCw className="mr-2 size-4" />
            {ACCOUNT_COPY.retry}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!account?.loggedIn) {
    return null;
  }

  const { entitlement } = account;
  const expiryText =
    entitlement.expiresAt &&
    (entitlement.status === "expired"
      ? ACCOUNT_COPY.expiresExpired(formatDate(entitlement.expiresAt))
      : ACCOUNT_COPY.expiresActive(formatDate(entitlement.expiresAt)));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>账号信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{ACCOUNT_COPY.phoneLabel}</span>
            <span className="font-medium text-foreground">{account.phoneMasked}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">
              {ACCOUNT_COPY.registeredAtLabel}
            </span>
            <span className="font-medium text-foreground">
              {formatDateTime(account.registeredAt)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>{ACCOUNT_COPY.entitlementTitle}</CardTitle>
            <Badge variant={statusBadgeVariant(entitlement.status)}>
              {statusLabel(entitlement.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-2xl font-bold text-foreground">
            {entitlement.planLabel}
          </p>
          {expiryText && (
            <p className="text-sm text-muted-foreground">{expiryText}</p>
          )}
          {entitlement.status === "expired" && (
            <p className="text-sm text-muted-foreground">
              {ACCOUNT_COPY.expiredHint}{" "}
              <a
                href={`mailto:${SITE_CONFIG.supportEmail}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                {SITE_CONFIG.supportEmail}
              </a>
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{ACCOUNT_COPY.extensionBindingTitle}</CardTitle>
          <CardDescription>
            {ACCOUNT_COPY.extensionBindingDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full font-semibold sm:w-auto">
            <a
              href={SITE_CONFIG.chromeStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {ACCOUNT_COPY.installExtension}
              <ExternalLink className="ml-2 size-4" />
            </a>
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="outline"
          disabled={loggingOut}
          onClick={handleLogout}
        >
          {loggingOut ? ACCOUNT_COPY.loggingOut : ACCOUNT_COPY.logout}
        </Button>
      </div>
    </div>
  );
}
