import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { getSeo } from "@/lib/content";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo();
  const title = seo.title;
  const description = seo.description;

  return {
    title,
    description,
    keywords: seo.keywords,
    authors: [{ name: "Yassine El Biad" }],
    robots: seo.robots,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    openGraph: {
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      type: "website",
      locale: "en_US",
      siteName: "Yassine El Biad",
      images: seo.ogImageUrl ? [{ url: seo.ogImageUrl }] : undefined,
    },
    twitter: {
      card: (seo.twitterCard as "summary_large_image") || "summary_large_image",
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      images: seo.ogImageUrl ? [seo.ogImageUrl] : undefined,
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Yassine El Biad",
  jobTitle: "Junior Web Developer & Data Specialist",
  email: "mailto:elbiadyassin25@gmail.com",
  telephone: "+212769145643",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Casablanca",
    addressCountry: "MA",
  },
  knowsAbout: [
    "Web Development",
    "HTML",
    "CSS",
    "JavaScript",
    "PHP",
    "MySQL",
    "WordPress",
    "Data Entry",
    "Quality Control",
    "Excel",
    "Accounting",
  ],
  knowsLanguage: ["Arabic", "French", "English"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="noise">
        <a href="#home" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
