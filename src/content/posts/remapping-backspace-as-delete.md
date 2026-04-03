---
title: Remapping Backspace to Delete
pubDate: 2026-04-03 07:55
---

In 2024 I wrote [this short article](/linked/remap-caps-lock-to-backspace-in-mac-os/) about remapping the caps lock key to backspace. I still use this mapping and am really happy this works this way, no virtual keyboard software, just a simple remapping of this key at the OS level. But today I was typing on my Mac keyboard and wished I had a delete key. I have this key on my external keyboard, so why not map the original backspace key to act as forward delete?

To update the original to also include remapping the backspace key, I updated the script to become:

```bash
#!/bin/zsh
/usr/bin/hidutil property --set '{"UserKeyMapping":[
  {"HIDKeyboardModifierMappingSrc":0x700000039,"HIDKeyboardModifierMappingDst":0x70000002A},
  {"HIDKeyboardModifierMappingSrc":0x70000002A,"HIDKeyboardModifierMappingDst":0x70000004C}
]}'
```

This script combined with [my custom Colemak keyboard layout](https://github.com/bdevos/colemak-dh-keyboard-layout) is 👌
