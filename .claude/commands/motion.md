---
description: Build or review the motion brief of a GuestNa video using the motion lexicon
argument-hint: <video-name>
---
Use the `guestna-video` skill (section "قاموس الحركة"). For the video $ARGUMENTS:
1. If `src/videos/<name>/motion-brief.json` does not exist, run `npm run motion -- brief <name>`.
2. Fill every scene with term ids from `motion/lexicon.json` (use `npm run motion -- lookup <word>` for any word you are unsure of). One hero motion per scene, at most one camera move, Arabic text with `text-mask-reveal` or `word-stagger` only.
3. Run `npm run motion -- lint <name>` and fix every error.
4. Show me a short table (scene, hero, support, emphasis, camera, transition) and wait for my approval before generating any image or video.
