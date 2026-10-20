import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="card"
      style={{ textAlign: "center", padding: "3rem 1.25rem" }}
    >
      <h1>Page not found</h1>
      <p className="text-muted">The page you are looking for does not exist.</p>
      <Link href="/" className="btn btn-primary mt-4">
        Back to Home
      </Link>
    </div>
  );
}
