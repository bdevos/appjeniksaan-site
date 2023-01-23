---
title: Last successful Github Action workflow
pubDate: 2023-01-23 06:01
layout: ../../layouts/Post.astro
---

For a project I wanted to determine when the last successful workflow run of the Github Action had happened. All the pieces where available on the internet, but because I had to do put some things toghether I thought this might help out someone in the future.

A couple or notes

1. You will need to give your workflow some additional permissions with: `permissions: read-all`
2. Change the `the-workflow-file.yaml` to the file name of your workflow
3. Replace `[...]` with

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    permissions: read-all

    steps:
      [...]

      - name: Last successful run
        id: last_success
        run: echo "LAST_SUCCESS=$(gh api -XGET repos/${{ github.repository_owner }}/${{ github.event.repository.name }}/actions/workflows/the-workflow-file.yaml/runs --jq '.workflow_runs[0].run_started_at' -F status=success -F per_page=1)" >> $GITHUB_OUTPUT
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Echo
        run: echo Last success: ${{ steps.last_success.outputs.LAST_SUCCESS }}
```
