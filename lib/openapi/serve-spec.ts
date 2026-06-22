import { NextResponse } from "next/server";

import { buildWebBffOpenApiDocument } from "@/lib/openapi/generate-document";
import { isOpenApiEnabled } from "@/lib/openapi/dev-guard";

export async function serveOpenApiSpec() {
  if (!isOpenApiEnabled()) {
    return new NextResponse(null, { status: 404 });
  }

  const openApiSpec = buildWebBffOpenApiDocument();

  return NextResponse.json(openApiSpec, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
