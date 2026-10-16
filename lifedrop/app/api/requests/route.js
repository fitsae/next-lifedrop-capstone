import { searchRequests } from "@/lib/requests";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const bloodType = searchParams.get("bloodType") || "";
  const city = searchParams.get("city") || "";
  const urgency = searchParams.get("urgency") || "";

  const results = searchRequests({ bloodType, city, urgency });
  return Response.json({ data: results, total: results.length });
}
