export const metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/dashboard";

  return (
    <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h1>Sign in</h1>
      <p className="text-muted">For hospitals and LifeDrop administrators.</p>

      <form action="/api/auth/signin" method="post">
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>

        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required />
        </div>

        <input type="hidden" name="next" value={next} />

        <button type="submit" className="btn btn-primary">
          Sign in
        </button>
      </form>

      <p className="text-muted mt-4" style={{ fontSize: "0.85rem" }}>
        Demo — hospital: <code>hospital@lifedrop.et</code> · admin:{" "}
        <code>admin@lifedrop.et</code>
        <br />
        Password: <code>lifedrop123</code>
      </p>
    </div>
  );
}
