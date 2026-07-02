import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "InfluQ — AI YouTube Growth OS";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0c",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: "linear-gradient(135deg,#A855F7,#6366F1,#3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, fontWeight: 800, color: "white" }}>Q</div>
          <div style={{ fontSize: 40, fontWeight: 800 }}>Influ<span style={{ color: "#A855F7" }}>Q</span></div>
        </div>
        <div style={{ fontSize: 68, fontWeight: 800, textAlign: "center", lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 }}>
          The AI YouTube Growth OS
        </div>
        <div style={{ fontSize: 30, color: "#a1a1aa", marginTop: 24, textAlign: "center", maxWidth: 860 }}>
          From idea to viral script, thumbnail, and SEO — decisions, not just charts.
        </div>
      </div>
    ),
    { ...size }
  );
}
