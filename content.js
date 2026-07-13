// src/config/content.js
//
// All portfolio text/UI content, kept separate from sections.js (animation timing)
// per the "animation and UI are decoupled" principle. React overlay components
// import from here, keyed by section id, matching sections.js's `id` field.

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

export const CONTENT = {
  home: {
    title: "Hi, I'm K. Lokesh",
    subtitle: "Java Full Stack Developer • React Developer • AI & ML Enthusiast",
    tagline:
      "Building scalable software, crafting immersive web experiences, and transforming ideas into intelligent digital solutions.",
    description:
      "I'm a passionate software developer specializing in Java Full Stack Development, modern frontend technologies, and AI-powered applications. I enjoy solving complex problems, designing intuitive user experiences, and building applications that combine performance, clean architecture, and creativity.",
  },

  about: {
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
      "Artificial Intelligence",
      "Full Stack Development",
      "Software Architecture",
      "Web Performance",
      "Creative Development",
      "Animation",
      "UI/UX Design",
      "Problem Solving",
      "Technology",
      "Movies",
      "Anime",
      "Cricket",
    ],
    hobbies: [
      "Watching Movies",
      "Watching Anime",
      "Learning New Technologies",
      "Building Side Projects",
      "Gaming",
      "Creative UI Design",
    ],
    softSkills: [
      "Problem Solving",
      "Logical Thinking",
      "Continuous Learning",
      "Adaptability",
      "Creativity",
      "Communication",
      "Team Collaboration",
      "Attention to Detail",
      "Time Management",
    ],
  },

  skills: {
    heading: "Skills",
    categories: [
      { label: "Programming Languages", items: ["Java", "JavaScript", "HTML", "CSS", "SQL"] },
      { label: "Frontend", items: ["React", "Bootstrap", "Responsive Design", "Component Architecture", "Modern CSS"] },
      { label: "Backend", items: ["Node.js", "Express.js", "REST APIs", "Authentication"] },
      { label: "Database", items: ["MySQL", "Firebase Firestore", "SQL"] },
      { label: "Tools", items: ["Git", "GitHub", "VS Code", "Postman", "Firebase", "npm", "Vite"] },
      {
        label: "Concepts",
        items: [
          "Object-Oriented Programming",
          "Data Structures",
          "Algorithms",
          "Responsive Design",
          "REST API Development",
          "Authentication",
          "Database Design",
          "State Management",
          "Performance Optimization",
          "Component Architecture",
          "AI & ML Fundamentals",
        ],
      },
    ],
  },

  techstack: {
    heading: "Tech Stack",
    categories: [
      { label: "Languages", items: ["Java", "JavaScript", "HTML5", "CSS3", "SQL"] },
      { label: "Frontend", items: ["React", "Bootstrap", "Vite"] },
      { label: "Backend", items: ["Node.js", "Express.js"] },
      { label: "Database", items: ["MySQL", "Firebase"] },
      { label: "Tools", items: ["Git", "GitHub", "VS Code", "Postman"] },
    ],
  },

  projects: {
    heading: "Projects",
    items: [
      {
        title: "DevMentor AI",
        tag: "Flagship Project",
        description:
          "A production-oriented AI-powered learning platform designed to help developers master Java Full Stack Development through structured learning paths, coding practice, interview preparation, AI assistance, and project-based learning.",
        features: [
          "Interactive Learning Platform",
          "AI Assistant",
          "Authentication",
          "Offline Support",
          "Responsive Design",
          "Learning Roadmaps",
          "Coding Challenges",
          "Interview Preparation",
          "Project-Based Learning",
          "Progress Tracking",
          "Modern UI",
          "Clean Architecture",
        ],
      },
      {
        title: "IPL Information Platform",
        tag: null,
        description:
          "A React-based web application providing IPL team information, player squads, statistics, quizzes, and an integrated merchandise store.",
        features: [
          "Team Details",
          "Player Squads",
          "IPL Store",
          "Product Pages",
          "Quiz Platform",
          "Responsive Design",
          "Modern React Architecture",
        ],
      },
      {
        title: "3D Cinematic Portfolio",
        tag: null,
        description:
          "An interactive cinematic portfolio powered by scroll-driven animation, featuring a frame-based runtime engine, smooth transitions, immersive storytelling, and production-grade rendering techniques.",
        features: [
          "Canvas Rendering",
          "Scroll Runtime",
          "Frame Caching",
          "Animation Engine",
          "Responsive Layout",
          "Interactive UI",
          "Performance Optimization",
        ],
      },
    ],
  },

  experience: {
    heading: "Experience",
    items: [
      {
        role: "Full Stack Developer Intern",
        company: "Charani Infotech Pvt Ltd",
        responsibilities: [
          "Frontend Development",
          "Backend Development",
          "REST APIs",
          "Database Integration",
          "React Development",
          "JavaScript Development",
          "Bug Fixing",
          "Feature Development",
          "Team Collaboration",
        ],
      },
    ],
  },

  education: {
    heading: "Education",
    items: [
      {
        level: "Bachelor of Technology",
        degree: "B.Tech",
        branch: "Computer Science & Engineering (Artificial Intelligence & Machine Learning)",
        institution: "Sri Vasavi Institute of Engineering & Technology",
        status: "Final Year",
      },
      {
        level: "Intermediate",
        institution: "Sri Chaitanya Junior College",
        location: "Gudivada",
        duration: "2020–2022",
      },
      {
        level: "Secondary School",
        institution: "Sahayamatha English Medium High School",
        location: "Mudinepalli",
        completed: "2020",
      },
      {
        level: "Primary School",
        institution: "Sri Gayatri Vidhyanikethan English Medium School",
        location: "Vadali",
      },
    ],
  },

  achievements: {
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

  contact: {
    heading: "Contact",
    name: "K. Lokesh",
    roles: ["Java Full Stack Developer", "React Developer", "AI & ML Enthusiast"],
    location: ["Vadali", "Mudinepalli Mandal", "Krishna District", "Andhra Pradesh", "India"],
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
