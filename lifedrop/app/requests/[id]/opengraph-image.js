import { ImageResponse } from "next/og";
import { findRequest } from "@/lib/requests";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }) {
  const { id } = await params;
  const req = findRequest(id);
  const bloodType = req?.bloodType ?? "Blood";
  const hospital = req?.hospital ?? "LifeDrop";
  const city = req?.city ?? "";

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
      <div style={{ fontSize: 140, fontWeight: 800 }}>{bloodType}</div>
      <div style={{ fontSize: 48, marginTop: 20 }}>needed at {hospital}</div>
      <div style={{ fontSize: 32, marginTop: 30, color: "#ffcdd2" }}>
        {city}
      </div>
    </div>,
    size,
  );
}
