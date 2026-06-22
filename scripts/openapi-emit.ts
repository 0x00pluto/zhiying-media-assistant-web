import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildWebBffOpenApiDocument } from "@/lib/openapi/generate-document";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "../docs/openapi/web-auth.openapi.json");

const document = buildWebBffOpenApiDocument();
const payload = {
  $comment:
    "AUTO-GENERATED — 请勿手改。修改 lib/openapi/schemas/* 后执行 pnpm openapi:emit",
  ...document,
};

writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Wrote ${outputPath}`);
