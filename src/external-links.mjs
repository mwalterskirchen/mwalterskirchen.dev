// A plugin for Sätteri, Astro's Markdown processor. Links in a post that lead off the site open
// in a new tab, like the external links of the `Anchor` component. The note for screen readers
// is added in CSS (`.blog-prose` in global.css), because text added here would end up in the
// id of a heading that holds a link. A link written as raw HTML is not an element here, so it
// has to set its own `target` and `rel`.

/** @param {string} site The site's own address. Links to it stay in the same tab. */
export const externalLinks = (site) => {
  const own = new URL(site).origin;
  return {
    name: "external-links",
    element: {
      filter: ["a"],
      visit(node, ctx) {
        const url = URL.parse(String(node.properties?.href ?? ""), site);
        if (!url || !/^https?:$/.test(url.protocol) || url.origin === own) return;
        ctx.setProperty(node, "target", "_blank");
        ctx.setProperty(node, "rel", "noopener noreferrer");
      },
    },
  };
};
