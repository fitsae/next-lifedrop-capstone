import Link from "next/link";

export default function RequestCard({ request }) {
  return (
    <article className="card">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="badge badge-blood">{request.bloodType}</span>
        <span className={`badge badge-${request.urgency}`}>
          {request.urgency}
        </span>
      </div>
      <h3>
        <Link href={`/requests/${request.id}`}>{request.hospital}</Link>
      </h3>
      <p className="text-muted">{request.city}</p>
      <p className="text-muted">
        {request.units} unit{request.units > 1 ? "s" : ""} needed
      </p>
      <Link href={`/requests/${request.id}`} className="btn btn-outline mt-2">
        View details
      </Link>
    </article>
  );
}
