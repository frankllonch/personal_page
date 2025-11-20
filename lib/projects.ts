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
      isNew: true,
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
      isNew: true,
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
      isNew: true,
    },
  
    {
      slug: "ocean-ecostructures-tfg",
      title: "TFG: Marine Sustainability",
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
  ];