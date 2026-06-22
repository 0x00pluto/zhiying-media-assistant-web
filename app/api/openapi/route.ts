import { serveOpenApiSpec } from "@/lib/openapi/serve-spec";

export async function GET() {
  return serveOpenApiSpec();
}
