---
title: Remap Caps Lock to Backspace in macOS
href: http://homeowmorphism.com/2017/05/27/Remap-CapsLock-Backspace-Sierra
pubDate: 2024-10-27 09:20
---

When I switched to Colemak, I also changed my backspace to be located on the caps lock position. When using hobbyist keyboards that I can program, it is simple to just program that key. But for my MacBook keyboard, I thought the only option was using Karabiner Elements. But running that with its virtual keyboard just to map one key feels like overkill.

Today I decided to switch from `Colemak` to `Colemak Mod-DH` 🫣, but in order to do that, I could no longer use the built-in macOS Input Source to override my keys. It turns out you can create your own Input Source, so I thought maybe I could also override the caps lock there. To my disappointment, this seems to not be the case.

But my googling wasn't for nothing; I came across [this](http://homeowmorphism.com/2017/05/27/Remap-CapsLock-Backspace-Sierra) post which shows a simple one-line command to change caps lock into backspace 🤯

```bash
hidutil property --set '{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0x700000039,"HIDKeyboardModifierMappingDst":0x70000002A}]}'
```
