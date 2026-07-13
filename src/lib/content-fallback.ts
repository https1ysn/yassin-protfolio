import {
  profile as fallbackProfile,
  stats as fallbackStats,
  aboutParagraphs as fallbackAbout,
  strengths as fallbackStrengths,
  experience as fallbackExperience,
  skillGroups as fallbackSkillGroups,
  softSkills as fallbackSoftSkills,
  languages as fallbackLanguages,
  projects as fallbackProjects,
  services as fallbackServices,
  education as fallbackEducation,
} from "@/lib/data";

export type SocialLink = { platform: string; label: string; url: string };

export type SiteSettings = {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  showLoader: boolean;
  enableAnimations: boolean;
  enableCustomCursor: boolean;
  enableParticles: boolean;
};

export type SeoData = {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  twitterCard: string;
  robots: string;
  canonicalUrl: string;
};

export type SiteContent = {
  profile: typeof fallbackProfile;
  stats: typeof fallbackStats;
  aboutParagraphs: string[];
  strengths: typeof fallbackStrengths;
  experience: typeof fallbackExperience;
  skillGroups: typeof fallbackSkillGroups;
  softSkills: string[];
  languages: typeof fallbackLanguages;
  projects: typeof fallbackProjects;
  services: typeof fallbackServices;
  education: typeof fallbackEducation;
  socialLinks: SocialLink[];
  settings: SiteSettings;
};

export const defaultSettings: SiteSettings = {
  siteName: "Yassine El Biad",
  logoUrl: "",
  faviconUrl: "",
  primaryColor: "#4F46E5",
  secondaryColor: "#7C3AED",
  accentColor: "#06B6D4",
  showLoader: true,
  enableAnimations: true,
  enableCustomCursor: true,
  enableParticles: true,
};

export const defaultSeo: SeoData = {
  title: "Yassine El Biad — Junior Web Developer & Data Specialist",
  description:
    "Junior web developer and data specialist in Casablanca, Morocco. HTML, CSS, JavaScript, PHP, MySQL, WordPress, Excel dashboards, and industrial-grade quality control.",
  keywords: [
    "Yassine El Biad",
    "web developer Casablanca",
    "junior web developer Morocco",
    "data entry specialist",
    "WordPress developer",
  ],
  ogTitle: "",
  ogDescription: "",
  ogImageUrl: "",
  twitterCard: "summary_large_image",
  robots: "index, follow",
  canonicalUrl: "",
};

export const fallbackContent: SiteContent = {
  profile: fallbackProfile,
  stats: fallbackStats,
  aboutParagraphs: fallbackAbout,
  strengths: fallbackStrengths,
  experience: fallbackExperience,
  skillGroups: fallbackSkillGroups,
  softSkills: fallbackSoftSkills,
  languages: fallbackLanguages,
  projects: fallbackProjects,
  services: fallbackServices,
  education: fallbackEducation,
  socialLinks: [],
  settings: defaultSettings,
};
