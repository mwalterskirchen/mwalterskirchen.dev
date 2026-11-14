// The build emits `blog.html` and `index.html`, which are served as `/blog` and `/`. This gives
// the path a page is served at, without a trailing slash.
export const pagePath = (url: URL) =>
  url.pathname.replace(/(\/index)?\.html$/, "").replace(/\/$/, "") || "/";
