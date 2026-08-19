// lib/projects.ts

export interface ProjectData {
    slug: string;
    title: string;
    subtitle: string;
    link: string;
    color: string;
    starred?: boolean;
    isNew?: boolean;
    isUpcoming?: boolean;
  }
  
  export const projects: ProjectData[] = [
    {
      slug: "bbva-vs-santander",
      title: "BBVA vs Santander",
      subtitle:
        "Daily stock forecasting for Spain’s two banking gladiators. LSTMs, GRUs, pipelines, and way too many CSVs.",
      link: "https://bbvavssantander.streamlit.app",
      color: "bg-blue-500",
    },
  
    {
      slug: "dumbnetflix",
      title: "DumbNetflix",
      subtitle:
        "Like Netflix, but dumber. Same movies, zero stress. No ads, no autoplay, no ‘are you still watching?’ judging you.",
      link: "https://github.com/frankllonch/netflixpocho",
      color: "bg-red-500",
    },
  
    {
      slug: "melanomapp",
      title: "MelanomApp",
      subtitle:
        "Streamlit app that classifies skin lesions. Useful, scary, and surprisingly accurate. Works best if you don’t panic.",
      link: "https://melanomapp.streamlit.app",
      color: "bg-green-500",
    },
  
    {
      slug: "testifier-ai",
      title: "Testifier AI",
      subtitle:
        "The app I built to survive exam season. Generates, grades, and explains AI/tech questions. Basically a study buddy that doesn’t complain.",
      link: "https://testifier-ai.vercel.app/",
      color: "bg-purple-500",
    },
  
    {
      slug: "ww2-rag",
      title: "WW2 RAG Chat",
      subtitle:
        "A Retrieval-Augmented Generation chatbot about World War II. Nerdy, overkill, and actually pretty cool.",
      link: "https://github.com/frankllonch/ww2_RAG",
      color: "bg-yellow-500",
    },
  
    {
      slug: "ocean-ecostructures-tfg",
      title: "Marine Sustainability",
      subtitle:
        "Upcoming final degree project: cloud analytics + ecology + AI for marine biodiversity at Ocean Ecostructures. Coming soon.",
      link: "https://oceanecostructures.com/",
      color: "bg-teal-500",
      isUpcoming: true,
    },

    {
      slug: "Drawings",
      title: "Arts and crafts",
      subtitle:
        "A collection of my artwork and sketches. Because coding isn't my only talent. Trying to learn to animate too!",
      link: "https://www.instagram.com/notonlyfranks/",
      color: "bg-teal-500",
   
    },
    {
      slug: "Ticketator",
      title: "Ticketator",
      subtitle:
        "A tool to store purchase tickets and receipts from any store in google drive and a server. Using n8n and firestore to automate the process.",
      link: "https://github.com/frankllonch/ticketator",
      color: "bg-teal-500",
    },

    {
      slug: "tables-parser",
      title: "Tables Parser",
      subtitle:
        "Drop in a messy PDF, get clean tables out. Python extractor on the back, TypeScript UI on the front. Spreadsheets, finally tamed.",
      link: "https://github.com/frankllonch/tables-parser-app-frontend",
      color: "bg-orange-500",
      isNew: true,
    },

    {
      slug: "personal-page",
      title: "This Very Page",
      subtitle:
        "The site you're on right now. Next.js, Framer Motion and a WebGL background that eats GPUs for breakfast. Very meta.",
      link: "https://github.com/frankllonch/personal_page",
      color: "bg-yellow-500",
      isNew: true,
    },
  ];
