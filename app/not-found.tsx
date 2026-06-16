import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4 py-24 text-center md:px-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">404</p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          页面不存在
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          你访问的页面可能已被移动或删除。请返回首页继续浏览产品介绍。
        </p>
      </div>
      <Button asChild>
        <Link href="/">返回首页</Link>
      </Button>
    </div>
  );
}
