"use client";

import { useEffect, useState } from "react";

export function useSession() {
  const [session, setSession] = useState(undefined); // undefined = loading

  useEffect(() => {
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then(setSession)
      .catch(() => setSession(null));
  }, []);

  return session;
}
