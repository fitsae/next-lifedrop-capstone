import { addDonor } from "@/lib/donors";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid JSON" }, { status: 400 });

  const { name, bloodType, city, phone, lastDonation } = body;

  const errors = {};
  if (!name || name.length < 2) errors.name = "Name required.";
  if (!bloodType) errors.bloodType = "Blood type required.";
  if (!city) errors.city = "City required.";
  if (!phone || !/^(?:\+251|0)9\d{8}$/.test(phone))
    errors.phone = "Invalid Ethiopian phone number.";

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 422 });
  }

  const donor = addDonor({ name, bloodType, city, phone, lastDonation });
  return Response.json({ donor }, { status: 201 });
}
