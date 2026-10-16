import Link from "next/link";
import { notFound } from "next/navigation";
import { findRequest, requests } from "@/lib/requests";

export function generateStaticParams() {
  return requests.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const req = findRequest(id);
  if (!req) return { title: "Request not found", robots: { index: false } };

  return {
    title: `${req.bloodType} needed at ${req.hospital}`,
    description: `${req.units} unit(s) of ${req.bloodType} blood needed at ${req.hospital}, ${req.city}.`,
    alternates: { canonical: `/requests/${req.id}` },
    openGraph: {
      title: `${req.bloodType} blood needed — ${req.hospital}`,
      description: `${req.units} unit(s) needed in ${req.city}.`,
    },
  };
}

export default async function RequestDetailPage({ params }) {
  const { id } = await params;
  const req = findRequest(id);
  if (!req) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: `Blood donation request — ${req.bloodType}`,
    description: `${req.units} unit(s) of ${req.bloodType} blood needed at ${req.hospital}, ${req.city}.`,
  };

  return (
    <article className="card">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/requests" className="text-muted">
        ← Back to requests
      </Link>

      <div className="flex items-center gap-2 mt-4 mb-2">
        <span className="badge badge-blood">{req.bloodType}</span>
        <span className={`badge badge-${req.urgency}`}>{req.urgency}</span>
      </div>

      <h1>{req.bloodType} blood needed</h1>
      <p className="text-muted">
        {req.units} unit{req.units > 1 ? "s" : ""} needed at {req.hospital},{" "}
        {req.city}.
      </p>

      <div className="card">
        <h3>Hospital</h3>
        <p>{req.hospital}</p>
        <p className="text-muted">{req.city}</p>
      </div>

      <div className="card">
        <h3>Contact</h3>
        <p>{req.contactName}</p>
        <p>
          <a href={`tel:${req.contactPhone}`}>{req.contactPhone}</a>
        </p>
      </div>

      {req.notes && (
        <div className="card">
          <h3>Notes</h3>
          <p>{req.notes}</p>
        </div>
      )}
    </article>
  );
}
