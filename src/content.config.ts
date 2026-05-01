import { defineCollection, z, type CollectionEntry } from "astro:content";
import { glob } from "astro/loaders";

export type ArticleFrontmatter = CollectionEntry<"blog">["data"] & {
  url: string;
};

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/blogs" }),
  schema: z
    .object({
      title: z.string(),
      slug: z.string().optional(),
      description: z.string(),
      longDescription: z.string().optional(),
      cardImage: z.string().optional(),
      tags: z.array(z.string()).optional(),
      readTime: z.number().optional(),
      featured: z.boolean().default(false),
      timestamp: z.date().transform((val) => new Date(val)),
    })
    .transform((data) => ({ ...data, slug: data.slug ?? slugify(data.title) })),
});

const talks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/talks" }),
  schema: z
    .object({
      title: z.string(),
      slug: z.string().optional(),
      event: z.string(),
      description: z.string(),
      timestamp: z.date().transform((val) => new Date(val)),
      repoUrl: z.string().url(),
      slidesUrl: z.string().url().optional(),
      featured: z.boolean().default(false),
    })
    .transform((data) => ({ ...data, slug: data.slug ?? slugify(data.title) })),
});

export const collections = { blog, talks };
