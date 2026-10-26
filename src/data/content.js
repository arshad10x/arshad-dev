export const disciplines = [
  { kanji: "一", label: "Frontend Architecture", indent: 0 },
  { kanji: "二", label: "Web Development", indent: 34 },
  { kanji: "三", label: "Remote Delivery", indent: 68 },
  { kanji: "四", label: "Responsive Systems", indent: 102 },
];

export const skills = [
  { name: "HTML5", accent: "wood" },
  { name: "CSS3", accent: "wood" },
  { name: "JavaScript", accent: "vermillion" },
  { name: "TypeScript", accent: "vermillion" },
  { name: "React", accent: "wood" },
  { name: "Next.js", accent: "wood" },
  { name: "Node.js", accent: "sage" },
  { name: "Redux", accent: "sage" },
  { name: "Chakra UI", accent: "sage" },
  { name: "Material UI", accent: "sage" },
  { name: "SQL", accent: "sage" },
  { name: "Laravel", accent: "wood" },
  { name: "Testing", accent: "vermillion" },
];

// Groups every entry in `skills` by what it's for — drives the Tools
// section. Each name must exist in `skills` above. Three groups of
// similar size so no row looks thin.
export const skillGroups = [
  { label: "Languages & markup", items: ["HTML5", "CSS3", "JavaScript", "TypeScript", "Dart"] },
  { label: "Frontend frameworks & UI", items: ["React", "Redux", "React Query", "Tailwind CSS", "Material UI"] },
  { label: "Mobile & backend services", items: ["Flutter", "Supabase", "Firebase Auth"] },
  { label: "QA & API testing", items: ["Postman", "Swagger", "JWT & RBAC testing", "DBeaver", "Jira"] },
  { label: "Database & tools", items: ["MySQL", "Git & GitHub", "Vite"] },
];

export const stats = [
  { num: "4+", unit: "years", label: "Frontend development and QA" },
  { num: "15+", unit: "REST APIs", label: "Tested: CRUD, auth, RBAC, negative cases" },
  { num: "40+", unit: "defects logged", label: "Including high-severity auth and validation bugs" },
  { num: "25+", unit: "production issues", label: "Resolved with root cause analysis" },
];

// `live` / `repo` render only when filled in, so there are never dead
// "#" links. `outcome` renders only when filled in too.
// TODO(Arshad): add live + repo URLs, and a one-line outcome per project
// (users, traffic, client feedback, performance — anything measurable).


export const projects = [
  {
    featured: true,
    numeral: "壱",
    title: "WatchWise",
    stack: "FLUTTER ・ DART ・ SUPABASE",
    desc: "Mobile app to track movies, series, shows and anime: ongoing, completed and watchlist, with season and episode progress, ratings and genre insights.",
    role: "Designed and built solo: UI, auth, database and tracking logic",
    outcome: "Personal app I use daily to track what I watch",
    images: [
      { src: "/projects/watchwise-1.png", label: "Home" },
      { src: "/projects/watchwise-2.png", label: "Episodes" },
      { src: "/projects/watchwise-3.png", label: "Genres" },
    ],
    live: "",
    repo: "https://github.com/YOUR-USERNAME/watchwise",
  },

  {
    featured: true,
    numeral: "弐",
    title: "Expensio",
    stack: "FLUTTER ・ DART ・ SUPABASE",
    desc: "Group expense tracker with Google sign-in, admin approval and role-based permissions. Split costs between 2 to 4 members, track who owes what, and see spending in charts.",
    role: "Designed and built solo: auth, RBAC, group logic, charts and settlements",
    outcome: "Admin-approved access with guest, edit and delete roles, plus custom splits and mark-as-paid settlement",
    images: [
      { src: "/projects/watchwise-1.png", label: "Home" },
      { src: "/projects/watchwise-2.png", label: "Episodes" },
      { src: "/projects/watchwise-3.png", label: "Genres" },
    ],
    live: "",
    repo: "https://github.com/YOUR-USERNAME/expensio",
  },
  {
    featured: true,
    numeral: "四",
    title: "Sip & Smile Junction",
    stack: "REACT ・ CSS ・ RESPONSIVE DESIGN",
    desc: "Website for Sip & Smile Junction, a casual dining cafe — a full digital menu spanning chai, dosa, pav bhaji, chaat, pasta and noodles, with pricing, categories and a contact section with WhatsApp, Instagram and location.",
    role: "Designed and built solo for a real client: layout, menu system, content and styling",
    outcome: "Cafe's first website — gives them a shareable menu and contact page instead of relying on word of mouth",
    frame: "browser",
    image: "/projects/sip-and-smile.png",
    live: "",
    repo: "https://github.com/YOUR-USERNAME/sip-and-smile",
  },
  // {
  //   title: "Edusity",
  //   stack: "REACT ・ FLEXBOX ・ FLUID DESIGN",
  //   desc: "Educational site — smooth scrolling, embedded video, contact form.",
  //   live: "",
  //   repo: "",
  // },
  // {
  //   title: "Weather Forecast",
  //   stack: "HTML ・ CSS ・ JAVASCRIPT",
  //   desc: "Vanilla-JS weather app with hourly and 5-day forecasts.",
  //   live: "",
  //   repo: "",
  // },
  // {
  //   title: "ShowSpot",
  //   stack: "HTML ・ JAVASCRIPT ・ API",
  //   desc: "Movie & TV discovery — ratings, genres, plot and cast.",
  //   live: "",
  //   repo: "",
  // },
];

// Letter section contact ledger. TODO(Arshad): swap the placeholder
// email for your real one, and fill in the GitHub / LinkedIn URLs — a
// link with an empty href is shown as plain text, never a dead "#".
export const contactMeta = [
  { label: "Email", value: "arshadahmed10x@gmail.com", href: "mailto:arshadahmed10x@gmail.com" },
  { label: "Based in", value: "Maharashtra, India — open to remote work" },
  {
    label: "Elsewhere",
    links: [
      { label: "GitHub", href: "" },
      { label: "LinkedIn", href: "" },
    ],
  },
];

export const journey = [
  {
    date: "Jan 2021",
    role: "Web Developer Intern",
    org: "Cojag",
    notes:
      "Learned HTML, CSS & JavaScript to build responsive pages; gained data collection and analysis skills with Excel and Python.",
  },
  {
    date: "Jan – Oct 2021",
    role: "Summer Intern",
    org: "ShapeAI",
    notes:
      "Python for data science — collected and processed data with Pandas and Matplotlib; built simple ML models with Scikit-learn.",
  },
  {
    date: "Oct 2021 – Sep 2022",
    role: "Full Stack Web Development",
    org: "Newton School",
    notes:
      "Frontend and backend expertise through hands-on projects, rigorous coding tasks and industry mentorship.",
  },
  {
    date: "Sep 2022 – Oct 2024",
    role: "Software Developer",
    org: "Broadstairs IT Solution",
    notes:
      "Resolved critical reliability issues; API testing lifted data accuracy 25%; Redux & React Hooks lifted responsiveness 30%, cut load times 40%.",
  },
  {
    date: "Dec 2024 – now",
    role: "Software Engineer",
    org: "Yasham Software",
    // TODO(Arshad): placeholder — swap in your actual responsibilities /
    // wins at Yasham for the real copy.
    notes:
      "Currently building and maintaining production features as part of the team, carrying forward the same React, TypeScript and Laravel practices.",
    active: true,
  },
];
