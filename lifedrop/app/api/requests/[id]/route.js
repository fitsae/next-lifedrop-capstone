import { findRequest } from "@/lib/requests";

export async function GET(request, { params }) {
  const { id } = await params;
  const req = findRequest(id);
  if (!req) {
    return Response.json({ error: "Request not found" }, { status: 404 });
  }
  return Response.json(req);
}
