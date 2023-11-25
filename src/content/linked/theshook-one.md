---
title: 🫨 theshook.¹
href: https://theshook.one
pubDate: 2023-11-25 07:32
---

Talking about creating useless software, last weekend I spent some time to create an RSS feed aggregator for [The Verge](https://www.theverge.com/). Could I not just use any RSS aggregator to do the same, yes, but that would deprive me of learning something new and writing useless code. 

The site stores its links in [Deno KV](https://deno.com/kv) and uses `expireIn` to automatically remove links 7 days after their publish date. It applies `:visited` styling to the links to see which pages you have already visited. And on a return visit it shows the time of the new links in **`bold`**.

It's pretty basic, but was fun to create, the source code is up on [Github](https://github.com/bdevos/theshook.one).

Oh yeah, the name, I didn't want this thing to be too serious, of course it is related to [Shook Ones, Pt. II](https://youtu.be/yoYZf-lBF_U) by Mobb Deep.

Check it out now: [https://theshook.one](https://theshook.one)
