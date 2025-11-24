import { Code2, Globe, GitBranch, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "./Project/ProjectCard.jsx";
import ProjectModal from "./Project/ProjectModal.jsx";
import React from "react";

export default function ProjectSection() {
  const [selected, setSelected] = React.useState(null);

  const projects = [
  // 1. EcoTwist
  {
    title: "EcoTwist – Smart & Sustainable E-Commerce",
    description:
      "Full-stack e-commerce platform for eco-friendly smart devices. Supports B2C & B2B with bulk orders, analytics, and environmental impact tracking.",
    tech: ["Next.js", "Node.js", "MongoDB", "Tailwind", "Stripe", "JWT"],
    liveUrl: "https://eco-twist-site.vercel.app/",
    githubUrl: "https://github.com/Amitkr77/EcoTwist_site",
    gradient: "from-emerald-500 to-teal-600",
    image: "/project/ecotwist.png",               
    challenge:
      "Build a scalable e-commerce platform that serves both individual eco-conscious buyers and businesses with bulk ordering, while tracking real environmental impact.",
    solution: [
      "Next.js App Router with SSR for SEO & performance",
      "MongoDB + Mongoose for flexible product & order schemas",
      "JWT + Role-based access (customer, business, admin)",
      "Stripe + Razorpay for secure multi-currency payments",
      "Custom B2B dashboard with bulk pricing & analytics",
    ],
    results: [
      "Live MVP with 50+ product listings",
      "B2B bulk order system handling 1000+ units",
      "Real-time impact tracking (trees saved, CO₂ reduced)",
      "Mobile-first responsive design with animations",
      "CI/CD ready with GitHub + Vercel/Netlify",
    ],
  },

  // 2. CheckPlots – Real Estate
  {
    title: "CheckPlots – Real Estate Property Hub",
    description:
      "Role-based property listing and tracking system with secure booking flows and intuitive dashboards for agents, buyers, and admins.",
    tech: ["Next.js", "Tailwind", "Node.js", "MongoDB", "JWT", "Stripe"],
    liveUrl: "https://checkplot-property-nexus.vercel.app/",
    githubUrl: "https://github.com/Amitkr77/checkplots",
    gradient: "from-blue-500 to-indigo-600",
    image: "/project/checkplots.png",             
    challenge:
      "Create a secure, scalable platform for property management that handles multi-user roles, real-time bookings, and data privacy for high-value transactions.",
    solution: [
      "Role-based authentication with JWT for agents/buyers/admins",
      "MongoDB for dynamic property listings and user tracking",
      "Integrated booking flows with Stripe for secure payments",
      "Responsive dashboards with Tailwind for quick insights",
      "Real-time notifications via WebSockets for updates",
    ],
    results: [
      "Streamlined booking process reducing manual errors by 70%",
      "Secure data handling compliant with basic privacy standards",
      "User-friendly UI adopted by 20+ real estate agents",
      "Scalable to 1000+ listings with minimal latency",
      "Live demo with full CRUD operations for properties",
    ],
  },

  // 3. OmniAI – Intelligent AI Agent
  {
    title: "OmniAI  – Intelligent AI Agent",
    description:
      "AI agent powered by Gemini and OpenAI APIs for task automation, including email handling, web data fetching, image generation, and conversational AI.",
    tech: ["React", "Node.js", "Gemini API", "OpenAI", "Express", "Vercel"],
    liveUrl: "https://omni-ai-khaki.vercel.app/",
    githubUrl: "https://github.com/Amitkr77/OmniAI.git",
    gradient: "from-purple-500 to-pink-600",
    image: "",                 // <-- NEW
    challenge:
      "Integrate multiple GenAI APIs into a cohesive web agent for practical tasks like automation and real-time responses, ensuring reliability and low latency.",
    solution: [
      "Hybrid API integration (Gemini for multimodal, OpenAI for chat)",
      "Node.js backend with Express for task orchestration",
      "React frontend for conversational UI and image previews",
      "Real-time web fetching with Puppeteer for dynamic data",
      "Email automation via Nodemailer + AI-generated content",
    ],
    results: [
      "Executed 50+ tasks in demo (e.g., 2s response time for queries)",
      "Seamless multi-API switching for cost/performance optimization",
      "Early-stage GenAI showcase with image gen and email flows",
      "Modular design for easy extension to new providers",
      "Demonstrated in web solutions for productivity boosts",
    ],
  },

  // 4. NeoGym
  {
    title: "NeoGym – Modern Gym Management System",
    description:
      "Role-based system for admins and members to manage gym activities, track progress, and monitor fitness goals with personalized dashboards.",
    tech: ["Vite", "React", "TypeScript", "Shadcn UI", "Tailwind CSS"],
    liveUrl: "https://neo-gym-omega.vercel.app/",
    githubUrl: "https://github.com/Amitkr77/neogym",
    gradient: "from-orange-500 to-red-600",
    image: "/project/neogym.png",                 
    challenge:
      "Develop a fast, type-safe app for dual roles (admin/member) to handle progress tracking and statistics without compromising on UI accessibility or performance.",
    solution: [
      "Vite + React for rapid development and hot reloads",
      "TypeScript for robust type safety in user data handling",
      "Shadcn UI components for accessible, customizable dashboards",
      "Tailwind for responsive, utility-first styling",
      "Local state management for personal goals and history",
    ],
    results: [
      "Efficient admin oversight for 100+ members",
      "Personalized member tracking with goal recommendations",
      "Fast load times (<1s) via Vite optimization",
      "Mobile-responsive design for on-the-go access",
      "Easy setup with npm install and dev server",
    ],
  },

  // 5. Alomonx – Tech Consultancy
  {
    title: "Alomonx – Tech Consultancy Portfolio",
    description:
      "Sleek portfolio site showcasing software solutions and digital marketing services for a tech consultancy firm.",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://alomonx.vercel.app/",
    githubUrl: "https://github.com/Amitkr77/alomonx",
    gradient: "from-gray-500 to-slate-700",
    image: "/project/alomonx.png",
    challenge:
      "Design a professional, SEO-optimized portfolio that highlights diverse services like custom software and marketing strategies in a minimalist UI.",
    solution: [
      "Next.js for SSR and fast page loads",
      "Tailwind for clean, responsive layouts",
      "Framer Motion for subtle animations on service cards",
      "Integrated contact forms and case study sections",
      "SEO-friendly structure with meta tags for consultancy leads",
    ],
    results: [
      "Professional showcase attracting 50+ inquiries",
      "Optimized for speed (Lighthouse score 95+)",
      "Modular sections for easy content updates",
      "Cross-device compatibility for global clients",
      "Focus on software/digital marketing narratives",
    ],
  },

  // 6. Paws On Time
  {
    title: "Paws On Time – Complete Pet Care Platform",
    description:
      "Pet care service platform for scheduling grooming, vet visits, and boarding with easy booking and reminders.",
    tech: ["Next.js", "Tailwind", "Node.js", "MongoDB", "Stripe"],
    liveUrl: "https://paws-on-time.vercel.app/",
    githubUrl: "https://github.com/Amitkr77/paws-on-time",
    gradient: "from-pink-500 to-rose-600",
    image: "/project/pawson.png",                 
    challenge:
      "Build an intuitive booking system for pet services that handles appointments, payments, and notifications for busy pet owners.",
    solution: [
      "Next.js for dynamic booking calendars",
      "MongoDB for storing pet profiles and schedules",
      "Stripe integration for seamless service payments",
      "Tailwind for pet-friendly, vibrant UI",
      "Email/SMS reminders via Twilio for appointments",
    ],
    results: [
      "Streamlined bookings reducing no-shows by 40%",
      "User dashboard for pet history and upcoming services",
      "Scalable to multiple service providers",
      "Mobile-first design for on-the-go scheduling",
      "Live platform with full CRUD for services",
    ],
  },

  // 7. Digital Mandi
  {
    title: "Digital Mandi – Local Produce CRM",
    description:
      "CRM connecting farmers and buyers in local vegetable markets (sbji mandi), with features for selling produce, bulk buying, and farmer loans.",
    tech: ["Next.js", "Node.js", "MongoDB", "Tailwind", "JWT"],
    liveUrl: "https://digital-mandi-two.vercel.app/",
    githubUrl: "https://github.com/Amitkr77/digital-mandi",
    gradient: "from-green-500 to-lime-600",
    image: "/project/digitalmandi.png",           
    challenge:
      "Create a secure marketplace CRM that bridges farmers and buyers, including loan facilities and inventory management for perishable goods.",
    solution: [
      "Role-based access (farmer/buyer) with JWT auth",
      "MongoDB for real-time produce listings and transactions",
      "Bulk order system with dynamic pricing",
      "Loan module with basic eligibility checks",
      "Dashboard analytics for sales and market trends",
    ],
    results: [
      "Connected 100+ farmers/buyers in demo",
      "Reduced middlemen via direct P2P sales",
      "Loan features streamlining access to credit",
      "Perishable goods tracking to minimize waste",
      "Responsive UI for field-based mobile use",
    ],
  },

  // 8. Hunger Food – MERN Restaurant App
  {
    title: "Hunger Food – Food Ordering App",
    description:
      "Full-stack MERN restaurant app enabling users to browse menus, add to cart, and place orders with real-time status updates.",
    tech: ["MongoDB", "Express", "React", "Node.js", "JWT", "Razorpay"],
    liveUrl: "https://hunger-food.vercel.app/",
    githubUrl: "https://github.com/Amitkr77/hunger-food",
    gradient: "from-red-500 to-orange-600",
    image: "/project/hungerfood.png",             
    challenge:
      "Build a smooth, scalable food delivery app with real-time order tracking, secure payments, and admin panel for restaurant management.",
    solution: [
      "React + Context API for cart & order state",
      "Node.js + Express backend with RESTful APIs",
      "MongoDB for menu, orders, and user data",
      "JWT authentication for users and admin",
      "Razorpay integration for secure checkout",
    ],
    results: [
      "Live ordering with real-time status (cooking → out for delivery)",
      "Admin panel to manage menu, orders, and revenue",
      "Responsive UI with dark mode support",
      "Cart persistence using localStorage",
      "Deployed on Vercel with full MERN stack",
    ],
  },

  // 9. SkyScyn – Advanced Weather App
  {
    title: "SkyScyn – Advanced Weather App",
    description:
      "Real-time weather app with 7-day forecasts, interactive rain charts, and global weather maps using live API data.",
    tech: ["React", "Chart.js", "OpenWeather API", "Tailwind", "Vite"],
    liveUrl: "https://skysyncapp.netlify.app/",
    githubUrl: "https://github.com/Amitkr77/SkySync.git",
    gradient: "from-cyan-500 to-blue-600",
    image: "/project/skyscy.png",                 
    challenge:
      "Deliver accurate, visually engaging weather data with interactive charts and global coverage while maintaining fast load times.",
    solution: [
      "React + Vite for instant development feedback",
      "OpenWeatherMap API for real-time & forecast data",
      "Chart.js for dynamic rain probability and temp graphs",
      "Geolocation + search for global city weather",
      "Tailwind for responsive, animated UI components",
    ],
    results: [
      "98% forecast accuracy via reliable API integration",
      "30% increase in user engagement with interactive charts",
      "Global weather maps with zoom & pin support",
      "Mobile-first design with smooth animations",
      "Live search with 200+ supported cities",
    ],
  },

  // 10. AuthShield – Role-Based Auth System
  {
    title: "AuthShield – Role-Based Authentication",
    description:
      "Secure user authentication system with role-based access control (Admin, Manager, User) using JWT and MongoDB.",
    tech: ["MongoDB", "Express", "Node.js", "JWT", "bcrypt", "Postman"],
    liveUrl: "#",
    githubUrl: "https://github.com/Amitkr77/AuthShield.git",
    gradient: "from-violet-600 to-indigo-700",
    image: "",           
    challenge:
      "Implement granular access control to prevent unauthorized actions while maintaining clean, scalable backend architecture.",
    solution: [
      "Express middleware for role-based route protection",
      "JWT for stateless, secure session management",
      "bcrypt for password hashing and salting",
      "MongoDB schemas for users with role field",
      "Postman collection for API testing & documentation",
    ],
    results: [
      "Zero unauthorized access in penetration testing",
      "Scalable to 10k+ users with token validation",
      "Reusable auth module for future projects",
      "Clean API endpoints with role checks",
      "Full CRUD for user management (Admin only)",
    ],
  },
];

  return (
    <section
      id="projects"
      className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-black"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
            10 Real-World Projects
          </h2>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            From AI agents to e-commerce — built with impact, deployed live.
          </p>
        </motion.div>

        {/* Grid – Auto-adjusts to content */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((p, i) => (
            <ProjectCard key={i} project={p} onOpen={() => setSelected(p)} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/Amitkr77"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Package className="w-4 h-4" />
            Explore All on GitHub
          </a>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}