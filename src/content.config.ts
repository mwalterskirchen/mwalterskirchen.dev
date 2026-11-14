import { defineCollection, z, type CollectionEntry } from "astro:content";
import { glob } from "astro/loaders";
import { XMLParser } from "fast-xml-parser";
import { config } from "./config";

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

type FeedItem = {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  "dc:creator": string;
};

const namedEntities: Record<string, string> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" };

// Substack writes its titles and descriptions as HTML inside CDATA, so the XML parser leaves
// their entities as they are.
const decodeEntities = (text: string) =>
  text.replace(/&(?:#(\d+)|#x([\da-f]+)|(\w+));/gi, (entity, decimal, hex, name) => {
    if (decimal) return String.fromCodePoint(Number(decimal));
    if (hex) return String.fromCodePoint(parseInt(hex, 16));
    return namedEntities[name] ?? entity;
  });

// The issues come from the newsletter's feed at build time, so a new issue shows up with the
// next deploy. A feed that cannot be read fails the build: the deployed site keeps its list
// instead of being replaced by one without issues.
const newsletter = defineCollection({
  loader: async () => {
    const feedUrl = `${config.newsletter.url}/feed`;
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error(`Newsletter feed ${feedUrl} answered ${response.status}`);
    }
    const parser = new XMLParser({ parseTagValue: false, isArray: (tag) => tag === "item" });
    const items: FeedItem[] = parser.parse(await response.text()).rss.channel.item ?? [];
    return items.map((item) => ({
      id: new URL(item.link).pathname.split("/").at(-1) ?? item.link,
      title: decodeEntities(item.title),
      description: decodeEntities(item.description),
      url: item.link,
      author: item["dc:creator"],
      timestamp: new Date(item.pubDate),
    }));
  },
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url(),
    author: z.string(),
    timestamp: z.date(),
  }),
});

export const collections = { blog, talks, newsletter };
