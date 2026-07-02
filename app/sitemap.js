export const revalidate = 21600; // 6 hours

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  let professors = [];
  let universities = [];

  try {
    const resProfessors = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/professors`,
      { cache: "no-cache" },
    );
    professors = await resProfessors.json();
  } catch (error) {
    console.error("Error fetching professors for sitemap:", error);
  }

  try {
    const resUniversities = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_BASE_URL}/universities`,
      { cache: "force-cache" },
    );
    universities = await resUniversities.json();
  } catch (error) {
    console.error("Error fetching universities for sitemap:", error);
  }

  return [
    {
      url: baseUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/universities`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sitemaps/universities-sitemap.xml`,
    },
    {
      url: `${baseUrl}/notifications`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community-guidelines`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...professors.map((professor) => ({
      url: `${baseUrl}/professor/${professor.slug}`,
      lastModified: professor.updatedAt || professor.createdAt || new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    })),
    // ...universities.map((university) => ({
    //   url: `${baseUrl}/university/${university._id}`,
    //   changeFrequency: "weekly",
    //   priority: 0.7,
    // })),
  ];
}
