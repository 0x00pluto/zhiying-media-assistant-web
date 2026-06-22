/** OpenAPI 仅在非 production 环境对外提供 */
export function isOpenApiEnabled(): boolean {
  return process.env.NODE_ENV !== "production";
}
