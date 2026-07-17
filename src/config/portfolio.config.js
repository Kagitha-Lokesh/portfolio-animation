// src/config/portfolio.config.js
// Unified Single Source of Truth — reconciled against the authoritative
// 1,293-frame / 30fps rendered timeline. Animation ranges, costumes, and
// safe-zones below match the actual generated video exactly.

export const SITE_META = {
  fullName: "Kagitha Lokesh",
  displayName: "K. Lokesh",
  dob: "17 August 2003",
  age: 22,
  gender: "Male",
  location: "Vadali, Mudinepalli Mandal, Krishna District, Andhra Pradesh, India",
  nationality: "Indian",
  languages: ["English", "Telugu"],
  brandStatement:
    "I believe great software is built through curiosity, continuous learning, and thoughtful problem-solving. Every project is an opportunity to learn, improve, and create meaningful digital experiences that make a real impact.",
  careerObjective:
    "To build scalable, intelligent, and user-centric software solutions while continuously improving my technical expertise in Java Full Stack Development, cloud technologies, artificial intelligence, and software architecture. I aspire to contribute to innovative products that create meaningful impact and deliver exceptional user experiences.",
};

export const PORTFOLIO_CONFIG = {
  fps: 30, // CORRECTED from 12 — matches actual rendered sequence
  totalFrames: 1293, // CORRECTED from 517

  experiences: [
    { id: "developer-journey", title: "Developer Journey", sections: ["home", "about", "skills", "techstack"] },
    { id: "career", title: "Career History", sections: ["projects", "experience", "achievements"] },
    { id: "personal", title: "Personal Path", sections: ["education", "contact"] },
  ],

  cameraProfiles: {
    wide: { parallax: 0.05 },
    present: { parallax: 0.08 },
    focus: { parallax: 0.12 },
    closeup: { parallax: 0.1 },
  },

  lightingProfiles: {
    WarmMorning: { brightness: 1.0, contrast: 1.0 },
    StudioDark: { brightness: 0.85, contrast: 1.1 },
    DuskGlow: { brightness: 0.95, contrast: 1.05 },
  },

  sections: {
    home: {
      id: "home",
      theme: "light",
      order: 1,
      title: "Home",
      animation: { enter: [0, 24], loop: [25, 57], exit: [60, 141], fps: 30 },
      camera: { profile: "wide", focusX: 0.38, focusY: 0.5, rotation: 0, safeZone: "left" },
      character: { outfit: "green_hoodie_backpack", pose: "stride_to_wave" },
      lighting: { profile: "WarmMorning" },
      transition: { duration: 900, easing: "power3.out" },
      timeline: [
        { frame: 5, event: "TITLE_IN" },
        { frame: 15, event: "SUBTITLE_IN" },
        { frame: 24, event: "BUTTONS_IN" },
      ],
      navbar: { mode: "compact" }, // waving hand reaches near top of frame
      content: {
        title: "Hi, I'm K. Lokesh",
        subtitle: "Java Full Stack Developer • React Developer • AI & ML Enthusiast",
        tagline:
          "Building scalable software, crafting immersive web experiences, and transforming ideas into intelligent digital solutions.",
        description:
          "I'm a passionate software developer specializing in Java Full Stack Development, modern frontend technologies, and AI-powered applications. I enjoy solving complex problems, designing intuitive user experiences, and building applications that combine performance, clean architecture, and creativity.",
      },
    },

    about: {
      id: "about",
      theme: "light",
      order: 2,
      title: "About Me",
      animation: { enter: [142, 151], loop: [152, 222], exit: [225, 337], fps: 30 },
      // Character actually renders right-of-center in this section (confirmed via screenshot + doc's
      // "Content shifts left" annotation) — treat as character-right for the safe-zone content system.
      camera: { profile: "present", focusX: 0.5, focusY: 0.5, rotation: 0, safeZone: "right" },
      character: { outfit: "beige_sweater", pose: "beanbag_sip" },
      lighting: { profile: "WarmMorning" },
      transition: { duration: 900, easing: "power3.out" },
      timeline: [
        { frame: 145, event: "TITLE_IN" },
        { frame: 147, event: "CONTENT_IN" },
      ],
      content: {
        heading: "About Me",
        paragraphs: [
          "I'm a final-year B.Tech student specializing in Artificial Intelligence and Machine Learning with a strong passion for Full Stack Development.",
          "My journey into software development started with curiosity and gradually evolved into building real-world applications using Java, React, Node.js, Firebase, SQL, and modern web technologies.",
          "I enjoy designing scalable software systems, solving challenging problems, and continuously learning new technologies. My goal is to become a highly skilled Software Engineer capable of building production-grade applications that make a meaningful impact.",
          "Outside of programming, I enjoy watching movies, anime, exploring new technologies, and creating creative digital experiences.",
        ],
        personalInfo: {
          fullName: "Kagitha Lokesh",
          displayName: "K. Lokesh",
          nationality: "Indian",
          location: "Vadali, Mudinepalli Mandal, Krishna District, Andhra Pradesh",
          languages: ["English", "Telugu"],
        },
        interests: [
          "Artificial Intelligence", "Full Stack Development", "Software Architecture", "Web Performance",
          "Creative Development", "Animation", "UI/UX Design", "Problem Solving", "Technology", "Movies", "Anime", "Cricket",
        ],
        hobbies: ["Watching Movies", "Watching Anime", "Learning New Technologies", "Building Side Projects", "Gaming", "Creative UI Design"],
        softSkills: [
          "Problem Solving", "Logical Thinking", "Continuous Learning", "Adaptability", "Creativity",
          "Communication", "Team Collaboration", "Attention to Detail", "Time Management",
        ],
      },
    },

    skills: {
      id: "skills",
      theme: "dark",
      order: 3,
      title: "Skills",
      animation: { enter: [338, 347], loop: [348, 417], exit: [420, 511], fps: 30 },
      // TRUE center — character genuinely centered, arms open presenting. Left/right column
      // layout will NOT work here. See layout note below.
      camera: { profile: "focus", focusX: 0.5, focusY: 0.5, rotation: 0, safeZone: "center" },
      character: { outfit: "yellow_hoodie", pose: "open_present" },
      lighting: { profile: "StudioDark" },
      transition: { duration: 900, easing: "power3.out" },
      timeline: [
        { frame: 343, event: "TITLE_IN" },
        { frame: 345, event: "CONTENT_IN" },
      ],
      content: {
        heading: "Skills",
        categories: [
          { label: "Programming Languages", items: ["Java", "JavaScript", "HTML", "CSS", "SQL"] },
          { label: "Frontend", items: ["React", "Bootstrap", "Responsive Design", "Component Architecture", "Modern CSS"] },
          { label: "Backend", items: ["Node.js", "Express.js", "REST APIs", "Authentication"] },
          { label: "Database", items: ["MySQL", "Firebase Firestore", "SQL"] },
          { label: "Tools", items: ["Git", "GitHub", "VS Code", "Postman", "npm", "Vite"] },
          { label: "Concepts", items: [
            "Object-Oriented Programming", "Data Structures", "Algorithms", "State Management",
            "Performance Optimization", "AI & ML Fundamentals",
          ] },
        ],
      },
    },

    techstack: {
      id: "techstack",
      theme: "dark",
      order: 4,
      title: "Tech Stack",
      animation: { enter: [512, 521], loop: [522, 597], exit: [600, 656], fps: 30 },
      // TRUE center, character leaning forward presenting — same layout constraint as Skills.
      camera: { profile: "focus", focusX: 0.5, focusY: 0.5, rotation: 0, safeZone: "left" },
      character: { outfit: "red_hoodie_backpack", pose: "lean_present_side" },
      lighting: { profile: "StudioDark" },
      transition: { duration: 900, easing: "power3.out" },
      timeline: [
        { frame: 516, event: "TITLE_IN" },
        { frame: 518, event: "CONTENT_IN" },
      ],
      content: {
        heading: "Tech Stack",
        categories: [
          { label: "Languages", items: ["Java", "JavaScript", "HTML5", "CSS3", "SQL"] },
          { label: "Frontend", items: ["React", "Bootstrap", "Vite"] },
          { label: "Backend", items: ["Node.js", "Express.js"] },
          { label: "Database", items: ["MySQL", "Firebase"] },
          { label: "Tools", items: ["Git", "GitHub", "VS Code", "Postman"] },
        ],
      },
    },

    projects: {
      id: "projects",
      theme: "light",
      order: 5,
      title: "Projects",
      animation: { enter: [657, 666], loop: [667, 772], exit: [775, 813], fps: 30 },
      camera: { profile: "wide", focusX: 0.38, focusY: 0.5, rotation: 0, safeZone: "right" },
      character: { outfit: "red_hoodie", pose: "desk_typing" },
      lighting: { profile: "WarmMorning" },
      transition: { duration: 900, easing: "power3.out" },
      timeline: [
        { frame: 661, event: "TITLE_IN" },
        { frame: 663, event: "CONTENT_IN" },
      ],
      content: {
        heading: "Projects",
        items: [
          {
            title: "DevMentor AI",
            tag: "Flagship Project",
            description:
              "A production-oriented AI-powered learning platform designed to help developers master Java Full Stack Development through structured learning paths, coding practice, interview preparation, AI assistance, and project-based learning.",
            features: [
              "Interactive Learning Platform", "AI Assistant", "Authentication", "Offline Support",
              "Responsive Design", "Learning Roadmaps", "Coding Challenges", "Interview Preparation",
              "Project-Based Learning", "Progress Tracking", "Modern UI", "Clean Architecture",
            ],
          },
          {
            title: "IPL Information Platform",
            tag: null,
            description:
              "A React-based web application providing IPL team information, player squads, statistics, quizzes, and an integrated merchandise store.",
            features: ["Team Details", "Player Squads", "IPL Store", "Product Pages", "Quiz Platform", "Responsive Design", "Modern React Architecture"],
          },
          {
            title: "3D Cinematic Portfolio",
            tag: null,
            description:
              "An interactive cinematic portfolio powered by scroll-driven animation, featuring a frame-based runtime engine, smooth transitions, immersive storytelling, and production-grade rendering techniques.",
            features: ["Canvas Rendering", "Scroll Runtime", "Frame Caching", "Animation Engine", "Responsive Layout", "Interactive UI", "Performance Optimization"],
          },
        ],
      },
    },

    experience: {
      id: "experience",
      theme: "light",
      order: 6,
      title: "Experience",
      animation: { enter: [814, 823], loop: [824, 927], exit: [930, 989], fps: 30 },
      // TRUE center — binoculars pose, panning. Same layout constraint as Skills/Tech Stack,
      // EXCEPT the existing card layout for Experience already works (confirmed via screenshot) —
      // likely because the card was positioned narrow enough to sit beside him. Keep as reference.
      camera: { profile: "present", focusX: 0.5, focusY: 0.5, rotation: 0, safeZone: "center" },
      character: { outfit: "purple_hoodie_backpack", pose: "binoculars_scan" },
      lighting: { profile: "WarmMorning" },
      transition: { duration: 900, easing: "power3.out" },
      timeline: [
        { frame: 819, event: "TITLE_IN" },
        { frame: 821, event: "CONTENT_IN" },
      ],
      content: {
        heading: "Experience",
        items: [
          {
            role: "Full Stack Developer Intern",
            company: "Charani Infotech Pvt Ltd",
            responsibilities: [
              "Frontend Development", "Backend Development", "REST APIs", "Database Integration",
              "React Development", "JavaScript Development", "Bug Fixing", "Feature Development", "Team Collaboration",
            ],
          },
        ],
      },
    },

    education: {
      id: "education",
      theme: "light",
      order: 7,
      title: "Education",
      animation: { enter: [990, 999], loop: [1000, 1067], exit: [1070, 1132], fps: 30 },
      // CORRECTED costume: beige_sweater, not light_shirt as previously assumed. TRUE center.
      camera: { profile: "present", focusX: 0.5, focusY: 0.5, rotation: 0, safeZone: "center" },
      character: { outfit: "beige_sweater", pose: "cross_legged_reading" },
      lighting: { profile: "WarmMorning" },
      transition: { duration: 900, easing: "power3.out" },
      timeline: [
        { frame: 995, event: "TITLE_IN" },
        { frame: 997, event: "CONTENT_IN" },
      ],
      content: {
        heading: "Education",
        items: [
          { level: "Bachelor of Technology", degree: "B.Tech", branch: "Computer Science & Engineering (Artificial Intelligence & Machine Learning)", institution: "Sri Vasavi Institute of Engineering & Technology", status: "Final Year" },
          { level: "Intermediate", institution: "Sri Chaitanya Junior College", location: "Gudivada", duration: "2020–2022" },
          { level: "Secondary School", institution: "Sahayamatha English Medium High School", location: "Mudinepalli", completed: "2020" },
          { level: "Primary School", institution: "Sri Gayatri Vidhyanikethan English Medium School", location: "Vadali" },
        ],
      },
    },

    achievements: {
      id: "achievements",
      theme: "light",
      order: 8,
      title: "Achievements",
      animation: { enter: [1133, 1142], loop: [1143, 1202], exit: [1205, 1248], fps: 30 },
      // CORRECTED costume: blue_button_shirt, not confident_collared_shirt as previously assumed.
      camera: { profile: "present", focusX: 0.42, focusY: 0.5, rotation: 0, safeZone: "left" },
      character: { outfit: "blue_button_shirt", pose: "trophy_celebration" },
      lighting: { profile: "WarmMorning" },
      transition: { duration: 900, easing: "power3.out" },
      timeline: [
        { frame: 1138, event: "TITLE_IN" },
        { frame: 1140, event: "CONTENT_IN" },
      ],
      navbar: { mode: "compact" }, // trophy raised near/above top of frame
      content: {
        heading: "Achievements",
        items: [
          "Successfully developed multiple full-stack web applications.",
          "Designed a production-style AI learning platform.",
          "Built a custom cinematic animation runtime for web experiences.",
          "Implemented optimized rendering systems for scroll-driven interfaces.",
          "Strong understanding of React component architecture.",
          "Experience integrating Firebase authentication and Firestore.",
          "Continuously learning Java Full Stack technologies and modern software architecture.",
        ],
      },
    },

    contact: {
      id: "contact",
      theme: "dark",
      order: 9,
      title: "Contact",
      animation: { enter: [1249, 1258], loop: [1259, 1292], exit: null, fps: 30 }, // final section
      // CORRECTED costume: green_shirt_white_tee. TRUE center, closeup zoom.
      camera: { profile: "closeup", focusX: 0.65, focusY: 0.5, rotation: 0, safeZone: "right" },
      character: { outfit: "green_shirt_white_tee", pose: "double_wave" },
      lighting: { profile: "DuskGlow" },
      transition: { duration: 900, easing: "power3.out" },
      timeline: [
        { frame: 1254, event: "TITLE_IN" },
        { frame: 1256, event: "CONTENT_IN" },
      ],
      navbar: { mode: "compact" }, // double-wave raises both hands into navbar zone
      content: {
        heading: "Contact",
        name: "K. Lokesh",
        roles: ["Java Full Stack Developer", "React Developer", "AI & ML Enthusiast"],
        location: ["Vadali", "Mudinepalli Mandal", "Krishna District", "Andhra Pradesh", "India"],
      },
    },
  },
};

export const NAVIGATION = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Me" },
  { id: "skills", label: "Skills" },
  { id: "techstack", label: "Tech Stack" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

export function getSectionById(id) {
  return PORTFOLIO_CONFIG.sections[id] ?? null;
}

export function getSectionByOrder(order) {
  return Object.values(PORTFOLIO_CONFIG.sections).find((s) => s.order === order) ?? null;
}
