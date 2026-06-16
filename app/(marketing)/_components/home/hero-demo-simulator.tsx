"use client";

import { Heart, Play, Plus } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type DemoNote = {
  src: string;
  alt: string;
  title: string;
  author: string;
  date: string;
  likes: string;
  avatar: string;
};

const DEMO_NOTES_FULL: DemoNote[] = [
  {
    src: "/marketing/xiaohongshu/note-dopamine-outfit-cover.jpg",
    alt: "夏日清爽多巴胺穿搭合集",
    title: "夏日清爽多巴胺穿搭合集",
    author: "小夏穿搭记",
    date: "03-12",
    likes: "1.2万",
    avatar: "/marketing/xiaohongshu/avatar-1.jpg",
  },
  {
    src: "/marketing/xiaohongshu/note-desk-setup-cover.jpg",
    alt: "桌面好物打造沉浸式自习室",
    title: "桌面好物打造沉浸式自习室",
    author: "桌面研究所",
    date: "2024-09-22",
    likes: "668",
    avatar: "/marketing/xiaohongshu/avatar-2.jpg",
  },
];

const DEMO_NOTES_PREVIEW: DemoNote[] = [
  {
    src: "/marketing/xiaohongshu/note-business-tips-cover.jpg",
    alt: "自媒体人必备的变现思路",
    title: "自媒体人必备的变现思路",
    author: "清醒理财局",
    date: "01-08",
    likes: "8532",
    avatar: "/marketing/xiaohongshu/avatar-3.jpg",
  },
  {
    src: "/marketing/xiaohongshu/note-outdoor-pet-cover.jpg",
    alt: "周末带修狗露营全记录",
    title: "周末带修狗露营全记录",
    author: "户外日记本",
    date: "11-20",
    likes: "2140",
    avatar: "/marketing/xiaohongshu/avatar-4.jpg",
  },
];

function XhsNoteCard({ note }: { note: DemoNote }) {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-zinc-950">
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={note.src}
          alt={note.alt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 640px) 50vw, 160px"
        />
      </div>
      <div className="space-y-1.5 px-2 pt-1.5 pb-2">
        <h3 className="line-clamp-2 text-[11px] leading-snug font-semibold text-foreground">
          {note.title}
        </h3>
        <div className="flex items-center justify-between gap-1">
          <div className="flex min-w-0 items-center gap-1">
            <Image
              src={note.avatar}
              alt=""
              width={16}
              height={16}
              className="size-4 shrink-0 rounded-full"
            />
            <div className="min-w-0 leading-none">
              <p className="truncate text-[9px] text-muted-foreground">
                {note.author}
              </p>
              <p className="text-[8px] text-muted-foreground/70">{note.date}</p>
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-0.5 text-[9px] text-muted-foreground">
            <Heart className="size-3" strokeWidth={1.75} />
            {note.likes}
          </span>
        </div>
      </div>
    </article>
  );
}

