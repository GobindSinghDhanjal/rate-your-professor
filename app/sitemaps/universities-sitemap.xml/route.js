export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const res = await fetch(
    `${process.env.BASE_URL}/universities`,
    {
      next: { revalidate: 86400 },
    },
  );

  const universities = await res.json();

  // Random date between May 1, 2026 and June 15, 2026
  function getRandomDate() {
    const start = new Date("2026-05-01").getTime();
    const end = new Date("2026-06-15").getTime();

    return new Date(start + Math.random() * (end - start)).toISOString();
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${universities
  .map(
    (university) => `
<url>
  <loc>${baseUrl}/university/${university.slug}</loc>
  <lastmod>${getRandomDate()}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>`,
  )
  .join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
