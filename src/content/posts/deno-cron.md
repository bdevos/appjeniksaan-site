---
title: Deno.cron
pubDate: 2023-11-20 16:56
---

Last weekend, I was working on a [new project](https://theshook.one) that I will post more about some other time.

In order to update data, this project utilized a `Github Action` set to run every hour. The action involved:

1. Checking out the code
2. Setting up a Deno instance
3. Running the actual task

While none of this is difficult, it feels like a separate piece of code that you have to set up distinct from what you are building.

Below is what the [YAML for the Action](https://github.com/bdevos/theshook.one/blob/main/.github/workflows/update-feed-entries.yaml) looks like:

```yaml
name: Update entries

on:
  schedule:
    - cron: '0 * * * *'
  workflow_dispatch:

permissions:
  contents: read

jobs:
  update:
    runs-on: ubuntu-latest
    timeout-minutes: 3

    steps:
    - uses: actions/checkout@v4

    - uses: denoland/setup-deno@v1
      with:
        deno-version: v1.x
    
    - run: deno task updateEntries
      env:
        DENO_KV_URL: ${{ vars.DENO_KV_URL }}
        DENO_KV_ACCESS_TOKEN: ${{ secrets.DENO_KV_ACCESS_TOKEN }}

```

After configuring the above, I stumbled upon Deno's recent introduction of [`Deno.cron`](https://deno.land/api@v1.38.0?s=Deno.cron&unstable=). I had no idea what it was, but it sounded like something that would be similar. As it turns out, it is. 

By adding a `Deno.cron()` call in my the [`main.ts`](https://github.com/bdevos/theshook.one/blob/a87adb091bb9b0e7f5395c8a5e7531b9835a4f47/main.ts#L15) file of my project, [Deno Deploy](https://deno.com/deploy) will execute my update task based on the provided cron schedule. The beauty of this approach is that there's no need to provide Deno KV credentials, and the output is conveniently logged in the Deno Deploy logs.

The code required to do the same as the YAML above:

```ts
Deno.cron('Update entries', '0 * * * *', () => updateEntries())
```

Comparing the previous setup involving a Github Action with the one-line of TypeScript code, the latter is undeniably awesome.

P.S. I cannot vouch for the stability of this feature and have no idea what the resource limits are. While it has been solid in my experience, it's worth noting that the feature has only very recently been released and is `Unstable`. Therefore, use it at your own risk.
