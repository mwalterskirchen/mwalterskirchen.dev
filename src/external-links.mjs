// A plugin for Sätteri, Astro's Markdown processor. Links in a post that lead off the site open
// in a new tab and say so to screen readers, like the external links of the `Anchor` component.

/** @param {string} site The site's own address. Links to it stay in the same tab. */
export const externalLinks = (site) => ({
  name: "external-links",
  element: {
    filter: ["a"],
    visit(node, ctx) {
      const href = String(node.properties?.href ?? "");
      if (!/^https?:\/\//.test(href) || href.startsWith(site)) return;
      ctx.setProperty(node, "target", "_blank");
      ctx.setProperty(node, "rel", "noopener noreferrer");
      ctx.appendChild(node, {
        type: "element",
        tagName: "span",
        properties: { className: ["sr-only"] },
        children: [{ type: "text", value: " (opens in a new tab)" }],
      });
    },
  },
});
