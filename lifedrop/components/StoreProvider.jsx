"use client";

import { useEffect } from "react";
import { useStore, loadFromStorage, saveToStorage } from "@/lib/store";

export default function StoreProvider({ children }) {
  useEffect(() => {
    // 1. Load once on mount.
    loadFromStorage();

    // 2. Subscribe to every change, write to localStorage.
    const unsub = useStore.subscribe((state) => saveToStorage(state));

    return unsub;
  }, []);

  return children;
}
