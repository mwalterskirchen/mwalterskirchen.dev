import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { byNewest } from "../entries";
import { config } from "../config";

export async function GET(context: { site: URL }) {
  const posts = (await getCollection("blog")).sort(byNewest);

  return rss({
    title: config.site.name,
    description: config.site.description,
    site: context.site,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.timestamp,
      link: `/blog/${post.data.slug}`,
    })),
  });
}
