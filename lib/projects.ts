/**
 * The project boxes, in the order they appear. First one top-left.
 */
export interface Project {
  slug: string;
  title: string;
  /** One or two sentences: what it is and why it exists. */
  description: string;
  link: string;
  year: string;
  /** Stack, three words at most each. */
  tags: readonly string[];
  status?: "new" | "upcoming";
}

export const projects: readonly Project[] = [
  {
    slug: "tables-parser",
    title: "Tables Parser",
    description:
      "Drop in a messy PDF, get clean tables out. A Python extractor behind a TypeScript front end, built because spreadsheets kept arriving as scans.",
    link: "https://github.com/frankllonch/tables-parser-app-frontend",
    year: "2025",
    tags: ["Python", "TypeScript", "PDF"],
    status: "new",
  },
  {
    slug: "personal-page",
    title: "This Page",
    description:
      "The site you are reading. One page, Inter, a few lines, and a text scramble that refuses to leave.",
    link: "https://github.com/frankllonch/personal_page",
    year: "2025",
    tags: ["Next.js", "Tailwind", "GSAP"],
    status: "new",
  },
  {
    slug: "ocean-ecostructures-tfg",
    title: "Marine Sustainability",
    description:
      "Final degree project with Ocean Ecostructures: cloud analytics and AI over biodiversity data from artificial reefs.",
    link: "https://oceanecostructures.com/",
    year: "2025 —",
    tags: ["Cloud", "AI", "Ecology"],
    status: "upcoming",
  },
  {
    slug: "ticketator",
    title: "Ticketator",
    description:
      "Photograph a receipt, forget about it. n8n reads it, Firestore keeps it, Drive files it. Expense tracking for people who hate expense tracking.",
    link: "https://github.com/frankllonch/ticketator",
    year: "2025",
    tags: ["n8n", "Firestore", "Automation"],
  },
  {
    slug: "testifier-ai",
    title: "Testifier AI",
    description:
      "Built to survive exam season: generates, grades and explains questions on AI and tech. A study partner that never gets tired of you.",
    link: "https://testifier-ai.vercel.app/",
    year: "2024",
    tags: ["Next.js", "LLM", "Education"],
  },
  {
    slug: "ww2-rag",
    title: "WW2 RAG Chat",
    description:
      "A retrieval-augmented chatbot about the Second World War. Over-engineered for a history question, which was the point.",
    link: "https://github.com/frankllonch/ww2_RAG",
    year: "2024",
    tags: ["Python", "RAG", "LLM"],
  },
  {
    slug: "melanomapp",
    title: "MelanomApp",
    description:
      "A classifier for skin lesions wrapped in a Streamlit app. Useful, a little frightening, more accurate than it has any right to be.",
    link: "https://melanomapp.streamlit.app",
    year: "2024",
    tags: ["Deep learning", "Streamlit", "Health"],
  },
  {
    slug: "bbva-vs-santander",
    title: "BBVA vs Santander",
    description:
      "Daily stock forecasting for Spain's two banking heavyweights. LSTMs, GRUs, a pipeline, and far too many CSVs.",
    link: "https://bbvavssantander.streamlit.app",
    year: "2023",
    tags: ["Time series", "LSTM", "Streamlit"],
  },
  {
    slug: "dumbnetflix",
    title: "DumbNetflix",
    description:
      "Netflix with the cleverness removed: the same films, no autoplay, no ads, nobody asking whether you are still watching.",
    link: "https://github.com/frankllonch/netflixpocho",
    year: "2023",
    tags: ["Web", "Streaming"],
  },
  {
    slug: "drawings",
    title: "Arts and Crafts",
    description:
      "Paintings, sketches and the first animations. Coding is not the only thing these hands do.",
    link: "https://www.instagram.com/notonlyfranks/",
    year: "Ongoing",
    tags: ["Painting", "Animation"],
  },
];
