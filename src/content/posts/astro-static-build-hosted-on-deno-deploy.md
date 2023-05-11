---
title: Astro static build hosted on Deno Deploy
pubDate: 2023-05-11 16:20
---

The Astro documentation contains clear information on how to deploy a [server-rendered Astro site to Deno Deploy](https://docs.astro.build/en/guides/deploy/deno/). However, I have encountered some issues with Astro's SSR output while rendering the RSS feed for this website. As a result, I have been using static rendered output for some time.

I couldn't find much information on how to deploy a static Astro build to Deno Deploy, possibly because it is straightforward. Nevertheless, I wanted to document the process here in case anyone needs it.

The trick is that you can use a file server in your GitHub Deploy Action to deploy your Astro site to Deno Deploy:

```yaml
- name: Upload to Deno Deploy
  uses: denoland/deployctl@v1
  with:
    project: 'your-project'
    entrypoint: 'https://deno.land/std@0.186.0/http/file_server.ts'
    root: 'dist'
```

For the entire workflow file, see the [deploy.yml](https://github.com/bdevos/appjeniksaan-site/blob/main/.github/workflows/deploy.yml) of this website.
