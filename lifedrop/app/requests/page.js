import RequestsClient from "./RequestsClient";

export const metadata = {
  title: "Blood Requests",
  description:
    "Browse open blood requests across Ethiopia. Filter by blood type and city.",
  alternates: { canonical: "/requests" },
};

export default function RequestsPage() {
  return (
    <div>
      <h1>Blood Requests</h1>
      <p className="text-muted mb-6">
        Search open requests by blood type and city.
      </p>
      <RequestsClient />
    </div>
  );
}