export function HeroDemoSimulator() {
  const [linkCount, setLinkCount] = useState(2);
  const [isCollecting, setIsCollecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [btnText, setBtnText] = useState("点击开始采集");
  const [exportEnabled, setExportEnabled] = useState(false);
  const [logs, setLogs] = useState<string[]>(["等待采集指令..."]);
  const consoleRef = useRef<HTMLDivElement>(null);

  const logConsole = useCallback((message: string) => {
    setLogs((prev) => [...prev, message]);
    requestAnimationFrame(() => {
      if (consoleRef.current) {
        consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
      }
    });
  }, []);

  const handleCollectPage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCollecting) return;
    const next = linkCount + 1;
    setLinkCount(next);
    logConsole(`发现新笔记卡片，自动导入侧边栏. (当前共计 ${next} 条)`);
  };

  const handleStartCollect = () => {
    if (isCollecting) return;
    setIsCollecting(true);
    setBtnText("正在批量获取详情...");
    logConsole("启动批量详情获取线程...");

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProgress((step / linkCount) * 100);
      logConsole(`[详情拉取] 已成功获取第 ${step} / ${linkCount} 条核心数据...`);

      if (step >= linkCount) {
        clearInterval(interval);
        setIsCollecting(false);
        setBtnText("采集完毕！");
        logConsole("✅ 所有数据缓存打包完毕。可立即导出为 CSV 或飞书同步。");
        setExportEnabled(true);
      }
    }, 900);
  };

  const handleCsvExport = () => {
    if (!exportEnabled) return;
    alert(
      `模拟文件生成成功！\n\n已成功打包并下载「智赢助手_批量导出_${new Date().toLocaleDateString()}.csv」文件到您的本地下载文件夹。`,
    );
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 rounded-2xl border border-border/40 bg-gradient-to-tr from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10" />

      <Card className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl py-0 shadow-2xl ring-border">
        <div className="flex h-10 shrink-0 items-center justify-between border-b bg-muted px-4 select-none">
          <div className="flex items-center space-x-1.5">
            <span className="size-3 rounded-full bg-red-400/80" />
            <span className="size-3 rounded-full bg-yellow-400/80" />
            <span className="size-3 rounded-full bg-green-400/80" />
          </div>
          <div className="flex w-2/3 items-center justify-center rounded border bg-card px-4 py-1 text-xs text-muted-foreground">
            xiaohongshu.com/explore
          </div>
          <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            ALT + C 开启侧栏
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 space-y-3 overflow-hidden bg-zinc-50 p-3 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-500">小红书发现页</span>
              <button
                type="button"
                onClick={handleCollectPage}
                className="flex animate-bounce items-center space-x-1 rounded bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-red-600"
              >
                <Plus className="size-3" />
                <span>采集本页笔记</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {DEMO_NOTES_FULL.map((note) => (
                <XhsNoteCard key={note.src} note={note} />
              ))}
            </div>

            <div
              className="relative mt-2 max-h-[72px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]"
              aria-hidden="true"
            >
              <div className="grid grid-cols-2 gap-2">
                {DEMO_NOTES_PREVIEW.map((note) => (
                  <XhsNoteCard key={note.src} note={note} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex w-[180px] flex-col overflow-hidden border-l bg-card text-xs sm:w-[220px]">
            <div className="flex items-center justify-between border-b bg-emerald-900/5 p-2 dark:bg-emerald-950/10">
              <span className="font-bold text-emerald-800 dark:text-emerald-300">
                智赢媒体助手
              </span>
              <span className="size-2 rounded-full bg-emerald-500" />
            </div>

            <div className="flex flex-1 flex-col space-y-3 overflow-y-auto p-2">
              <div className="space-y-1">
                <span className="block text-[9px] tracking-wider text-muted-foreground uppercase">
                  任务面板
                </span>
                <div className="rounded border bg-muted p-1.5 text-[10px]">
                  <div className="mb-1 flex justify-between">
                    <span>已导入：</span>
                    <span className="font-bold text-primary">{linkCount} 条链接</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] font-medium tracking-wider text-muted-foreground uppercase">
                  快捷操作
                </span>
                <Button
                  size="xs"
                  className="h-auto w-full py-1 text-[10px] font-semibold"
                  disabled={isCollecting}
                  onClick={handleStartCollect}
                >
                  <Play className="size-3" strokeWidth={2.5} />
                  {btnText}
                </Button>
              </div>

              <div className="space-y-1">
                <span className="block text-[9px] tracking-wider text-muted-foreground uppercase">
                  采集日志
                </span>
                <div
                  ref={consoleRef}
                  className="h-24 space-y-0.5 overflow-y-auto rounded border bg-black/5 p-1 font-mono text-[9px] text-zinc-600 dark:bg-black/40 dark:text-zinc-300"
                >
                  {logs.map((log, i) => (
                    <div key={i}>&gt; {log}</div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1 border-t pt-2">
                <button
                  type="button"
                  onClick={handleCsvExport}
                  disabled={!exportEnabled}
                  className={cn(
                    "rounded border p-1 text-center text-[10px] font-medium",
                    exportEnabled
                      ? "bg-emerald-500/10 text-emerald-600 hover:bg-accent dark:text-emerald-400"
                      : "cursor-not-allowed opacity-50",
                  )}
                >
                  导出 CSV
                </button>
                <button
                  type="button"
                  disabled={!exportEnabled}
                  className={cn(
                    "rounded border border-blue-500/20 p-1 text-center text-[10px] font-medium",
                    exportEnabled
                      ? "bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 dark:text-blue-400"
                      : "cursor-not-allowed opacity-50",
                  )}
                >
                  同步飞书
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
