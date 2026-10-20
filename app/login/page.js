import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="card" style={{ maxWidth: 460, margin: "0 auto" }}>
      <h1>Sign in</h1>
      <p className="text-muted">
        For hospitals and the LifeDrop administrator.
      </p>

      <Suspense fallback={<p>Loading form…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
