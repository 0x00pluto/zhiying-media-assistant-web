import { describe, expect, it } from "vitest";

import { buildWebBffOpenApiDocument } from "@/lib/openapi/generate-document";

describe("buildWebBffOpenApiDocument", () => {
  it("generates auth and account paths", () => {
    const doc = buildWebBffOpenApiDocument();

    expect(doc.openapi).toBe("3.0.3");
    expect(doc.paths?.["/api/web/auth/me"]?.get).toBeDefined();
    expect(doc.paths?.["/api/web/account"]?.get).toBeDefined();
    expect(doc.components?.schemas?.EntitlementSnapshot).toBeDefined();
    expect(doc.components?.schemas?.MeResponse).toBeDefined();
  });
});
