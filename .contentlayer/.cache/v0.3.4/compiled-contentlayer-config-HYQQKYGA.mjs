// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";
var options = {
  theme: {
    dark: "dracula"
  }
};
var Writeup = defineDocumentType(() => ({
  name: "Writeup",
  filePathPattern: `**/*.md`,
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    categories: {
      type: "list",
      of: { type: "enum", options: ["web", "pwn", "crypto", "intro"] }
    }
  },
  computedFields: {
    url: { type: "string", resolve: (post) => `/writeups/${post._raw.flattenedPath}` }
  }
}));
var contentLayerConfig = makeSource({
  contentDirPath: "_writeups",
  documentTypes: [Writeup],
  mdx: {
    // Create a visitor function that traverses the node tree of the content
    // and extracts the unmodified (raw text) content from all code elements nested
    // inside the pre tag. We'll store this text content on the pre node itself.
    // To traverse the node tree, we'll use the visit function from the unist-util-visit
    // package.
    // This visitor function should be added to the list of existing Rehype plugins.
    // This will give us a way to keep the unmodified code content.
    rehypePlugins: [
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "pre") {
            const [codeEl] = node.children;
            if (codeEl.tagName !== "code")
              return;
            node.raw = codeEl.children?.[0].value;
          }
        });
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      [rehypePrettyCode, options],
      () => (tree) => {
        visit(tree, (node) => {
          if (node?.type === "element" && node?.tagName === "div") {
            if (!("data-rehype-pretty-code-fragment" in node.properties)) {
              return;
            }
            for (const child of node.children) {
              if (child.tagName === "pre") {
                child.properties["raw"] = node.raw;
              }
            }
          }
        });
      }
    ]
  }
});
var contentlayer_config_default = contentLayerConfig;
export {
  Writeup,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-HYQQKYGA.mjs.map
