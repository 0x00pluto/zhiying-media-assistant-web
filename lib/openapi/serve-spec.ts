import { NextResponse } from "next/server";

import { isOpenApiEnabled } from "@/lib/openapi/dev-guard";
import openApiSpec from "@/specs/openapi/web-auth.openapi.json";

export function serveOpenApiSpec() {
  if (!isOpenApiEnabled()) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.json(openApiSpec, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
