import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Sam Morris Pickleball";
  const subtitle = searchParams.get("subtitle") || "Coach · Builder · Dad";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          backgroundImage:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.15), transparent 70%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background:
              "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 80px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#3b82f6",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              marginBottom: "20px",
            }}
          >
            sammorrispb.com
          </div>
          <div
            style={{
              fontSize: title.length > 40 ? 48 : 60,
              fontWeight: 900,
              color: "#f1f5f9",
              lineHeight: 1.1,
              marginBottom: "24px",
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#94a3b8",
              fontWeight: 400,
              maxWidth: "700px",
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#475569",
            fontSize: 18,
          }}
        >
          Montgomery County, MD · Dill Dinkers Rockville & North Bethesda
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
