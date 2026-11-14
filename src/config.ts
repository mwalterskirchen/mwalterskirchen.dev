export const config = {
  site: {
    name: "Maximilian Walterskirchen",
    url: "https://mwalterskirchen.dev",
    description:
      "Senior Software Engineer based in Zurich. Building AI-powered products with TypeScript.",
  },
  personal: {
    name: "Maximilian Walterskirchen",
    email: "contact@mwalterskirchen.dev",
    githubProfile: "https://github.com/mwalterskirchen",
    linkedinProfile: "https://linkedin.com/in/mwalterskirchen",
  },
  newsletter: {
    name: "Thought Terminating",
    url: "https://thought-terminating.com",
  },
  // The home page is not here: the header links to it with Lilly's head.
  nav: [
    { label: "blog", href: "/blog" },
    { label: "talks", href: "/talks" },
    { label: "letter", href: "/newsletter" },
  ],
} as const;
