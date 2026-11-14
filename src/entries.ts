// Sorts collection entries newest first: `entries.sort(byNewest)`.
export const byNewest = (a: { data: { timestamp: Date } }, b: { data: { timestamp: Date } }) =>
  b.data.timestamp.valueOf() - a.data.timestamp.valueOf();
