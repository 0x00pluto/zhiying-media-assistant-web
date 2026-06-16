"use client";

import { Check, RefreshCw } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FEISHU_FEATURES } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type SyncStatus = "waiting" | "syncing" | "done";

interface NoteCard {
  id: string;
  title: string;
  author: string;
  likes: string;
  attachment: string;
}

const INITIAL_CARDS: NoteCard[] = [
  {
    id: "xhs_9911A",
    title: "10款自媒体必看的高效神器",
    author: "运营老司机",
    likes: "8,290",
    attachment: "封面原图.jpg",
  },
  {
    id: "xhs_7722B",
    title: "极简桌面2.0：打工人退路配置",
    author: "极客小陈",
    likes: "12,410",
    attachment: "桌面实拍.png",
  },
];

function StatusBadge({ status }: { status: SyncStatus }) {
  if (status === "done") {
    return <span className="text-emerald-500">✓ 同步完成</span>;
  }
  if (status === "syncing") {
    return (
      <span className="flex items-center font-semibold text-yellow-600 dark:text-yellow-400">
        <span className="mr-1 size-1.5 animate-pulse rounded-full bg-blue-500" />
        正在传输...
      </span>
    );
  }
  return (
    <span className="flex items-center font-semibold text-yellow-600 dark:text-yellow-400">
      <span className="mr-1 size-1.5 animate-pulse rounded-full bg-yellow-500" />
      等待中
    </span>
  );
}

export function FeishuSyncSection() {
  const [cardStatuses, setCardStatuses] = useState<SyncStatus[]>([
    "waiting",
    "waiting",
  ]);
  const [tableRows, setTableRows] = useState<NoteCard[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [arrowAnimating, setArrowAnimating] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(
    "等待从小红书发起同步，写入表格...",
  );

  const handleSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setArrowAnimating(true);
    setTableRows([]);
    setPendingMessage("正在同步下一条记录，请稍后...");
    setCardStatuses(["syncing", "waiting"]);

    setTimeout(() => {
      setCardStatuses(["done", "syncing"]);
      setTableRows([INITIAL_CARDS[0]]);

      setTimeout(() => {
        setCardStatuses(["done", "done"]);
        setTableRows(INITIAL_CARDS);
        setArrowAnimating(false);
        setPendingMessage("");
        setIsSyncing(false);
      }, 1200);
    }, 1000);
  };

  return (
    <section
      id="feishu-sync"
      className="overflow-hidden border-y bg-muted/30 py-20"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <Badge
              variant="outline"
              className="border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300"
            >
              飞书同步专版
            </Badge>

            <h2 className="text-3xl leading-tight font-black text-foreground sm:text-4xl">
              告别复制粘贴！
              <br />
              数据直通「飞书多维表格」
            </h2>

            <p className="text-sm leading-relaxed text-muted-foreground">
              内置高度智能的飞书云同步引擎。不仅支持纯文本数据的同步，还可以把
              <strong>小红书封面及用户上传的卡片图直接无损上传至多维表格对应的「附件」字段</strong>
              ！
            </p>

            <div className="space-y-3 pt-2">
              {FEISHU_FEATURES.map((feature) => (
                <div key={feature.title} className="flex items-start">
                  <div className="mt-0.5 mr-2 flex size-5 items-center justify-center rounded bg-emerald-500/10 text-primary">
                    <Check className="size-3.5" strokeWidth={3} />
                  </div>
                  <div className="text-xs">
                    <strong className="text-foreground">{feature.title}</strong>
                    {feature.description}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button
                className="bg-blue-600 font-bold hover:bg-blue-700"
                onClick={handleSync}
                disabled={isSyncing}
              >
                <RefreshCw
                  className={cn("size-4", isSyncing && "animate-spin")}
                />
                点此模拟：从小红书同步到飞书
              </Button>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-7">
            <Card className="relative py-4">
              <Badge
                variant="outline"
                className="absolute top-3 right-3 border-red-200 bg-red-100 text-[10px] font-bold text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
              >
                待采集区
              </Badge>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex size-10 items-center justify-center rounded bg-emerald-100 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    XHS
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      小红书精选笔记（准备同步中...）
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      来自小红书发现页瀑布流数据流
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {INITIAL_CARDS.map((card, index) => (
                    <div
                      key={card.id}
                      className={cn(
                        "relative overflow-hidden rounded-lg border bg-muted p-2.5 text-xs transition-all duration-300",
                        cardStatuses[index] === "syncing" &&
                          "border-blue-500/50 bg-blue-500/5",
                        cardStatuses[index] === "done" &&
                          "border-emerald-500/50 bg-emerald-500/5",
                      )}
                    >
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="rounded bg-zinc-200 px-1 text-[9px] text-foreground dark:bg-zinc-800">
                          ID: {card.id}
                        </span>
                        <span className="text-[9px]">
                          <StatusBadge status={cardStatuses[index]} />
                        </span>
                      </div>
                      <p className="line-clamp-1 font-bold text-foreground">
                        {card.title}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>博主: {card.author}</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          ❤️ {card.likes} 赞
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="my-1 flex justify-center select-none">
              <svg
                className={cn(
                  "size-8 text-muted-foreground",
                  arrowAnimating && "animate-bounce text-blue-500",
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 13l-7 7-7-7m14-6l-7 7-7-7"
                />
              </svg>
            </div>

            <Card className="overflow-hidden py-0 shadow-lg">
              <div className="flex items-center justify-between border-b bg-[#EAF2FF] p-3 dark:bg-blue-950/40">
                <div className="flex items-center space-x-2">
                  <div className="flex size-5 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white">
                    飞
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    智赢媒体同步专属多维表格
                  </span>
                </div>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  多维表格 · 笔记表
                </span>
              </div>

              <div className="overflow-x-auto">
                <Table className="text-[11px]">
                  <TableHeader>
                    <TableRow className="bg-muted text-muted-foreground">
                      <TableHead className="border-r">笔记 ID</TableHead>
                      <TableHead className="border-r">笔记标题</TableHead>
                      <TableHead className="border-r">博主昵称</TableHead>
                      <TableHead className="border-r">点赞量</TableHead>
                      <TableHead className="border-r">图片附件</TableHead>
                      <TableHead>同步时间</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableRows.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="p-6 text-center text-muted-foreground italic"
                        >
                          {pendingMessage || "等待从小红书发起同步，写入表格..."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <>
                        {tableRows.map((row) => (
                          <TableRow
                            key={row.id}
                            className="transition-all hover:bg-emerald-500/5"
                          >
                            <TableCell className="border-r font-mono font-bold text-slate-800 dark:text-slate-200">
                              {row.id}
                            </TableCell>
                            <TableCell className="border-r font-medium text-foreground">
                              {row.title}
                            </TableCell>
                            <TableCell className="border-r text-muted-foreground">
                              {row.author}
                            </TableCell>
                            <TableCell className="border-r font-bold text-emerald-600">
                              {row.likes}
                            </TableCell>
                            <TableCell className="border-r">
                              <span className="inline-flex items-center rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                                📎 {row.attachment}
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date().toLocaleTimeString()}
                            </TableCell>
                          </TableRow>
                        ))}
                        {tableRows.length === 1 && pendingMessage && (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="p-4 text-center text-muted-foreground italic"
                            >
                              {pendingMessage}
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
