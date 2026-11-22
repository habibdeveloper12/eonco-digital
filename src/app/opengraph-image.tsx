import { ImageResponse } from "next/og";

export const alt = "Eonco Digital: Growth runs on systems. We build them.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#fdf7f5" }}>
        <div style={{ fontSize: 34, fontWeight: 500, color: "#001729" }}>Eonco Digital</div>
        <div style={{ fontSize: 84, fontWeight: 600, color: "#0d1a2b", lineHeight: 1.05, marginTop: 24 }}>Growth Runs on Systems.</div>
        <div style={{ fontSize: 84, fontWeight: 600, color: "#dc1f36", lineHeight: 1.05 }}>We Build Them.</div>
      </div>
    ),
    size,
  );
}
