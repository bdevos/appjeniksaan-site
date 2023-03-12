---
title: Emoji Dataset
href: https://github.com/bdevos/emoji-dataset-json
pubDate: 2023-03-12 13:28
---

For a project, I was looking for a relatively small dataset of all emojis in a workable format. I was able to find a few examples online, but all of them had some issues. Therefore, I created my own [parser](https://github.com/bdevos/emoji-dataset-json) that goes through the [Unicode list](https://unicode.org/Public/emoji/latest/emoji-test.txt) and creates a JSON file of around 60KB with all emojis, including their names for searchability.

The format of the file is quite minimal due to the overhead of the JSON format and looks like this:

```json
{
    "g": "Smileys & Emotion", // Group Name
    "s": [
      {
        "s": "face-smiling", // Subgroup Name
        "e": [
          ["😀", "grinning face"],
          ["😃", "grinning face with big eyes"],
```

The parser bundles the base emoji with the skin tone variants which are included in the following format:

```json
["👋", "waving hand", ["👋🏻", "👋🏼", "👋🏽", "👋🏾", "👋🏿"]],
```

The Github project [contains the JSON output](https://raw.githubusercontent.com/bdevos/emoji-dataset-json/main/dataset/emoji.json) of the parser, ready for use.
