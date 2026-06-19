#!/usr/bin/env node
/**
 * 仅补齐「远端有、本地无」的迁移文件，不覆盖已有 .sql（Git 为已入库迁移的权威来源）。
 * 实现：临时备份 → supabase migration fetch --linked --yes → 还原既有文件 → 保留新增文件。
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const migrationsDir = path.join(repoRoot, "supabase", "migrations");
const backupDir = path.join(repoRoot, ".migration-sync-backup");

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: opts.inheritStdio ? "inherit" : ["inherit", "pipe", "pipe"],
  });
  if (r.status !== 0) {
    if (!opts.inheritStdio) {
      process.stderr.write(r.stderr || "");
      process.stderr.write(r.stdout || "");
    }
    process.exit(r.status ?? 1);
  }
  return r.stdout || "";
}

function listMigrationFiles() {
  if (!fs.existsSync(migrationsDir)) return [];
  return fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function backupMigrations(files) {
  if (fs.existsSync(backupDir)) fs.rmSync(backupDir, { recursive: true, force: true });
  fs.mkdirSync(backupDir, { recursive: true });
  for (const f of files) {
    copyFile(path.join(migrationsDir, f), path.join(backupDir, f));
  }
}

function restoreMigrations(files) {
  for (const f of files) {
    const from = path.join(backupDir, f);
    if (fs.existsSync(from)) copyFile(from, path.join(migrationsDir, f));
  }
  fs.rmSync(backupDir, { recursive: true, force: true });
}

function parseRemoteOnlyVersions(listOutput) {
  const remoteOnly = [];
  for (const line of listOutput.split("\n")) {
    if (!line.includes("|")) continue;
    const parts = line.split("|").map((p) => p.trim());
    if (parts.length < 3) continue;
    const local = parts[0];
    const remote = parts[1];
    if (/^-+$/.test(local) || local === "Local") continue;
    if (remote && remote !== "Remote" && !local) remoteOnly.push(remote);
  }
  return remoteOnly;
}

console.log("检查 linked 项目迁移对齐情况…\n");
const listOutput = run("supabase", ["migration", "list"]);
const beforeFiles = listMigrationFiles();
const remoteOnly = parseRemoteOnlyVersions(listOutput);

if (remoteOnly.length === 0) {
  console.log("未发现「仅远端存在」的迁移版本，无需同步。");
  process.exit(0);
}

console.log(`远端独有版本: ${remoteOnly.join(", ")}\n`);
backupMigrations(beforeFiles);
console.log("执行: supabase migration fetch --linked --yes\n");
run("supabase", ["migration", "fetch", "--linked", "--yes"], { inheritStdio: true });
restoreMigrations(beforeFiles);

const afterFiles = listMigrationFiles();
const added = afterFiles.filter((f) => !beforeFiles.includes(f));
console.log("\n--- 完成 ---");
if (added.length) {
  console.log("新增本地文件（请审阅后提交 Git）:");
  added.forEach((f) => console.log(`  supabase/migrations/${f}`));
} else {
  console.log("未产生新文件名；请对照 migration list 手动处理。");
}
console.log("\n下一步: pnpm db:migration:list → git diff → pnpm db:migrate\n");
