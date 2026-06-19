/** 仅允许站内相对路径，防止开放重定向 */
export function sanitizeNext(next: string | null | undefined): string | null {
  if (!next) {
    return null;
  }

  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return null;
  }

  return trimmed;
}
