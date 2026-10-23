/**
 * Everything written on the page that is not a project. Plain text, edited
 * here and nowhere else.
 */

export const site = {
  name: "Frank Llonch",
  signature: "frank",
  /** The big statement at the top: who, where, what — in three sentences. */
  statement:
    "Frank Llonch is a mathematical engineer from Barcelona who builds data systems, AI tools and the occasional pointless app. Trained in Madrid, currently on exchange in Salvador de Bahía, he likes problems that start messy and end as something you can run. When the laptop is closed he paints, dives and teaches people to breathe underwater.",
  /** Short facts under the statement. */
  facts: [
    { label: "Based", value: "Barcelona · Madrid · Bahía" },
    { label: "Studying", value: "Mathematical Engineering, UAX" },
    { label: "Now", value: "Exchange at UFBA, final-year project with Ocean Ecostructures" },
    { label: "Open to", value: "Data & AI roles from 2026" },
  ],
  email: "llonchfrank@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/frankllonch" },
    { label: "LinkedIn", href: "https://linkedin.com/in/frankllonch" },
    { label: "Instagram", href: "https://www.instagram.com/notonlyfranks/" },
    { label: "Email", href: "mailto:llonchfrank@gmail.com" },
    { label: "CV", href: "/cv.pdf" },
  ],
} as const;

export interface Entry {
  /** Where. */
  name: string;
  /** What: the role or the degree. */
  role: string;
  place: string;
  /** "2023" or "2025 —" for something still running. */
  period: string;
  /** One line on what actually happened there. */
  note: string;
  href: string;
  image: string;
}

export const works: readonly Entry[] = [
  {
    name: "Grupo Sirt",
    role: "Data engineer, intern",
    place: "Barcelona",
    period: "2025",
    note: "Pipelines and reporting for an industrial group: getting the numbers from where they were to where people needed them.",
    href: "https://www.linkedin.com/company/sirt/?originalSubdomain=es",
    image: "/images/sirt.png",
  },
  {
    name: "Dive Inn Menorca",
    role: "Diving instructor",
    place: "Menorca",
    period: "2025",
    note: "Summers teaching open-water courses. The best lesson in explaining complicated things calmly.",
    href: "https://www.diveinnmenorca.com/",
    image: "/images/diveinn.jpeg",
  },
  {
    name: "DeNexus",
    role: "Crypto data analyst",
    place: "Madrid",
    period: "2023",
    note: "On-chain and market data for cyber-risk models: scraping, cleaning, and learning what a good dataset costs.",
    href: "https://www.denexus.io/",
    image: "/images/denexus.png",
  },
];

export const education: readonly Entry[] = [
  {
    name: "Universidade Federal da Bahia",
    role: "Exchange student",
    place: "Salvador de Bahía",
    period: "2026",
    note: "A semester of mathematics in Portuguese, and of Salvador.",
    href: "https://www2.ubu.es/masted/es/universidade-federal-da-bahia",
    image: "/images/bahia1.png",
  },
  {
    name: "Ocean Ecostructures",
    role: "Final degree project",
    place: "Barcelona",
    period: "2025 —",
    note: "Cloud analytics and AI for marine biodiversity: turning monitoring data from artificial reefs into something a biologist can act on.",
    href: "https://oceanecostructures.com/",
    image: "/images/ocean1.png",
  },
  {
    name: "Universidad Alfonso X el Sabio",
    role: "BSc Mathematical Engineering",
    place: "Madrid",
    period: "2022 —",
    note: "Statistics, optimisation, machine learning, and enough programming to ship what the maths says.",
    href: "https://www.uax.com/",
    image: "/images/uax-logo.png",
  },
];
