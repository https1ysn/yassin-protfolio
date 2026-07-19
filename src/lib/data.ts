export const profile = {
  name: "Yassine El Biad",
  initials: "YE",
  role: "Junior Web Developer & Data Specialist",
  typingRoles: [
    "Junior Web Developer",
    "Data Entry Specialist",
    "Quality Controller",
    "WordPress Builder",
    "Excel Dashboard Maker",
  ],
  location: "Casablanca, Morocco",
  email: "elbiadyassin25@gmail.com",
  phone: "+212769145643",
  displayPhone: "(+212) 769 145 643",
  whatsapp: "https://wa.me/212769145643",
  // Add your profile URLs here when ready — cards render only when non-empty.
  linkedin: "",
  github: "",
  photo: "https://i.postimg.cc/k50Hj1x0/yassiiiin.jpg",
  cvFile: "/CV-Yassine-Elbiad.pdf",
  tagline:
    "I build clean, fast websites and airtight data workflows — with the discipline of someone trained on a factory floor, where a single defect is one too many.",
  availability: "Open to junior roles & freelance projects",
};

export const stats = [
  { value: 2, suffix: "+", label: "Years of professional experience" },
  { value: 4, suffix: "", label: "Industrial & data roles held" },
  { value: 5, suffix: "", label: "Diplomas & certifications earned" },
  { value: 3, suffix: "", label: "Languages spoken" },
];

export const aboutParagraphs = [
  "I'm Yassine — a junior web developer from Casablanca who came to code the unusual way: through factory floors, not bootcamps. At Leoni Wiring Systems, one of the world's largest automotive suppliers, I was the final quality gate — every cable harness I approved ended up inside a real car. You learn what \"attention to detail\" actually means when a missed defect has real consequences.",
  "That mindset carried into production data at Siera, Ines Plastic Industry, and Neo Data Production, where I turned thousands of raw daily entries into clean records and Excel dashboards people could act on. Somewhere in those spreadsheets I discovered the thing I enjoy most: taking something messy and making it reliable.",
  "That's why I build for the web. I earned international diplomas in web development & programming and applied accounting, then put them to work — this site is a full-stack project I built end to end: Next.js 15, TypeScript, Tailwind CSS, and a custom Supabase CMS with authentication, row-level security, and a complete admin dashboard. I care about the details most people skip: empty states, keyboard shortcuts, honest error messages.",
  "What I'm working toward: becoming the frontend engineer teams trust with quality — someone who ships fast without shipping defects. Everything on this page is real, and the site itself is my proof of work.",
];

export const strengths = [
  {
    title: "Zero-defect mindset",
    text: "Trained in final quality inspection — I test, validate, and double-check before anything ships.",
  },
  {
    title: "Data you can trust",
    text: "Years of high-accuracy data entry, validation, anomaly hunting, and dashboard reporting.",
  },
  {
    title: "Web foundations",
    text: "HTML, CSS, JavaScript, PHP, MySQL and WordPress — backed by two internationally recognized diplomas.",
  },
  {
    title: "Business literacy",
    text: "Applied accounting training (SAGE, Moroccan PCG) — I understand the numbers behind the product.",
  },
];

