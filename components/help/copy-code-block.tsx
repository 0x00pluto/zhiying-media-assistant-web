"use client";

import { Check, Clipboard } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const FEISHU_APP_SCOPES_JSON = `{
  "scopes": {
    "tenant": [
      "bitable:app",
      "wiki:wiki",
      "contact:user.id:readonly"
    ]
  }
}`;

type CopyCodeBlockProps = {
  code: string;
  title?: string;
  language?: string;
  className?: string;
};

export function CopyCodeBlock({
  code,
  title = "批量导入权限",
  language = "json",
  className,
}: CopyCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <figure
      className={cn(
        "not-prose my-6 overflow-hidden rounded-xl border bg-card text-sm shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b px-4 py-2.5">
        <figcaption className="text-sm text-muted-foreground">{title}</figcaption>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5"
          onClick={onCopy}
        >
          {copied ? (
            <>
              <Check className="size-3.5" />
              已复制
            </>
          ) : (
            <>
              <Clipboard className="size-3.5" />
              复制
            </>
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-foreground">
        <code className={`language-${language} font-mono text-[0.8125rem] leading-relaxed`}>
          {code}
        </code>
      </pre>
    </figure>
  );
}
