import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
const { generateOpenGraphImage } = await jiti.import("astro-og-canvas");

const root = path.resolve(fileURLToPath(import.meta.url), "../..");
const blogsDir = path.join(root, "content/blogs");
const outDir = path.join(root, "public/og");

const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

await fs.mkdir(outDir, { recursive: true });

const files = (await fs.readdir(blogsDir)).filter((f) => f.endsWith(".md"));

const options = (title) => ({
  title,
  logo: { path: "./public/avatar.jpeg", size: [80, 80] },
  bgGradient: [[23, 23, 23]],
  padding: 80,
  border: { color: [16, 185, 129], width: 6, side: "inline-start" },
  font: {
    title: {
      color: [245, 245, 245],
      size: 56,
      weight: "Bold",
      families: ["IBM Plex Mono"],
      lineHeight: 1.25,
    },
  },
  fonts: [
    "https://raw.githubusercontent.com/IBM/plex/master/packages/plex-mono/fonts/complete/ttf/IBMPlexMono-Bold.ttf",
  ],
});

for (const file of files) {
  const raw = await fs.readFile(path.join(blogsDir, file), "utf8");
  const { data } = matter(raw);
  if (data.cardImage) {
    console.log(`[og] skip ${file} (has cardImage)`);
    continue;
  }
  const slug = data.slug ?? slugify(data.title);
  const out = path.join(outDir, `${slug}.png`);
  const body = await generateOpenGraphImage(options(data.title));
  await fs.writeFile(out, Buffer.from(await new Response(body).arrayBuffer()));
  console.log(`[og] wrote ${path.relative(root, out)}`);
}
