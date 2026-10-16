import Link from "next/link";
import { searchRequests } from "@/lib/requests";
import RequestCard from "@/components/RequestCard";

export default function HomePage() {
  const urgent = searchRequests()
    .filter((r) => r.urgency === "high")
    .slice(0, 3);

  return (
    <div>
      <section className="hero">
        <h1>Find blood. Save a life.</h1>
        <p>Search for blood requests by type and city across Ethiopia.</p>
        <div className="mt-4">
          <Link href="/requests" className="btn btn-primary">
            Find a Request
          </Link>{" "}
          <Link href="/donate" className="btn btn-outline">
            Become a Donor
          </Link>
        </div>
      </section>

      <section className="mb-6">
        <h2>Urgent requests</h2>
        <div className="grid grid-3">
          {urgent.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>
      </section>

      <section>
        <h2>How LifeDrop works</h2>
        <div className="grid grid-3">
          <div className="card">
            <h3>1. Search</h3>
            <p className="text-muted">
              Filter by blood type and city to see open requests near you.
            </p>
          </div>
          <div className="card">
            <h3>2. Contact</h3>
            <p className="text-muted">
              Open a request to see the hospital and contact phone number.
            </p>
          </div>
          <div className="card">
            <h3>3. Donate</h3>
            <p className="text-muted">
              Visit the hospital and donate. Your one donation can save three
              lives.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
