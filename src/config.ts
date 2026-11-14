export const config = {
  site: {
    name: "Maximilian Walterskirchen",
    url: "https://mwalterskirchen.dev",
    description:
      "Senior Software Engineer in Zurich. I build production software with AI in the loop and write about making it reliable.",
  },
  personal: {
    name: "Maximilian Walterskirchen",
    email: "contact@mwalterskirchen.dev",
    jobTitle: "Senior Software Engineer",
    employer: "Staffgenius",
    // Staffgenius has no site of its own, so this is the site of its product, inplan.
    employerUrl: "https://inplan.ch",
    githubProfile: "https://github.com/mwalterskirchen",
    linkedinProfile: "https://linkedin.com/in/mwalterskirchen",
  },
  newsletter: {
    name: "Thought Terminating",
    url: "https://thought-terminating.com",
  },
  // The options of the menu (PauseMenu.astro).
  nav: [
    { label: "home", href: "/" },
    { label: "blog", href: "/blog" },
    { label: "talks", href: "/talks" },
    { label: "newsletter", href: "/newsletter" },
  ],
} as const;
