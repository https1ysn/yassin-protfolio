/**
 * Fills the *_fr / *_ar variant columns with translations of the seeded
 * content. Idempotent: matches rows by slug / company / English text and
 * simply overwrites the variant columns. Custom rows you add later are
 * untouched — translate those in the admin's FR / AR tabs.
 *
 *   npx tsx scripts/translate-content.ts   (requires migration-004)
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const secret = (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)!;
const db = createClient(url, secret, { auth: { persistSession: false } });

/* eslint-disable @typescript-eslint/no-explicit-any */
async function main() {
  // guard: migration-004 must be applied
  const probe = await db.from("profile").select("role_fr").limit(1);
  if (probe.error) {
    console.error("❌ Migration 004 not applied — run supabase/migration-004.sql in the SQL Editor first.");
    process.exit(1);
  }

  const log = (label: string, error: any) => console.log(error ? `❌ ${label}: ${error.message}` : `✓ ${label}`);

  // ---------- profile ----------
  {
    const { error } = await db.from("profile").update({
      role_fr: "Développeur Web Junior & Spécialiste des Données",
      role_ar: "مطوّر ويب مبتدئ ومتخصص في البيانات",
      tagline_fr:
        "Je construis des sites web propres et rapides, et des flux de données irréprochables — avec la discipline de quelqu'un formé en usine, où un seul défaut est déjà de trop.",
      tagline_ar:
        "أبني مواقع ويب نظيفة وسريعة وأنظمة بيانات محكمة — بانضباط اكتسبته في المصنع، حيث عيب واحد يُعدّ كثيرًا.",
      availability_fr: "Ouvert aux postes juniors & missions freelance",
      availability_ar: "متاح للوظائف المبتدئة ومشاريع العمل الحر",
      typing_roles_fr: [
        "Développeur Web Junior",
        "Spécialiste Saisie de Données",
        "Contrôleur Qualité",
        "Créateur WordPress",
        "Expert Tableaux Excel",
      ],
      typing_roles_ar: [
        "مطوّر ويب مبتدئ",
        "متخصص إدخال البيانات",
        "مراقب جودة",
        "منشئ مواقع WordPress",
        "محترف لوحات Excel",
      ],
    }).eq("id", 1);
    log("profile", error);
  }

  // ---------- hero stats ----------
  {
    const { data: hero } = await db.from("hero").select("stats").eq("id", 1).maybeSingle();
    const stats = (hero?.stats as { value: number; suffix: string; label: string }[]) ?? [];
    const frLabels = [
      "Années d'expérience professionnelle",
      "Postes industriels & data occupés",
      "Diplômes & certifications obtenus",
      "Langues parlées",
    ];
    const arLabels = [
      "سنوات من الخبرة المهنية",
      "مناصب في الصناعة والبيانات",
      "دبلومات وشهادات محصّلة",
      "لغات أتحدثها",
    ];
    const { error } = await db.from("hero").update({
      stats_fr: stats.map((s, i) => ({ ...s, label: frLabels[i] ?? s.label })),
      stats_ar: stats.map((s, i) => ({ ...s, label: arLabels[i] ?? s.label })),
    }).eq("id", 1);
    log("hero stats", error);
  }

  // ---------- about ----------
  {
    const { error } = await db.from("about").update({
      paragraphs_fr: [
        "Je m'appelle Yassine — un développeur web junior de Casablanca arrivé au code par un chemin inhabituel : les ateliers d'usine, pas les bootcamps. Chez Leoni Wiring Systems, l'un des plus grands équipementiers automobiles au monde, j'étais le dernier contrôle qualité — chaque faisceau de câbles que je validais finissait dans une vraie voiture. On apprend ce que « souci du détail » veut vraiment dire quand un défaut manqué a des conséquences réelles.",
        "Cet état d'esprit m'a suivi dans les données de production chez Siera, Ines Plastic Industry et Neo Data Production, où j'ai transformé des milliers de saisies quotidiennes en registres propres et en tableaux de bord Excel exploitables. C'est dans ces tableurs que j'ai découvert ce que j'aime le plus : prendre quelque chose de désordonné et le rendre fiable.",
        "C'est pour cela que je développe pour le web. J'ai obtenu des diplômes internationaux en développement web & programmation et en comptabilité appliquée, puis je les ai mis en pratique — ce site est un projet full-stack que j'ai construit de bout en bout : Next.js 15, TypeScript, Tailwind CSS et un CMS Supabase sur mesure avec authentification, sécurité au niveau des lignes et un tableau de bord d'administration complet. Je soigne les détails que la plupart des gens négligent : états vides, raccourcis clavier, messages d'erreur honnêtes.",
        "Mon objectif : devenir le développeur frontend à qui les équipes confient la qualité — quelqu'un qui livre vite sans livrer de défauts. Tout ce qui figure sur cette page est réel, et ce site en est la preuve.",
      ],
      paragraphs_ar: [
        "أنا ياسين — مطوّر ويب مبتدئ من الدار البيضاء وصلت إلى البرمجة بطريق غير مألوف: أرضيات المصانع، لا المعسكرات التدريبية. في شركة Leoni Wiring Systems، إحدى أكبر شركات تجهيزات السيارات في العالم، كنت آخر بوابة لمراقبة الجودة — كل حزمة كابلات أوقّع عليها تنتهي داخل سيارة حقيقية. تتعلم المعنى الحقيقي لـ«الدقة في التفاصيل» عندما يكون للعيب الذي يفوتك عواقب فعلية.",
        "رافقتني هذه العقلية إلى بيانات الإنتاج في Siera وInes Plastic Industry وNeo Data Production، حيث حوّلت آلاف الإدخالات اليومية الخام إلى سجلات نظيفة ولوحات Excel قابلة للاستخدام. بين تلك الجداول اكتشفت أكثر ما أحب: أخذ شيء فوضوي وجعله موثوقًا.",
        "لهذا أبني للويب. حصلت على دبلومات دولية في تطوير الويب والبرمجة وفي المحاسبة التطبيقية، ثم طبّقتها عمليًا — هذا الموقع مشروع متكامل بنيته من الألف إلى الياء: Next.js 15 وTypeScript وTailwind CSS ونظام إدارة محتوى مخصص بـSupabase مع مصادقة وأمان على مستوى الصفوف ولوحة تحكم كاملة. أهتم بالتفاصيل التي يتجاهلها معظم الناس: الحالات الفارغة، اختصارات لوحة المفاتيح، رسائل الخطأ الصادقة.",
        "ما أسعى إليه: أن أصبح مطوّر الواجهات الذي تثق الفرق في جودته — شخص يسلّم بسرعة دون أن يسلّم عيوبًا. كل ما في هذه الصفحة حقيقي، وهذا الموقع نفسه هو دليلي.",
      ],
      strengths_fr: [
        { title: "Zéro défaut", text: "Formé au contrôle final — je teste, je valide et je revérifie avant toute livraison." },
        { title: "Des données fiables", text: "Des années de saisie de haute précision, de validation, de chasse aux anomalies et de reporting." },
        { title: "Bases web solides", text: "HTML, CSS, JavaScript, PHP, MySQL et WordPress — appuyés par deux diplômes internationaux." },
        { title: "Culture business", text: "Formation en comptabilité appliquée (SAGE, PCG marocain) — je comprends les chiffres derrière le produit." },
      ],
      strengths_ar: [
        { title: "عقلية صفر عيوب", text: "تدرّبت على الفحص النهائي — أختبر وأتحقق وأراجع قبل أي تسليم." },
        { title: "بيانات موثوقة", text: "سنوات من الإدخال عالي الدقة والتحقق وتعقّب الأخطاء وإعداد التقارير." },
        { title: "أسس الويب", text: "HTML وCSS وJavaScript وPHP وMySQL وWordPress — مدعومة بدبلومين دوليين." },
        { title: "ثقافة الأعمال", text: "تكوين في المحاسبة التطبيقية (SAGE والمخطط المحاسبي المغربي) — أفهم الأرقام وراء المنتج." },
      ],
    }).eq("id", 1);
    log("about", error);
  }

  // ---------- experience (matched by company) ----------
  const xp: Record<string, any> = {
    "Neo Data Production": {
      role_fr: "Agent de Saisie de Données", role_ar: "موظف إدخال بيانات",
      summary_fr: "Des opérations de données à haut volume où la précision était le produit vendu.",
      summary_ar: "عمليات بيانات بكميات كبيرة كانت الدقة فيها هي المنتج المطلوب.",
      bullets_fr: [
        "Traitement quotidien de gros volumes d'enregistrements avec un taux d'erreur proche de zéro — la précision était le livrable, pas une option.",
        "Restructuration des fichiers numériques en un système documentaire organisé et consultable, utilisé par toute l'équipe.",
        "Respect de toutes les échéances de traitement au sein d'une équipe coordonnée travaillant avec des quotas quotidiens.",
      ],
      bullets_ar: [
        "معالجة كميات كبيرة من السجلات يوميًا مع نسبة خطأ تقارب الصفر — كانت الدقة هي المطلوب لا ميزة إضافية.",
        "إعادة هيكلة الملفات الرقمية في نظام توثيق منظم وسهل البحث اعتمد عليه الفريق كله.",
        "الالتزام بجميع مواعيد المعالجة ضمن فريق منسّق يعمل وفق حصص يومية.",
      ],
    },
    "Leoni Wiring Systems": {
      role_fr: "Contrôleur Qualité Produit", role_ar: "مراقب جودة المنتجات",
      summary_fr: "Le dernier regard sur les faisceaux de câbles automobiles avant leur expédition aux constructeurs.",
      summary_ar: "آخر عين تفحص حزم الكابلات قبل شحنها إلى مصنّعي السيارات.",
      bullets_fr: [
        "Validation finale de la qualité produit — rien ne quittait la ligne sans passer mon inspection.",
        "Contrôles techniques de conformité aux spécifications, avec détection des défauts avant qu'ils n'atteignent les clients automobiles.",
        "Documentation et signalement clairs des défauts, puis travail avec les équipes qualité pour éliminer les causes racines — pas seulement les symptômes.",
        "Maintien du rythme des expéditions sous contraintes de production : inspection, emballage et étiquetage des produits finis.",
      ],
      bullets_ar: [
        "التوقيع النهائي على جودة المنتج — لا شيء يغادر الخط دون أن يجتاز فحصي.",
        "فحوصات مطابقة تقنية وفق المواصفات، مع اكتشاف العيوب قبل وصولها إلى عملاء صناعة السيارات.",
        "توثيق العيوب والإبلاغ عنها بوضوح، ثم العمل مع فرق الجودة لمعالجة الأسباب الجذرية لا الأعراض فقط.",
        "الحفاظ على وتيرة الشحن تحت ضغط الإنتاج: فحص المنتجات النهائية وتغليفها ووسمها للتسليم.",
      ],
    },
    "Ines Plastic Industry": {
      role_fr: "Agent de Saisie de Données", role_ar: "عون إدخال بيانات",
      summary_fr: "Enregistrement des données de production avec vérification intégrée à chaque saisie.",
      summary_ar: "تسجيل بيانات الإنتاج مع تحقق مدمج في كل إدخال.",
      bullets_fr: [
        "Enregistrement des données de production dans les systèmes internes avec validation de chaque saisie avant intégration au reporting.",
        "Construction et maintenance d'archives numériques de production organisées, où l'équipe retrouvait réellement l'information.",
      ],
      bullets_ar: [
        "تسجيل بيانات الإنتاج في الأنظمة الداخلية والتحقق من كل إدخال قبل دخوله إلى التقارير.",
        "بناء أرشيف رقمي منظم لسجلات الإنتاج يستطيع الفريق فعلاً إيجاد ما يبحث عنه فيه.",
      ],
    },
    "Siera": {
      role_fr: "Agent de Saisie de Données", role_ar: "عون إدخال بيانات",
      summary_fr: "Des chiffres bruts de production transformés en tableaux de bord exploitables.",
      summary_ar: "تحويل أرقام الإنتاج الخام إلى لوحات متابعة يمكن التصرف بناء عليها.",
      bullets_fr: [
        "Transformation des données de production quotidiennes en tableaux de bord Excel et rapports de suivi utilisés pour piloter la production.",
        "Détection et correction des anomalies dès la saisie — avant qu'elles ne corrompent silencieusement les synthèses hebdomadaires.",
      ],
      bullets_ar: [
        "تحويل بيانات الإنتاج اليومية إلى لوحات Excel وتقارير متابعة تُستخدم في تتبّع الإنتاج.",
        "اكتشاف الأخطاء وتصحيحها عند الإدخال — قبل أن تفسد الملخصات الأسبوعية بصمت.",
      ],
    },
  };
  for (const [company, values] of Object.entries(xp)) {
    const { error } = await db.from("experience").update(values).eq("company", company);
    log(`experience: ${company}`, error);
  }

  // ---------- education (matched by English title) ----------
  const edu: [string, any][] = [
    ["International Diploma — Web Development & Programming", {
      title_fr: "Diplôme International — Développement Web & Programmation",
      title_ar: "دبلوم دولي — تطوير الويب والبرمجة",
      meta_fr: "Casablanca, Maroc", meta_ar: "الدار البيضاء، المغرب",
    }],
    ["International Diploma — Applied Accounting", {
      title_fr: "Diplôme International — Comptabilité Appliquée",
      title_ar: "دبلوم دولي — المحاسبة التطبيقية",
      meta_fr: "Casablanca, Maroc", meta_ar: "الدار البيضاء، المغرب",
    }],
    ["Training Attestation — Web Development & Programming", {
      title_fr: "Attestation de Formation — Développement Web & Programmation",
      title_ar: "شهادة تكوين — تطوير الويب والبرمجة",
      meta_fr: "Déc 2024 · Casablanca", meta_ar: "دجنبر 2024 · الدار البيضاء",
    }],
    ["Training Attestation — Practical Accounting with SAGE (6 months)", {
      title_fr: "Attestation de Formation — Comptabilité Pratique avec SAGE (6 mois)",
      title_ar: "شهادة تكوين — المحاسبة العملية بـSAGE (ستة أشهر)",
      meta_fr: "Juil 2024 · Casablanca", meta_ar: "يوليوز 2024 · الدار البيضاء",
    }],
    ["Course Certificate — Front-End Development", {
      title_fr: "Certificat de Cours — Développement Front-End",
      title_ar: "شهادة دورة — تطوير الواجهات الأمامية",
      meta_fr: "Sept 2024 · En ligne", meta_ar: "شتنبر 2024 · عن بُعد",
    }],
  ];
  for (const [title, values] of edu) {
    const { error } = await db.from("education").update(values).eq("title", title);
    log(`education: ${title.slice(0, 40)}…`, error);
  }

  // ---------- skill categories ----------
  const cats: [string, string, string][] = [
    ["Frontend", "Front-end", "الواجهات الأمامية"],
    ["Backend", "Back-end", "الواجهات الخلفية"],
    ["Data & Office", "Données & Bureautique", "البيانات والمكتبيات"],
    ["Design", "Design", "التصميم"],
  ];
  for (const [en, fr, ar] of cats) {
    const { error } = await db.from("skill_categories").update({ title_fr: fr, title_ar: ar }).eq("title", en);
    log(`category: ${en}`, error);
  }

  // ---------- soft skills ----------
  const soft: [string, string, string][] = [
    ["Communication", "Communication", "التواصل"],
    ["Teamwork", "Travail d'équipe", "العمل الجماعي"],
    ["Time management", "Gestion du temps", "إدارة الوقت"],
    ["Problem solving", "Résolution de problèmes", "حل المشكلات"],
    ["Organization", "Organisation", "التنظيم"],
    ["Adaptability", "Adaptabilité", "المرونة والتكيّف"],
    ["Critical thinking", "Esprit critique", "التفكير النقدي"],
    ["Initiative & autonomy", "Initiative & autonomie", "المبادرة والاستقلالية"],
    ["Reliability & punctuality", "Fiabilité & ponctualité", "الموثوقية والانضباط"],
  ];
  for (const [en, fr, ar] of soft) {
    const { error } = await db.from("soft_skills").update({ name_fr: fr, name_ar: ar }).eq("name", en);
    log(`soft skill: ${en}`, error);
  }

  // ---------- languages ----------
  const langs: [string, any][] = [
    ["Arabic", { name_fr: "Arabe", name_ar: "العربية", level_label_fr: "Langue maternelle", level_label_ar: "اللغة الأم" }],
    ["French", { name_fr: "Français", name_ar: "الفرنسية", level_label_fr: "Utilisateur indépendant — B1/B2", level_label_ar: "مستوى متوسط — B1/B2" }],
    ["English", { name_fr: "Anglais", name_ar: "الإنجليزية", level_label_fr: "Utilisateur indépendant — B1", level_label_ar: "مستوى متوسط — B1" }],
  ];
  for (const [en, values] of langs) {
    const { error } = await db.from("languages").update(values).eq("name", en);
    log(`language: ${en}`, error);
  }

  // ---------- projects (matched by slug) ----------
  const projects: Record<string, any> = {
    "this-portfolio": {
      title_fr: "Ce Portfolio", title_ar: "هذا الموقع",
      category_fr: "Développement Web", category_ar: "تطوير الويب",
      problem_fr: "Tous les développeurs juniors revendiquent les mêmes compétences. Un PDF ne peut pas démontrer le savoir-faire, et les portfolios à base de templates ne prouvent rien.",
      problem_ar: "كل المطورين المبتدئين يدّعون المهارات نفسها. ملف PDF لا يُظهر الإتقان، والقوالب الجاهزة لا تثبت شيئًا.",
      long_description_fr: "Un CV dit ce que j'ai fait — ce site montre comment je travaille. Je voulais une preuve concrète qu'un recruteur peut explorer, et un vrai projet full-stack pour progresser.",
      long_description_ar: "السيرة الذاتية تقول ما فعلت — أما هذا الموقع فيُظهر كيف أعمل. أردت دليل عمل يمكن للمسؤول عن التوظيف تصفحه، ومشروعًا متكاملًا حقيقيًا أتطور من خلاله.",
      solution_fr: "Conçu et construit de bout en bout : Next.js 15 App Router, TypeScript, Tailwind CSS 4, Framer Motion + GSAP — plus un CMS Supabase sur mesure avec authentification, sécurité RLS, médiathèque et tableau de bord d'administration complet.",
      solution_ar: "صمّمته وبنيته من البداية إلى النهاية: Next.js 15 وTypeScript وTailwind CSS 4 وFramer Motion وGSAP — إضافة إلى نظام إدارة محتوى مخصص بـSupabase مع مصادقة وأمان على مستوى الصفوف ومكتبة وسائط ولوحة تحكم كاملة.",
      features_fr: ["CMS Supabase sur mesure + tableau de bord", "Palette de commandes (Ctrl+K)", "SEO, Open Graph & données structurées"],
      features_ar: ["نظام إدارة محتوى مخصص بلوحة تحكم", "لوحة أوامر (Ctrl+K)", "تحسين محركات البحث وOpen Graph والبيانات المهيكلة"],
      challenge_fr: "Rendre le site entièrement piloté par la base de données sans jamais risquer une page cassée. Résolu par une couche de contenu qui retombe sur des données intégrées en cas d'échec — le site public fonctionne même sans base configurée.",
      challenge_ar: "جعل الموقع معتمدًا كليًا على قاعدة البيانات دون المخاطرة بصفحة معطوبة. حللتها بطبقة محتوى ترجع تلقائيًا إلى بيانات مدمجة عند أي فشل — فيعمل الموقع حتى بدون قاعدة بيانات.",
      results_fr: "Tout ce que vous lisez est servi en direct depuis le CMS. Des animations 100 % compositeur maintiennent la page à ~230 Ko au premier chargement, sans aucune erreur console.",
      results_ar: "كل ما تقرؤه يُقدَّم مباشرة من نظام إدارة المحتوى. الرسوم المتحركة الخفيفة تُبقي الصفحة عند نحو 230 كيلوبايت عند التحميل الأول دون أي أخطاء.",
      lessons_fr: "Les composants serveur changent la façon de penser le flux de données — et la sécurité doit vivre dans la base (RLS), pas seulement dans l'interface.",
      lessons_ar: "مكوّنات الخادم تغيّر طريقة التفكير في تدفق البيانات — والأمان مكانه قاعدة البيانات (RLS) لا الواجهة فقط.",
      link_label_fr: "Vous êtes en train de le regarder", link_label_ar: "أنت تتصفحه الآن",
    },
    "production-data-dashboards": {
      title_fr: "Tableaux de Bord de Production", title_ar: "لوحات بيانات الإنتاج",
      category_fr: "Données & Reporting", category_ar: "البيانات والتقارير",
      problem_fr: "Les équipes de l'usine Siera avaient besoin d'une visibilité quotidienne sur des chiffres de production éparpillés dans des saisies brutes.",
      problem_ar: "كانت فرق مصنع Siera بحاجة إلى رؤية يومية لأرقام إنتاج مبعثرة في إدخالات خام.",
      long_description_fr: "Du travail de production réel — les superviseurs avaient besoin de chiffres prêts à la décision, pas de tableurs remplis de données brutes.",
      long_description_ar: "عمل إنتاجي حقيقي — كان المشرفون يحتاجون أرقامًا جاهزة لاتخاذ القرار، لا جداول مليئة بالبيانات الخام.",
      solution_fr: "Construction et maintenance de tableaux de bord Excel et de rapports de suivi transformant les données quotidiennes en synthèses claires et exploitables.",
      solution_ar: "بناء وصيانة لوحات Excel وتقارير متابعة تحوّل بيانات الإنتاج اليومية إلى ملخصات واضحة جاهزة للقرار.",
      features_fr: ["Suivi quotidien de la production", "Reporting par tableaux croisés", "Détection & correction d'anomalies"],
      features_ar: ["تتبّع الإنتاج اليومي", "تقارير بالجداول المحورية", "اكتشاف الأخطاء وتصحيحها"],
      challenge_fr: "Garder des chiffres fiables : les saisies quotidiennes arrivaient avec des incohérences qui corrompaient silencieusement les synthèses hebdomadaires. Résolu en validant à la saisie, pas à la relecture.",
      challenge_ar: "الحفاظ على موثوقية الأرقام: كانت الإدخالات اليومية تصل بتناقضات تفسد الملخصات الأسبوعية بصمت. الحل كان التحقق عند الإدخال لا عند المراجعة.",
      results_fr: "Des rapports réellement utilisés pour le suivi quotidien — avec des anomalies détectées et corrigées avant de se propager.",
      results_ar: "تقارير استُخدمت فعلاً في المتابعة اليومية — مع أخطاء تُكتشف وتُصحّح قبل أن تنتشر.",
      lessons_fr: "Un rapport ne vaut que par la discipline derrière ses données. La validation doit se faire au point de saisie.",
      lessons_ar: "قيمة أي تقرير من انضباط بياناته. والتحقق مكانه نقطة الإدخال.",
      link_label_fr: "Travail interne — détails sur demande", link_label_ar: "عمل داخلي — التفاصيل عند الطلب",
    },
    "accounting-workflow-with-sage": {
      title_fr: "Flux Comptable avec SAGE", title_ar: "دورة محاسبية بنظام SAGE",
      category_fr: "Comptabilité & Données", category_ar: "المحاسبة والبيانات",
      problem_fr: "La comptabilité pratique exige des livres propres : des écritures, des balances et des états qui se réconcilient.",
      problem_ar: "المحاسبة العملية تتطلب دفاتر نظيفة: قيود وأرصدة وقوائم متطابقة.",
      long_description_fr: "Six mois de formation intensive — je voulais une culture business, pas seulement du code : comprendre les chiffres qui font tourner une entreprise.",
      long_description_ar: "ستة أشهر من التكوين المكثف — أردت ثقافة أعمال لا برمجة فقط: فهم الأرقام التي تُدار بها الشركات.",
      solution_fr: "Traitement des écritures comptables dans SAGE et Excel, avec production de bilans et de comptes de résultat conformes au Plan Comptable Général marocain.",
      solution_ar: "معالجة القيود المحاسبية في SAGE وExcel، وإعداد ميزانيات وقوائم دخل مطابقة للمخطط المحاسبي العام المغربي.",
      features_fr: ["Écritures de journal dans SAGE", "Bilans & comptes de résultat", "Conformité au PCG marocain"],
      features_ar: ["قيود اليومية في SAGE", "الميزانيات وقوائم الدخل", "مطابقة المخطط المحاسبي المغربي"],
      challenge_fr: "La réconciliation — faire concorder écritures, balances et états sous le PCG marocain. Les petites erreurs se cumulent vite ; la solution : un double contrôle systématique à chaque étape.",
      challenge_ar: "المطابقة — جعل القيود والأرصدة والقوائم متسقة وفق المخطط المغربي. الأخطاء الصغيرة تتراكم بسرعة؛ والحل مراجعة منهجية مزدوجة في كل مرحلة.",
      results_fr: "Des bilans et comptes de résultat propres et réconciliés, produits dans SAGE et Excel.",
      results_ar: "ميزانيات وقوائم دخل نظيفة ومتطابقة، أُنجزت في SAGE وExcel.",
      lessons_fr: "La comptabilité m'a appris la même leçon que le contrôle qualité : la rigueur est une habitude, et les petites erreurs se cumulent.",
      lessons_ar: "علّمتني المحاسبة درس مراقبة الجودة نفسه: الدقة عادة، والأخطاء الصغيرة تتراكم بسرعة.",
      link_label_fr: "Projet de formation certifié", link_label_ar: "مشروع تكوين مُعتمَد",
    },
  };
  for (const [slug, values] of Object.entries(projects)) {
    const { error } = await db.from("projects").update(values).eq("slug", slug);
    log(`project: ${slug}`, error);
  }

  // ---------- services (matched by English title) ----------
  const services: [string, any][] = [
    ["Website Development", {
      title_fr: "Développement de Sites Web", title_ar: "تطوير المواقع",
      description_fr: "Landing pages, portfolios et sites de petites entreprises en HTML, CSS, JavaScript ou WordPress — propres, responsives et rapides.",
      description_ar: "صفحات هبوط ومواقع شخصية ومواقع أعمال صغيرة بـHTML وCSS وJavaScript أو WordPress — نظيفة ومتجاوبة وسريعة.",
    }],
    ["Data Entry & Cleaning", {
      title_fr: "Saisie & Nettoyage de Données", title_ar: "إدخال البيانات وتنقيتها",
      description_fr: "Saisie de haute précision, validation, dédoublonnage et organisation de fichiers. Formé aux standards de précision industriels.",
      description_ar: "إدخال عالي الدقة وتحقق وإزالة للتكرارات وتنظيم للملفات، بمعايير دقة صناعية.",
    }],
    ["Excel Dashboards & Reports", {
      title_fr: "Tableaux de Bord & Rapports Excel", title_ar: "لوحات وتقارير Excel",
      description_fr: "Formules, tableaux croisés dynamiques et tableaux de bord qui transforment les chiffres bruts en décisions.",
      description_ar: "معادلات وجداول محورية ولوحات متابعة تحوّل الأرقام الخام إلى قرارات.",
    }],
    ["Accounting Support", {
      title_fr: "Support Comptable", title_ar: "دعم محاسبي",
      description_fr: "Traitement d'écritures dans SAGE, bilans simples et comptes de résultat selon le PCG marocain.",
      description_ar: "معالجة القيود في SAGE وإعداد ميزانيات وقوائم دخل بسيطة وفق المخطط المحاسبي المغربي.",
    }],
  ];
  for (const [en, values] of services) {
    const { error } = await db.from("services").update(values).eq("title", en);
    log(`service: ${en}`, error);
  }

  // ---------- certificates (matched by English title) ----------
  const certs: [string, any][] = [
    ["International Diploma — Web Development & Programming", {
      title_fr: "Diplôme International — Développement Web & Programmation",
      title_ar: "دبلوم دولي — تطوير الويب والبرمجة",
      issuer_fr: "Centre Atlantique de Formation × Smart International Academy, Londres",
      issuer_ar: "المركز الأطلسي للتكوين × أكاديمية Smart الدولية، لندن",
    }],
    ["International Diploma — Applied Accounting", {
      title_fr: "Diplôme International — Comptabilité Appliquée",
      title_ar: "دبلوم دولي — المحاسبة التطبيقية",
      issuer_fr: "Centre Atlantique de Formation × Smart International Academy, Londres",
      issuer_ar: "المركز الأطلسي للتكوين × أكاديمية Smart الدولية، لندن",
    }],
    ["Training Attestation — Web Development & Programming", {
      title_fr: "Attestation de Formation — Développement Web & Programmation",
      title_ar: "شهادة تكوين — تطوير الويب والبرمجة",
      issuer_fr: "Centre Atlantique de Formation", issuer_ar: "المركز الأطلسي للتكوين",
    }],
    ["Training Attestation — Practical Accounting with SAGE", {
      title_fr: "Attestation de Formation — Comptabilité Pratique avec SAGE",
      title_ar: "شهادة تكوين — المحاسبة العملية بنظام SAGE",
      issuer_fr: "Centre Atlantique de Formation", issuer_ar: "المركز الأطلسي للتكوين",
    }],
    ["Course Certificate — Front-End Development", {
      title_fr: "Certificat de Cours — Développement Front-End",
      title_ar: "شهادة دورة — تطوير الواجهات الأمامية",
      issuer_fr: "Sololearn", issuer_ar: "منصة Sololearn",
    }],
  ];
  for (const [en, values] of certs) {
    const { error } = await db.from("certificates").update(values).eq("title", en);
    log(`certificate: ${en.slice(0, 40)}…`, error);
  }

  console.log("\n✅ Translation sync complete — visit /fr and /ar to see fully localized content.");
}

main().catch((e) => {
  console.error(`❌ ${e.message}`);
  process.exit(1);
});
