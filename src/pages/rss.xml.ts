import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { config } from "../config";

export async function GET(context: { site: URL }) {
  const posts = await getCollection("blog");

  return rss({
    title: config.site.name,
    description:
      "Senior Full Stack Engineer based in Zurich. Passionate about AI, Web Development and Cybersecurity.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.timestamp,
      link: `/blog/${post.data.slug}`,
    })),
  });
}
