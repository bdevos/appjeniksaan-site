---
title: Last successful Github Action workflow
pubDate: 2023-01-23 06:01
---

I recently worked on a project where I needed to determine the date and time of the last successful workflow run of a Github Action. After piecing together information from various sources, I decided to share my findings in case it may be helpful for others in the future.

You will have to replace the `last-success.yaml` to match your workflow file.

```yaml
name: Last success

on: push

jobs:
  build:
    runs-on: ubuntu-latest
    permissions: read-all

    steps:
      - uses: actions/checkout@v3

      - name: Last successful run
        id: last_success
        run: echo "LAST_SUCCESS=$(gh api -XGET repos/${{ github.repository_owner }}/${{ github.event.repository.name }}/actions/workflows/last-success.yaml/runs --jq '.workflow_runs[0].run_started_at' -F status=success -F per_page=1)" >> $GITHUB_OUTPUT
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Echo last success
        run: echo "Last successful run ${{ steps.last_success.outputs.LAST_SUCCESS }}"
```

The `permissions: read-all` might not be necessary, but I ran into the following error without them: `gh: Resource not accessible by integration (HTTP 403)`
