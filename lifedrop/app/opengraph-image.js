import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "LifeDrop — Blood Donor & Request Finder";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "linear-gradient(180deg, #fff, #ffecec)",
        color: "#b71c1c",
      }}
    >
      <div style={{ fontSize: 96, fontWeight: 700 }}>LifeDrop</div>
      <div style={{ fontSize: 40, marginTop: 20, color: "#6b7280" }}>
        Find blood. Save a life.
      </div>
    </div>,
    size,
  );
}
