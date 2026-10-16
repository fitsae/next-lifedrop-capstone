import { requests } from "@/lib/requests";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://lifedrop.et";

export default function sitemap() {
  const now = new Date();
  const staticRoutes = [
    {
      url: `${BASE}/`,
      priority: 1.0,
      changeFrequency: "weekly",
      lastModified: now,
    },
    {
      url: `${BASE}/requests`,
      priority: 0.9,
      changeFrequency: "hourly",
      lastModified: now,
    },
    {
      url: `${BASE}/donate`,
      priority: 0.8,
      changeFrequency: "monthly",
      lastModified: now,
    },
    {
      url: `${BASE}/about`,
      priority: 0.5,
      changeFrequency: "monthly",
      lastModified: now,
    },
  ];

  const requestRoutes = requests.map((r) => ({
    url: `${BASE}/requests/${r.id}`,
    priority: 0.7,
    changeFrequency: "daily",
    lastModified: new Date(r.createdAt),
  }));

  return [...staticRoutes, ...requestRoutes];
}
