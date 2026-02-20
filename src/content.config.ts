import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

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
    .transform((data) => {
      const slug =
        data.slug ??
        data.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");
      return { ...data, slug };
    }),
});

export const collections = { blog };
