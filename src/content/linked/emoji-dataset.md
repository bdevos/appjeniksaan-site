---
title: Emoji Dataset
href: https://github.com/bdevos/emoji-dataset-json
pubDate: 2023-03-12 13:28
---

For a project I was looking for a relatively small dataset of all emoji in a workable format. I could find a few examples online, but all had some issues. So I created my own [parser](https://github.com/bdevos/emoji-dataset-json) that goes through the [unicode list](https://unicode.org/Public/emoji/latest/emoji-test.txt) and creates a JSON file of around 60KB with all emoji including their name for searchability.

The format of the file is quite minimal because of the overhead of the JSON format and looks like this:

```json
{
    "g": "Smileys & Emotion",
    "s": [
      {
        "s": "face-smiling",
        "e": [
          ["😀", "grinning face"],
          ["😃", "grinning face with big eyes"],
```

The parser also bundles the base emoji with the skin tone variants which are included in the following format:

```json
["👋", "waving hand", ["👋🏻", "👋🏼", "👋🏽", "👋🏾", "👋🏿"]],
```

The Github project also [contains the JSON output](https://raw.githubusercontent.com/bdevos/emoji-dataset-json/main/dataset/emoji.json) of the parser, ready for use.