export const experience: {
  role: string;
  company: string;
  logo?: string;
  period: string;
  location: string;
  summary: string;
  bullets: string[];
  tags: string[];
}[] = [
  {
    role: "Data Entry Employee",
    company: "Neo Data Production",
    period: "Oct 2024 — Feb 2025",
    location: "Casablanca, Morocco",
    summary: "High-volume data operations where accuracy was the product being sold.",
    bullets: [
      "Processed high volumes of records daily in internal systems while keeping the error rate near zero — accuracy was the deliverable, not a nice-to-have.",
      "Restructured digital files into an organized, searchable documentation system the whole team relied on.",
      "Hit every data-processing deadline as part of a coordinated team working against daily quotas.",
    ],
    tags: ["Data Entry", "Documentation", "Teamwork"],
  },
  {
    role: "Product Quality Controller",
    company: "Leoni Wiring Systems",
    period: "Dec 2023 — Oct 2024",
    location: "Casablanca, Morocco",
    summary: "The last set of eyes on automotive cable harnesses before they shipped to carmakers.",
    bullets: [
      "Held final sign-off on product quality — nothing left the line without passing my inspection.",
      "Ran technical conformity checks against specification, catching defects before they could reach automotive customers.",
      "Documented and escalated defects clearly, then worked with quality teams to eliminate root causes — not just symptoms.",
      "Kept shipments moving under production deadlines: inspected, packed, and labeled finished products for delivery.",
    ],
    tags: ["Quality Control", "Inspection", "Automotive"],
  },
  {
    role: "Data Entry Agent",
    company: "Ines Plastic Industry",
    period: "Casablanca, Morocco",
    location: "Industrial production",
    summary: "Production data recording with verification built into every entry.",
    bullets: [
      "Recorded production data into internal systems and validated every entry before it entered reporting.",
      "Built and maintained an organized digital archive of production records the team could actually find things in.",
    ],
    tags: ["Data Validation", "Archiving"],
  },
  {
    role: "Data Entry Agent",
    company: "Siera",
    period: "Casablanca, Morocco",
    location: "Production data",
    summary: "Turned raw daily production numbers into dashboards people could act on.",
    bullets: [
      "Transformed daily production data into Excel dashboards and monitoring reports used for tracking output.",
      "Caught and corrected data anomalies at entry time — before they could silently corrupt weekly summaries.",
    ],
    tags: ["Excel", "Dashboards", "Reporting"],
  },
];

export const skillGroups = [
  {
    title: "Frontend",
    skills: [
      { name: "HTML & CSS", level: 78 },
      { name: "JavaScript", level: 62 },
      { name: "Responsive layout", level: 70 },
      { name: "WordPress", level: 65 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "PHP", level: 55 },
      { name: "MySQL", level: 55 },
    ],
  },
  {
    title: "Data & Office",
    skills: [
      { name: "Excel — formulas & pivot tables", level: 82 },
      { name: "Word & PowerPoint", level: 85 },
      { name: "Dashboards & reporting", level: 75 },
      { name: "SAGE accounting", level: 60 },
    ],
  },
  {
    title: "Design",
    skills: [
      { name: "Canva", level: 72 },
      { name: "Layout & visual balance", level: 58 },
      { name: "Adobe Photoshop", level: 42 },
    ],
  },
];

export const softSkills = [
  "Communication",
  "Teamwork",
  "Time management",
  "Problem solving",
  "Organization",
  "Adaptability",
  "Critical thinking",
  "Initiative & autonomy",
  "Reliability & punctuality",
];

export const languages = [
  { name: "Arabic", level: "Native", pct: 100 },
  { name: "French", level: "Independent user — B1/B2", pct: 65 },
  { name: "English", level: "Independent user — B1", pct: 55 },
];

