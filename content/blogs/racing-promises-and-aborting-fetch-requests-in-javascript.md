---
title: Racing Promises and Aborting Fetch Requests in JavaScript
slug: racing-promises-and-aborting-fetch-requests-in-javascript
description: Learn how to use Promise.race and AbortController to handle slow fetch requests and improve user experience in JavaScript.
longDescription: Discover how Promise.race can help you respond to the fastest asynchronous task, and how to combine it with AbortController to abort slow fetch requests. This guide explains practical patterns for racing promises, handling timeouts, and ensuring your users never wait forever for a response.
tags: ["javascript", "typescript"]
featured: true
readTime: 4
timestamp: 2025-10-02T12:24:01+00:00
---

Sometimes, you don’t actually care about _all_ your asynchronous tasks finishing.  
You just care about **the first one that does something useful**.

That’s where [`Promise.race`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) comes in.

## What is `Promise.race`?

If you give `Promise.race` an array of promises, it resolves (or rejects) as soon as _one of them_ settles.

It’s like saying:

> “I don’t want to wait for everyone to finish their homework. The first one who shows me _anything_ wins.”

For example:

```js
const fast = new Promise((resolve) => setTimeout(() => resolve("fast!"), 100));
const slow = new Promise((resolve) =>
  setTimeout(() => resolve("slow..."), 200),
);

Promise.race([fast, slow]).then(console.log);
// → "fast!"
```

The slow promise is still running in the background, but we’ve already moved on.

## Why should you care?

Because in the real world, waiting can be painful.

Imagine a fetch request that takes too long. Do you just sit there, staring at a loading spinner for eternity? Or do you decide:

> “If this API doesn’t respond in time, I’ll just abort it and show a fallback.”

This is especially relevant for **long-running tasks**—like calling an AI model that may or may not take 20 seconds.

Enter our hero: **`Promise.race` + `AbortController`.**

## Racing a fetch with a timeout

Here’s a neat trick:

```js
const abortController = new AbortController();

const backupPromise = new Promise((resolve) =>
  setTimeout(() => {
    abortController.abort();
    resolve("API Request Timeout");
  }, 1000),
);

const fetchPromise = fetch("https://jsonplaceholder.typicode.com/todos/1", {
  signal: abortController.signal,
}).then((res) => res.json());

const resolvedPromise = await Promise.race([backupPromise, fetchPromise]);

console.log(resolvedPromise);
```

What happens here?

1. We create an `AbortController` so we can cancel our fetch.
2. We make a `backupPromise` that:
   - waits **1 second**,
   - aborts the fetch,
   - and then resolves with `"API Request Timeout"`.

3. We kick off a `fetchPromise` with the abort signal.
4. We **race** them.
   Whichever finishes first decides the outcome.

---

## The result

- If the fetch is fast enough:
  → you’ll get the JSON response.

- If the fetch is too slow:
  → the `backupPromise` wins, aborts the fetch, and you’ll get `"API Request Timeout"`.

Either way, **the user isn’t stuck waiting forever.**

## ⚠️ A gotcha: promises don’t disappear

Here’s the catch:
`Promise.race` doesn’t magically cancel the other promises.

In the earlier `fast` vs `slow` example, the slow one still runs.
It’s just that nobody cares anymore.

That’s fine for a `setTimeout`.
But for things like `fetch` requests, this means wasted network calls—unless you explicitly cancel them.

That’s exactly why we used `AbortController` in the example.
Without it, the fetch would still finish eventually, burning bandwidth for no reason.

So remember:

- `Promise.race` picks a winner.
- The losers keep going—unless you stop them yourself.

## Why this matters

This pattern isn’t just about making your code look fancy.
It’s about **user experience**:

- No endless loading spinners.
- You can **fail fast** and gracefully recover.
- You can even **fallback** to a cached result, a loading skeleton, or some default data.

In apps that depend on unpredictable external APIs (or AI services), this kind of control can be the difference between _“ugh this app feels broken”_ and _“wow, that was smooth.”_

## Further reading

- [MDN: Promise.race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
- [MDN: AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

---

At the end of the day, `Promise.race` is a little like real life:
you can wait for _everyone_ to finish, or you can let the fastest one decide what happens next.

Sometimes, speed is the better experience.
