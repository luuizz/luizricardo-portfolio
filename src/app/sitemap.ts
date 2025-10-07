import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://luizricardotech.com.br";

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 3,
    },

    {
      url: `${baseUrl}/projeto`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 4,
    },

    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 5,
    },
  ];
}
