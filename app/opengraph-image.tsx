import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Decorgrass — Grama Sintética Premium en Colombia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          background: "linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern dots */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "#8BC34A",
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
            fontSize: "48px",
          }}
        >
          🌿
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "800",
            color: "white",
            letterSpacing: "-2px",
            lineHeight: 1,
            marginBottom: "16px",
          }}
        >
          Decorgrass
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.85)",
            fontWeight: "400",
            letterSpacing: "0.5px",
            marginBottom: "40px",
          }}
        >
          Grama Sintética Premium en Colombia
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            padding: "20px 48px",
            background: "rgba(255,255,255,0.12)",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
          }}
        >
          {[
            { value: "+200", label: "Proyectos" },
            { value: "5 años", label: "Garantía" },
            { value: "100%", label: "Satisfacción" },
          ].map((s) => (
            <div
              key={s.label}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}
            >
              <span style={{ fontSize: "32px", fontWeight: "700", color: "#8BC34A" }}>{s.value}</span>
              <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* URL badge */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            right: "40px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.5)",
            fontWeight: "500",
          }}
        >
          decorgrass.com
        </div>
      </div>
    ),
    { ...size }
  );
}
