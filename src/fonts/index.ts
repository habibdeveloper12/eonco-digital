import localFont from "next/font/local";

/**
 * All fonts are self-hosted from this folder and preloaded by Next.js:
 * no third-party requests, no build-time downloads, no render-blocking CSS,
 * and size-adjusted fallbacks to avoid layout shift.
 *
 * Sora and Figtree: SIL Open Font License (variable, latin subset, 400–600).
 * Cabinet Grotesk: Indian Type Foundry via Fontshare, ITF Free Font License.
 */
export const figtree = localFont({
  src: "./Figtree-latin-var.woff2",
  weight: "400 600",
  variable: "--font-figtree",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const sora = localFont({
  src: "./Sora-latin-var.woff2",
  weight: "400 600",
  variable: "--font-sora",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const cabinet = localFont({
  src: "./CabinetGrotesk-Medium.woff2",
  weight: "500",
  variable: "--font-cabinet",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
});
