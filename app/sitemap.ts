import type { MetadataRoute } from "next";

const baseUrl = "https://alihexan.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    { url: `${baseUrl}/fbprivacypolicy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/fbdatadeletion`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];
}
