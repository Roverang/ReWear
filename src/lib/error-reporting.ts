/**
 * Error reporting utility.
 * Dispatches errors to any registered window error handlers.
 */
export function reportError(
  error: unknown,
  context: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  const message =
    error instanceof Error ? error.message : String(error ?? "Unknown error");
  console.error("[ReWear Error]", message, context);
}