export const projects: {
  title: string;
  category: string;
  problem: string;
  solution: string;
  features: string[];
  tech: string[];
  linkLabel: string;
  link: string;
  featured?: boolean;
  cover?: string;
  why?: string;
  challenge?: string;
  results?: string;
  lessons?: string;
}[] = [
  {
    title: "This Portfolio",
    category: "Web Development",
    featured: true,
    problem:
      "Junior developers all claim the same skills. A PDF can't demonstrate craft, and template portfolios prove nothing.",
    why: "A CV says what I did — this site shows how I work. I wanted proof-of-work a recruiter could click through, and a real full-stack project to grow on.",
    solution:
      "Designed and built end to end: Next.js 15 App Router, TypeScript, Tailwind CSS 4, Framer Motion + GSAP — plus a custom Supabase CMS with authentication, row-level security, a media library, and a full admin dashboard.",
    challenge:
      "Making the site fully database-driven without ever risking a broken page. Solved with a content layer that falls back to built-in data on any failure — the public site works even with no database configured.",
    results:
      "Everything on this page is served live from the CMS. Compositor-only animations keep the site at ~230 kB first load with zero console errors.",
    lessons:
      "Server components change how you think about data flow — and security belongs in the database (row-level security), not just the UI.",
    features: ["Custom Supabase CMS + admin dashboard", "Command palette (Ctrl+K)", "SEO, Open Graph & structured data"],
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "Supabase", "Framer Motion", "GSAP"],
    linkLabel: "You're looking at it",
    link: "#home",
  },
  {
    title: "Production Data Dashboards",
    category: "Data & Reporting",
    problem:
      "Factory teams at Siera needed daily visibility on production numbers scattered across raw entries.",
    why: "Real production work — supervisors needed decision-ready numbers, not spreadsheets full of raw entries.",
    solution:
      "Built and maintained Excel dashboards and monitoring reports that turned daily production data into clear, decision-ready summaries.",
    challenge:
      "Keeping the numbers trustworthy: daily entries arrived with inconsistencies that would silently corrupt weekly summaries. Solved by validating at entry time, not at review time.",
    results:
      "Reports that were actually used for daily tracking — with anomalies caught and corrected before they spread into reporting.",
    lessons: "A report is only as good as the discipline behind its data. Validation belongs at the point of entry.",
    features: ["Daily production tracking", "Pivot-table reporting", "Anomaly detection & correction"],
    tech: ["Excel", "Pivot Tables", "Data Validation"],
    linkLabel: "Internal work — details on request",
    link: "",
  },
  {
    title: "Accounting Workflow with SAGE",
    category: "Accounting & Data",
    problem: "Practical accounting demands clean books: entries, balances, and statements that reconcile.",
    why: "Six months of intensive training — I wanted business literacy, not just code: understanding the numbers a company actually runs on.",
    solution:
      "Processed accounting entries in SAGE and Excel and produced balance sheets and income statements aligned with the Moroccan General Chart of Accounts.",
    challenge:
      "Reconciliation — making entries, balances, and statements agree under the Moroccan PCG. Small input errors compound fast; the fix was systematic double-checking at each stage.",
    results: "Clean balance sheets and income statements that reconciled, produced in both SAGE and Excel.",
    lessons:
      "Accounting taught me the same lesson as quality control: rigor is a habit, and small errors compound quickly.",
    features: ["Journal entries in SAGE", "Balance sheets & income statements", "Moroccan PCG compliance"],
    tech: ["SAGE", "Excel", "Accounting"],
    linkLabel: "Certified training project",
    link: "",
  },
];

export const services = [
  {
    title: "Website Development",
    text: "Landing pages, portfolios, and small-business sites built with HTML, CSS, JavaScript, or WordPress — clean, responsive, and fast.",
  },
  {
    title: "Data Entry & Cleaning",
    text: "High-accuracy data entry, validation, deduplication, and file organization. Trained to industrial precision standards.",
  },
  {
    title: "Excel Dashboards & Reports",
    text: "Formulas, pivot tables, and monitoring dashboards that turn raw numbers into decisions.",
  },
  {
    title: "Accounting Support",
    text: "Entry processing in SAGE, simple balance sheets and income statements under the Moroccan PCG.",
  },
];

export const certificates: { title: string; issuer: string; date: string; url: string; image: string }[] = [
  {
    title: "International Diploma — Web Development & Programming",
    issuer: "Smart International Academy, London",
    date: "",
    url: "",
    image: "",
  },
  {
    title: "International Diploma — Applied Accounting",
    issuer: "Smart International Academy, London",
    date: "",
    url: "",
    image: "",
  },
  {
    title: "Training Attestation — Web Development & Programming",
    issuer: "Centre Atlantique de Formation",
    date: "Dec 2024",
    url: "",
    image: "",
  },
  {
    title: "Training Attestation — Practical Accounting with SAGE",
    issuer: "Centre Atlantique de Formation",
    date: "Jul 2024",
    url: "",
    image: "",
  },
  {
    title: "Course Certificate — Front-End Development",
    issuer: "Sololearn",
    date: "Sep 2024",
    url: "",
    image: "",
  },
];

export const education = [
  {
    title: "International Diploma — Web Development & Programming",
    org: "Centre Atlantique de Formation × Smart International Academy, London",
    meta: "Casablanca, Morocco",
  },
  {
    title: "International Diploma — Applied Accounting",
    org: "Centre Atlantique de Formation × Smart International Academy, London",
    meta: "Casablanca, Morocco",
  },
  {
    title: "Training Attestation — Web Development & Programming",
    org: "Centre Atlantique de Formation",
    meta: "Dec 2024 · Casablanca",
  },
  {
    title: "Training Attestation — Practical Accounting with SAGE (6 months)",
    org: "Centre Atlantique de Formation",
    meta: "Jul 2024 · Casablanca",
  },
  {
    title: "Course Certificate — Front-End Development",
    org: "Sololearn — Online Training Platform",
    meta: "Sep 2024 · Online",
  },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];
