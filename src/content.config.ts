import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";
import { parse as parseToml } from "toml";

/**
 * Loader and schema for the configuration collection.
 * It loads a TOML file from the `content/configuration.toml` path and defines the schema for the configuration data.
 */
const configuration = defineCollection({
  loader: file("content/configuration.toml", {
    parser: (text) => JSON.parse(JSON.stringify(parseToml(text))),
  }),
  schema: z.object({
    /**
     * Core site configuration.
     */
    site: z.object({
      /**
       * This should be the base URL of your live site,
       * and is used to generate absolute URLs for links and metadata.
       */
      baseUrl: z.string().url(),
    }),

    /**
     * The global metadata for the site. If specific page metadata is not provided,
     * this metadata will be used as a fallback for SEO and Open Graph tags.
     */
    globalMeta: z.object({
      /**
       * The title of the page, used in the HTML `<title>` tag and Open Graph metadata.
       */
      title: z.string(),

      /**
       * The short description of the page, used in Open Graph metadata and as a fallback for SEO.
       */
      description: z.string(),

      /**
       * The long description of the page, used in Open Graph metadata and as a fallback for SEO.
       */
      longDescription: z.string().optional(),

      /**
       * The URL of the card image for social media sharing.
       */
      cardImage: z.string().optional(),

      /**
       * Keywords for SEO, used in the `<meta name="keywords">` tag.
       */
      keywords: z.array(z.string()).optional(),
    }),

    notFoundMeta: z.object({
      /**
       * The title of the page, used in the HTML `<title>` tag and Open Graph metadata.
       */
      title: z.string(),

      /**
       * The short description of the page, used in Open Graph metadata and as a fallback for SEO.
       */
      description: z.string(),

      /**
       * The long description of the page, used in Open Graph metadata and as a fallback for SEO.
       */
      longDescription: z.string().optional(),

      /**
       * The URL of the card image for social media sharing.
       */
      cardImage: z.string().optional(),

      /**
       * Keywords for SEO, used in the `<meta name="keywords">` tag.
       */
      keywords: z.array(z.string()).optional(),
    }),

    /**
     * The blog page's metadata.
     */
    blogMeta: z.object({
      /**
       * The title of the page, used in the HTML `<title>` tag and Open Graph metadata.
       */
      title: z.string(),

      /**
       * The short description of the page, used in Open Graph metadata and as a fallback for SEO.
       */
      description: z.string(),

      /**
       * The long description of the page, used in Open Graph metadata and as a fallback for SEO.
       */
      longDescription: z.string().optional(),

      /**
       * The URL of the card image for social media sharing.
       */
      cardImage: z.string().optional(),

      /**
       * Keywords for SEO, used in the `<meta name="keywords">` tag.
       */
      keywords: z.array(z.string()).optional(),
    }),

    /**
     * The hero section configuration.
     */
    hero: z.object({
      /**
       * The title displayed in the hero section.
       */
      title: z.string().default("Maximilian Walterskirchen"),

      /**
       * The subtitle displayed in the hero section.
       */
      subtitle: z
        .string()
        .default(
          "Senior Full Stack Developer </br> Passionate about AI and Web Development",
        ),

      /**
       * The URL of the hero image, used as a background image in the hero section.
       */
      image: z.string().optional(),
    }),

    /**
     * The personal information of the site owner or author.
     */
    personal: z.object({
      /**
       * The name of the site owner or author, used in various places throughout the site.
       */
      name: z.string().default("Maximilian Walterskirchen"),

      /**
       * The email of the site owner or author.
       */
      email: z.string().email().optional(),

      /**
       * The CV of the site owner or author.
       */
      cv: z.string().optional(),

      /**
       * The GitHub profile URL of the site owner or author.
       */
      githubProfile: z.string().url().optional(),

      /**
       * The Twitter profile URL of the site owner or author.
       */
      twitterProfile: z.string().url().optional(),

      /**
       * The LinkedIn profile URL of the site owner or author.
       */
      linkedinProfile: z.string().url().optional(),
    }),
    /**
     * The about section configuration.
     */
    about: z.object({
      /**
       * The title displayed in the about section.
       */
      title: z.string(),

      /**
       * The description displayed in the about section.
       */
      description: z.string(),

      /**
       * The title displayed in the skills section.
       */
      skillsTitle: z.string(),

      /**
       * The skills displayed in the about section.
       */
      skills: z.array(z.string()),
    }),
    education: z.object({
      /**
       * The title displayed in the education section.
       */
      title: z.string(),

      educations: z.array(
        z.object({
          title: z.string(),
          institution: z.string().optional(),
          institutionUrl: z.string().url().optional(),
          location: z.string().optional(),
          year: z.string(),
          thesis: z.string().optional(),
        }),
      ),
    }),

    experience: z.object({
      /**
       * The title displayed in the experience section.
       */
      title: z.string(),
      experiences: z.array(
        z.object({
          title: z.string(),
          company: z.string(),
          companyUrl: z.string().url().optional(),
          location: z.string(),
          start: z.string(),
          end: z.string(),
        }),
      ),
    }),

    /**
     * Commonly used text used throughout the site.
     */
    texts: z.object({
      /**
       * The text used when displaying the articles section on the homepage.
       */
      articlesName: z.string().default("Articles"),

      /**
       * The text used for the "View All" button in the articles and projects sections.
       */
      viewAll: z.string().default("View All"),

      /**
       * The text displayed when there are no articles found.
       */
      noArticles: z.string().default("No articles found."),

    }),

    /**
     * The menu configuration for the site.
     * This defines the URLs for the main navigation links.
     */
    menu: z.object({
      home: z.string().default("/"),
      blog: z.string().default("/blog"),
    }),
  }),
});

/**
 * Loader and schema for the blog collection.
 * It loads markdown files from the `content/blogs` directory and defines the schema for each blog post.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/blogs" }),
  schema: z
    .object({
      /**
       * The title of the blog post.
       */
      title: z.string(),

      /**
       * The slug for the blog post, used in the URL.
       */
      slug: z.string().optional(),

      /**
       * A short description of the blog post, used in Open Graph metadata and as a fallback for SEO.
       */
      description: z.string(),

      /**
       * The long description of the blog post, used in Open Graph metadata and as a fallback for SEO.
       */
      longDescription: z.string().optional(),

      /**
       * The URL of the card image for social media sharing.
       */
      cardImage: z.string().optional(),

      /**
       * The tags associated with the blog post, used for categorization and filtering.
       */
      tags: z.array(z.string()).optional(),

      /**
       * The estimated reading time of the blog post, in minutes.
       */
      readTime: z.number().optional(),

      /**
       * Whether the blog post is featured on the homepage.
       */
      featured: z.boolean().default(false),

      /**
       * The timestamp of the blog post, used for sorting and displaying the date.
       */
      timestamp: z.date().transform((val) => new Date(val)),
    })
    .transform((data) => {
      const slug =
        data.slug ??
        data.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");
      const newData = {
        ...data,
        slug,
      };
      return newData;
    }),
});


export const collections = { blog, configuration };
