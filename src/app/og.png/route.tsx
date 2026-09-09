import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              background: "#f97316",
              borderRadius: "12px",
              padding: "10px 22px",
              fontSize: "36px",
              fontWeight: 800,
              color: "white",
            }}
          >
            PDF
          </div>
          <span style={{ fontSize: "52px", fontWeight: 800, letterSpacing: "-1px" }}>
            {siteConfig.name}
          </span>
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#cbd5e1",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            marginTop: "30px",
            fontSize: "18px",
            color: "#10b981",
            background: "rgba(16, 185, 129, 0.1)",
            padding: "8px 18px",
            borderRadius: "999px",
            border: "1px solid rgba(16, 185, 129, 0.3)",
          }}
        >
          100% Client-Side Engine • Zero File Uploads • MIT Open Source
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
