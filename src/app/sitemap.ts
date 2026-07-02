import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://influq.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/onboarding"];
  return routes.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
