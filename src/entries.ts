// Sorts collection entries newest first: `entries.sort(byNewest)`.
export const byNewest = (a: { data: { timestamp: Date } }, b: { data: { timestamp: Date } }) =>
  b.data.timestamp.valueOf() - a.data.timestamp.valueOf();

// How many minutes a post takes to read, at 180 words a minute. Code counts as words.
export const readTime = (entry: { body?: string }) =>
  Math.max(1, Math.ceil((entry.body ?? "").split(/\s+/).filter(Boolean).length / 180));
