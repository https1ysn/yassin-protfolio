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
  "My story doesn't start in a bootcamp — it starts on the production line at Leoni Wiring Systems, one of the world's largest automotive suppliers. As a quality controller, my job was simple to describe and hard to do: nothing imperfect leaves the building. Every cable harness I signed off on ended up inside a real car. That kind of responsibility rewires how you work.",
  "From quality control I moved into production data — at Siera, Ines Plastic Industry, and Neo Data Production — turning thousands of daily data points into clean records, Excel dashboards, and reports people could actually trust. Accuracy stopped being a skill and became a habit.",
  "In parallel, I earned international diplomas in web development & programming and applied accounting, and I've been building ever since: semantic HTML, modern CSS, JavaScript, PHP & MySQL backends, and WordPress sites. I bring an industrial standard of rigor to every line of code — because I learned precision where it costs real money to get it wrong.",
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

export const experience = [
  {
    role: "Data Entry Employee",
    company: "Neo Data Production",
    period: "Oct 2024 — Feb 2025",
    location: "Casablanca, Morocco",
    summary: "High-volume digital data operations with strict deadlines.",
    bullets: [
      "Entered and updated data in internal systems with a near-zero error rate.",
      "Managed digital files and maintained organized, searchable documentation.",
      "Collaborated with the team to consistently hit data-processing deadlines.",
    ],
    tags: ["Data Entry", "Documentation", "Teamwork"],
  },
  {
    role: "Product Quality Controller",
    company: "Leoni Wiring Systems",
    period: "Dec 2023 — Oct 2024",
    location: "Casablanca, Morocco",
    summary: "Final quality gate for automotive cable harnesses before shipment.",
    bullets: [
      "Performed final quality control on cable harnesses before expedition.",
      "Ran technical inspections to guarantee conformity with specifications.",
      "Packed and labeled finished products for delivery.",
      "Reported defects and worked with quality teams to resolve root causes.",
    ],
    tags: ["Quality Control", "Inspection", "Automotive"],
  },
  {
    role: "Data Entry Agent",
    company: "Ines Plastic Industry",
    period: "Casablanca, Morocco",
    location: "Industrial production",
    summary: "Production data recording and validation in internal systems.",
    bullets: [
      "Entered and recorded production data in internal systems.",
      "Verified and validated entries to guarantee accuracy.",
      "Archived and organized digital production files.",
    ],
    tags: ["Data Validation", "Archiving"],
  },
  {
    role: "Data Entry Agent",
    company: "Siera",
    period: "Casablanca, Morocco",
    location: "Production data",
    summary: "Daily production reporting and Excel dashboarding.",
    bullets: [
      "Processed daily production data in Microsoft Excel.",
      "Built and maintained dashboards and monitoring reports.",
      "Checked data consistency and corrected detected anomalies.",
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

export const projects = [
  {
    title: "This Portfolio",
    category: "Web Development",
    problem: "A CV alone can't show how someone works — recruiters need to feel the craft.",
    solution:
      "Designed and shipped this site with Next.js 15, TypeScript, Tailwind CSS and Framer Motion: smooth scrolling, magnetic buttons, a command palette, and a fully responsive dark interface.",
    features: ["Custom cursor & animations", "Command palette (Ctrl+K)", "SEO & Open Graph ready"],
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP"],
    linkLabel: "You're looking at it",
    link: "#home",
  },
  {
    title: "Production Data Dashboards",
    category: "Data & Reporting",
    problem: "Factory teams at Siera needed daily visibility on production numbers scattered across raw entries.",
    solution:
      "Built and maintained Excel dashboards and monitoring reports that turned daily production data into clear, decision-ready summaries — with consistency checks that caught anomalies before they spread.",
    features: ["Daily production tracking", "Pivot-table reporting", "Anomaly detection & correction"],
    tech: ["Excel", "Pivot Tables", "Data Validation"],
    linkLabel: "Internal work — details on request",
    link: "",
  },
  {
    title: "Accounting Workflow with SAGE",
    category: "Accounting & Data",
    problem: "Practical accounting demands clean books: entries, balances, and statements that reconcile.",
    solution:
      "Through a 6-month intensive training, processed accounting entries in SAGE and Excel and produced simple balance sheets and income statements aligned with the Moroccan General Chart of Accounts.",
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
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];
