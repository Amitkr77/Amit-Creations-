export const site = {
  name: "Amit Kumar",
  role: "Full-stack engineer",
  location: "Bihar, India",
  email: "amitroyk99@gmail.com",
  github: "https://github.com/Amitkr77",
  githubUser: "Amitkr77",
  linkedin: "https://www.linkedin.com/in/amitkr77",
  // Served from /public so it ships with the site; replace the file to update it
  resume: "/Amit_Kumar_Resume.pdf",
};

export const nav = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
];

export const experience = [
  {
    role: "Junior Project Officer",
    org: "Asian Development Research Institute (ADRI)",
    period: "Jun 2026 — Present",
    current: true,
    points: [
      "Technical and programmatic support for the ADRI team under the Ayushman Bharat initiative.",
      "Python and Next.js for project-related technical work.",
    ],
  },
  {
    role: "Freelance Software Developer",
    org: "Independent",
    period: "Ongoing",
    current: true,
    points: [
      "End-to-end builds across frontend, backend APIs and database integration.",
      "Currently building FUYL's Shopify storefront and a separate full-stack app.",
    ],
  },
  {
    role: "Full Stack Engineer",
    org: "Homeasy Automation Pvt. Ltd.",
    period: "Mar 2025 — May 2026",
    points: [
      "Developed and deployed MERN-stack solutions — architecture, data processing and performance.",
      "Built REST API integrations and maintainable components; cut application load time by ~30%.",
    ],
  },
  {
    role: "Frontend Engineer Intern",
    org: "Givni Info-Tech",
    period: "Jan 2025 — Mar 2025",
    points: [
      "Built React interfaces and REST API integrations for CheckPlots, a property-tracking app.",
      "Worked with backend developers on testing and bug fixes.",
    ],
  },
  {
    role: "Frontend Engineering Intern",
    org: "CETPA Info-Tech",
    period: "Jul 2024 — Aug 2024",
    points: ["MERN development, API integration and reusable frontend components."],
  },
];

export const education = {
  degree: "Master of Computer Applications (MCA)",
  school: "Amity University, Patna",
  period: "2023 — 2025",
};

export const stack = [
  {
    name: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Three.js", "Vite", "JavaScript"],
  },
  {
    name: "Backend",
    items: ["Node.js", "Express", "Python", "FastAPI", "REST APIs", "Socket.io", "JWT & auth"],
  },
  {
    name: "Data",
    items: ["MongoDB", "Redis", "MySQL", "Firebase"],
  },
  {
    name: "Cloud & tooling",
    items: ["AWS", "Vercel", "GCP", "Docker", "Git & GitHub", "CI/CD", "Postman"],
  },
  {
    name: "AI & commerce",
    items: ["OpenAI API", "Gemini API", "Prompt engineering", "Shopify storefronts"],
  },
];
