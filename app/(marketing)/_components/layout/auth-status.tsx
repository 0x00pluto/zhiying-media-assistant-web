"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type MeResponse =
  | { loggedIn: false }
  | { loggedIn: true; phoneMasked: string; userId: string };

type AuthStatusProps = {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

export function AuthStatus({
  variant = "desktop",
  onNavigate,
}: AuthStatusProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse>({ loggedIn: false });
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      try {
        const response = await fetch("/api/web/auth/me", {
          credentials: "include",
        });
        const body = (await response.json()) as MeResponse;
        if (!cancelled) {
          setMe(body);
        }
      } catch {
        if (!cancelled) {
          setMe({ loggedIn: false });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadMe();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/web/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setMe({ loggedIn: false });
      onNavigate?.();
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <span
        className={
          variant === "desktop"
            ? "hidden h-8 w-16 animate-pulse rounded-md bg-muted sm:inline-block"
            : "h-9 w-full animate-pulse rounded-md bg-muted"
        }
        aria-hidden
      />
    );
  }

  if (!me.loggedIn) {
    return (
      <Button
        asChild
        variant={variant === "mobile" ? "outline" : "ghost"}
        size="sm"
        className={variant === "desktop" ? "hidden sm:inline-flex" : "w-full"}
      >
        <Link href="/login" onClick={onNavigate}>
          登录
        </Link>
      </Button>
    );
  }

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">{me.phoneMasked}</p>
        <Button
          variant="outline"
          disabled={loggingOut}
          onClick={handleLogout}
        >
          {loggingOut ? "退出中..." : "退出"}
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <span className="text-sm text-muted-foreground">{me.phoneMasked}</span>
      <Button
        variant="ghost"
        size="sm"
        disabled={loggingOut}
        onClick={handleLogout}
      >
        {loggingOut ? "退出中..." : "退出"}
      </Button>
    </div>
  );
}
