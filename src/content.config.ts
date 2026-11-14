import { defineCollection, type CollectionEntry } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { XMLParser } from "fast-xml-parser";
import { config } from "./config";

export type ArticleFrontmatter = CollectionEntry<"blog">["data"] & {
  url: string;
  /** Minutes, worked out from the length of the post (src/entries.ts). */
  readTime: number;
};

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/blogs" }),
  // Strict, so that a mistyped key, or one that is no longer used, fails the build.
  schema: z.strictObject({
    title: z.string(),
    // Required, so that a post's address never depends on its title.
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    description: z.string(),
    cardImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    timestamp: z.date(),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/talks" }),
  schema: z.object({
    title: z.string(),
    event: z.string(),
    description: z.string(),
    timestamp: z.date(),
    repoUrl: z.url(),
    slidesUrl: z.url().optional(),
    featured: z.boolean().default(false),
  }),
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
    url: z.url(),
    author: z.string(),
    timestamp: z.date(),
  }),
});

export const collections = { blog, talks, newsletter };
