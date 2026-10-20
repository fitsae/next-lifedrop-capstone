import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#b71c1c",
        color: "#fff",
      }}
    >
      <div style={{ fontSize: 96, fontWeight: 800 }}>LifeDrop</div>
      <div style={{ fontSize: 44, marginTop: 20, color: "#ffcdd2" }}>
        Blood request
      </div>
      <div style={{ fontSize: 32, marginTop: 30 }}>
        Find blood. Save a life.
      </div>
    </div>,
    size,
  );
}
