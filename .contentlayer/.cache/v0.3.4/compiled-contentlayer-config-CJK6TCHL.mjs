// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
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
var contentlayer_config_default = makeSource({
  contentDirPath: "_writeups",
  documentTypes: [Writeup]
});
export {
  Writeup,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-CJK6TCHL.mjs.map
