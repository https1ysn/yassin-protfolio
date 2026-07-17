import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });

export const metadata: Metadata = {
  title: "Yassine El Biad",
  description: "Junior web developer and data specialist in Casablanca, Morocco.",
  robots: { index: false }, // the language selector and admin are not for search engines
};

/** Root layout for the language selector and the admin dashboard (always LTR/EN). */
export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="noise">{children}</body>
    </html>
  );
}
