// `accent` tints the particle field while the project is hovered.
// Featured projects render as large case-study rows; the rest go in the archive list.
export const projects = [
  {
    name: "FUYL",
    accent: "#5eead4",
    tagline: "Shopify Storefront & Full-Stack App",
    context: "Freelance · in progress",
    inProgress: true,
    description: "Storefront for FUYL, a daily-nutrition brand, built on Shopify — plus a separate full-stack application built from scratch with Next.js, Node.js, MongoDB and Redis.",
    tech: ["Shopify", "Next.js", "Node.js", "MongoDB", "Redis"],
    liveUrl: "https://fuyl.in/",
    image: "/project/fuyl.webp",
    featured: true,
    challenge: "Deliver a polished, responsive storefront for a direct-to-consumer brand while building a separate custom application alongside it.",
    solution: [
      "Shopify storefront refined for responsive design, storefront functionality and user experience",
      "Separate full-stack application built from scratch with Next.js and Node.js",
      "MongoDB for application data, Redis for caching",
      "Work spans frontend, backend and data integration",
    ],
  },
  {
    name: "EcoTwist",
    accent: "#34d399",
    tagline: "Smart & Sustainable E-Commerce",
    description: "Full-stack e-commerce platform for eco-friendly smart devices. Supports B2C & B2B with bulk orders, analytics, and environmental impact tracking.",
    tech: [
      "Next.js",
      "Node.js",
      "MongoDB",
      "Tailwind",
      "Stripe",
      "JWT"
    ],
    liveUrl: "https://eco-twist-site.vercel.app/",
    githubUrl: "https://github.com/Amitkr77/EcoTwist_site",
    image: "/project/ecotwist.webp",
    featured: true,
    challenge: "Build a scalable e-commerce platform that serves both individual eco-conscious buyers and businesses with bulk ordering, while tracking real environmental impact.",
    solution: [
      "Next.js App Router with SSR for SEO & performance",
      "MongoDB + Mongoose for flexible product & order schemas",
      "JWT + Role-based access (customer, business, admin)",
      "Stripe + Razorpay for secure multi-currency payments",
      "Custom B2B dashboard with bulk pricing & analytics"
    ],
    results: [
      "Live MVP with 50+ product listings",
      "B2B bulk order system handling 1000+ units",
      "Real-time impact tracking (trees saved, CO₂ reduced)",
      "Mobile-first responsive design with animations",
      "CI/CD ready with GitHub + Vercel/Netlify"
    ]
  },
  {
    name: "CheckPlots",
    context: "Frontend · internship at Givni Info-Tech",
    accent: "#60a5fa",
    tagline: "Property-Tracking App — Frontend",
    description: "The frontend of CheckPlots, a property-tracking platform: the React and Tailwind CSS interfaces people use to browse and search properties, connected to the team's backend APIs.",
    tech: ["React", "Tailwind CSS"],
    liveUrl: "https://checkplot-property-nexus.vercel.app/",
    githubUrl: "https://github.com/Amitkr77/checkplots",
    image: "/project/checkplots.webp",
    featured: true,
    challenge: "Turn the product's property-tracking features into a clean, responsive interface while working alongside a separate backend team.",
    solution: [
      "Built the application's user interfaces in React",
      "Styled responsive, mobile-first layouts with Tailwind CSS",
      "Developed reusable frontend modules for property listings and search",
      "Integrated the UI with the backend team's REST APIs",
      "Worked with backend developers on testing and bug fixes"
    ]
  },
  {
    name: "OmniAI",
    context: "Also known as AstraAI",
    accent: "#e879f9",
    tagline: "Intelligent AI Agent",
    description: "AI agent powered by Gemini and OpenAI APIs for task automation, including email handling, web data fetching, image generation, and conversational AI.",
    tech: [
      "React",
      "Node.js",
      "Gemini API",
      "OpenAI",
      "Express",
      "Vercel"
    ],
    liveUrl: "https://omni-ai-khaki.vercel.app/",
    githubUrl: "https://github.com/Amitkr77/OmniAI",
    challenge: "Integrate multiple GenAI APIs into a cohesive web agent for practical tasks like automation and real-time responses, ensuring reliability and low latency.",
    solution: [
      "Hybrid API integration (Gemini for multimodal, OpenAI for chat)",
      "Node.js backend with Express for task orchestration",
      "React frontend for conversational UI and image previews",
      "Real-time web fetching with Puppeteer for dynamic data",
      "Email automation via Nodemailer + AI-generated content"
    ],
    results: [
      "Executed 50+ tasks in demo (e.g., 2s response time for queries)",
      "Seamless multi-API switching for cost/performance optimization",
      "Early-stage GenAI showcase with image gen and email flows",
      "Modular design for easy extension to new providers",
      "Demonstrated in web solutions for productivity boosts"
    ]
  },
  {
    name: "Jetour",
    accent: "#38bdf8",
    tagline: "Multi-role Backend System",
    context: "Freelance",
    description: "Multi-role backend for authentication, bookings and real-time tracking, with live location over Socket.io and Google Maps.",
    tech: ["Node.js", "Express", "MongoDB", "Socket.io", "Google Maps", "Firebase FCM", "AWS"],
    challenge: "Coordinate several user roles, bookings and live tracking in one backend that stays responsive in real time.",
    solution: [
      "Role-based authentication across user types",
      "Booking flows with real-time tracking via Socket.io and Google Maps",
      "Push notifications through Firebase Cloud Messaging",
      "Deployed on AWS",
    ],
  },
  {
    name: "NeoGym",
    accent: "#fb923c",
    tagline: "Modern Gym Management System",
    description: "Role-based system for admins and members to manage gym activities, track progress, and monitor fitness goals with personalized dashboards.",
    tech: [
      "Vite",
      "React",
      "TypeScript",
      "Shadcn UI",
      "Tailwind CSS"
    ],
    liveUrl: "https://neo-gym-omega.vercel.app/",
    githubUrl: "https://github.com/Amitkr77/neogym",
    image: "/project/neogym.webp",
    featured: true,
    challenge: "Develop a fast, type-safe app for dual roles (admin/member) to handle progress tracking and statistics without compromising on UI accessibility or performance.",
    solution: [
      "Vite + React for rapid development and hot reloads",
      "TypeScript for robust type safety in user data handling",
      "Shadcn UI components for accessible, customizable dashboards",
      "Tailwind for responsive, utility-first styling",
      "Local state management for personal goals and history"
    ],
    results: [
      "Efficient admin oversight for 100+ members",
      "Personalized member tracking with goal recommendations",
      "Fast load times (<1s) via Vite optimization",
      "Mobile-responsive design for on-the-go access",
      "Easy setup with npm install and dev server"
    ]
  },
  {
    name: "Alomonx",
    accent: "#94a3b8",
    tagline: "Tech Consultancy Portfolio",
    description: "Sleek portfolio site showcasing software solutions and digital marketing services for a tech consultancy firm.",
    tech: [
      "Next.js",
      "Tailwind CSS",
      "Framer Motion"
    ],
    liveUrl: "https://alomonx.vercel.app/",
    githubUrl: "https://github.com/Amitkr77/alomonx",
    image: "/project/alomonx.webp",
    challenge: "Design a professional, SEO-optimized portfolio that highlights diverse services like custom software and marketing strategies in a minimalist UI.",
    solution: [
      "Next.js for SSR and fast page loads",
      "Tailwind for clean, responsive layouts",
      "Framer Motion for subtle animations on service cards",
      "Integrated contact forms and case study sections",
      "SEO-friendly structure with meta tags for consultancy leads"
    ],
    results: [
      "Professional showcase attracting 50+ inquiries",
      "Optimized for speed (Lighthouse score 95+)",
      "Modular sections for easy content updates",
      "Cross-device compatibility for global clients",
      "Focus on software/digital marketing narratives"
    ]
  },
  {
    name: "Paws On Time",
    accent: "#fb7185",
    tagline: "Complete Pet Care Platform",
    description: "Pet care service platform for scheduling grooming, vet visits, and boarding with easy booking and reminders.",
    tech: [
      "Next.js",
      "Tailwind",
      "Node.js",
      "MongoDB",
      "Stripe"
    ],
    liveUrl: "https://paws-on-time.vercel.app/",
    githubUrl: "https://github.com/Amitkr77/paws-on-time",
    image: "/project/pawson.webp",
    challenge: "Build an intuitive booking system for pet services that handles appointments, payments, and notifications for busy pet owners.",
    solution: [
      "Next.js for dynamic booking calendars",
      "MongoDB for storing pet profiles and schedules",
      "Stripe integration for seamless service payments",
      "Tailwind for pet-friendly, vibrant UI",
      "Email/SMS reminders via Twilio for appointments"
    ],
    results: [
      "Streamlined bookings reducing no-shows by 40%",
      "User dashboard for pet history and upcoming services",
      "Scalable to multiple service providers",
      "Mobile-first design for on-the-go scheduling",
      "Live platform with full CRUD for services"
    ]
  },
  {
    name: "Hunger Food",
    accent: "#f97316",
    tagline: "Food Ordering App",
    description: "Full-stack MERN restaurant app enabling users to browse menus, add to cart, and place orders with real-time status updates.",
    tech: [
      "MongoDB",
      "Express",
      "React",
      "Node.js",
      "JWT",
      "Razorpay"
    ],
    liveUrl: "https://hunger-food.vercel.app/",
    githubUrl: "https://github.com/Amitkr77/hunger-food",
    image: "/project/hungerfood.webp",
    challenge: "Build a smooth, scalable food delivery app with real-time order tracking, secure payments, and admin panel for restaurant management.",
    solution: [
      "React + Context API for cart & order state",
      "Node.js + Express backend with RESTful APIs",
      "MongoDB for menu, orders, and user data",
      "JWT authentication for users and admin",
      "Razorpay integration for secure checkout"
    ],
    results: [
      "Live ordering with real-time status (cooking → out for delivery)",
      "Admin panel to manage menu, orders, and revenue",
      "Responsive UI with dark mode support",
      "Cart persistence using localStorage",
      "Deployed on Vercel with full MERN stack"
    ]
  },
  {
    name: "SkyScyn",
    accent: "#22d3ee",
    tagline: "Advanced Weather App",
    description: "Real-time weather app with 7-day forecasts, interactive rain charts, and global weather maps using live API data.",
    tech: [
      "React",
      "Chart.js",
      "OpenWeather API",
      "Tailwind",
      "Vite"
    ],
    liveUrl: "https://skysyncapp.netlify.app/",
    githubUrl: "https://github.com/Amitkr77/SkySync",
    image: "/project/skyscy.webp",
    challenge: "Deliver accurate, visually engaging weather data with interactive charts and global coverage while maintaining fast load times.",
    solution: [
      "React + Vite for instant development feedback",
      "OpenWeatherMap API for real-time & forecast data",
      "Chart.js for dynamic rain probability and temp graphs",
      "Geolocation + search for global city weather",
      "Tailwind for responsive, animated UI components"
    ],
    results: [
      "98% forecast accuracy via reliable API integration",
      "30% increase in user engagement with interactive charts",
      "Global weather maps with zoom & pin support",
      "Mobile-first design with smooth animations",
      "Live search with 200+ supported cities"
    ]
  },
  {
    name: "AuthShield",
    accent: "#818cf8",
    tagline: "Role-Based Authentication",
    description: "Secure user authentication system with role-based access control (Admin, Manager, User) using JWT and MongoDB.",
    tech: [
      "MongoDB",
      "Express",
      "Node.js",
      "JWT",
      "bcrypt",
      "Postman"
    ],
    githubUrl: "https://github.com/Amitkr77/AuthShield",
    challenge: "Implement granular access control to prevent unauthorized actions while maintaining clean, scalable backend architecture.",
    solution: [
      "Express middleware for role-based route protection",
      "JWT for stateless, secure session management",
      "bcrypt for password hashing and salting",
      "MongoDB schemas for users with role field",
      "Postman collection for API testing & documentation"
    ],
    results: [
      "Zero unauthorized access in penetration testing",
      "Scalable to 10k+ users with token validation",
      "Reusable auth module for future projects",
      "Clean API endpoints with role checks",
      "Full CRUD for user management (Admin only)"
    ]
  },
  {
    name: "AloCodes",
    accent: "#a78bfa",
    tagline: "Learn | Code | Placed",
    description: "Online learning platform offering multiple career-focused courses where students can learn, code, and get placement-ready under guidance of highly qualified instructors.",
    tech: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Node.js"
    ],
    liveUrl: "https://alocodes.in/",
    image: "/project/alocodes.webp",
    challenge: "Build a scalable education platform that helps students choose the right course, learn effectively, and gain industry-ready skills with expert mentorship.",
    solution: [
      "Structured course catalog with clear learning paths",
      "Instructor-led modules by domain experts",
      "Student-friendly UI with responsive layouts",
      "Fast, SEO-optimized pages for course discovery",
      "Expandable architecture for adding new courses"
    ],
    results: [
      "Centralized learning hub for multiple tech fields",
      "Improved student engagement through clear pathways",
      "Professional platform showcasing instructor expertise",
      "Mobile-first design for anytime learning",
      "Foundation ready for LMS & placement features"
    ]
  },
  {
    name: "EVWheels",
    accent: "#4ade80",
    tagline: "Electric Cycle E-Commerce",
    description: "E-commerce platform for selling electric cycles and related spare parts with a smooth shopping and checkout experience.",
    tech: [
      "Next.js",
      "Node.js",
      "MongoDB",
      "Tailwind CSS",
      "Stripe"
    ],
    liveUrl: "https://evwheels.in/",
    image: "/project/evwheels.webp",
    challenge: "Create a modern e-commerce platform focused on electric mobility, supporting product variations, parts inventory, and secure payments.",
    solution: [
      "Product listings for electric cycles and accessories",
      "Category-based navigation for parts and components",
      "Secure checkout and payment integration",
      "Responsive UI optimized for mobile buyers",
      "Scalable backend for inventory and orders"
    ],
    results: [
      "Smooth online purchasing experience for EV products",
      "Clear separation of cycles and spare parts",
      "Improved reach for electric mobility solutions",
      "Scalable structure for adding new EV models",
      "Ready for future logistics & order tracking"
    ]
  },
  {
    name: "Homeasy",
    context: "Built at Homeasy Automation",
    accent: "#fbbf24",
    tagline: "IoT Home Automation Store",
    description: "E-commerce platform selling IoT-based home automation products including smart switches, sensors, and intelligent control systems.",
    tech: [
      "Next.js",
      "Node.js",
      "MongoDB",
      "Tailwind CSS",
      "Stripe"
    ],
    liveUrl: "https://homeasy.online/",
    image: "/project/homeasy.webp",
    challenge: "Design an e-commerce platform that clearly presents complex IoT home automation products while maintaining ease of purchase.",
    solution: [
      "Product pages with clear specs and use-cases",
      "Category-based browsing for automation devices",
      "Secure payment flow for hardware purchases",
      "Modern, minimal UI to build product trust",
      "SEO-friendly structure for smart-home searches"
    ],
    results: [
      "Simplified buying experience for IoT products",
      "Clear presentation of smart home solutions",
      "Professional storefront for home automation brand",
      "Mobile-optimized shopping experience",
      "Scalable catalog for future IoT expansions"
    ]
  }
];
