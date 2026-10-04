---
description: Start a new GuestNa video (brief, script, voice, scenes) following the studio workflow
argument-hint: <video-name> <short brief>
---
Use the `guestna-video` skill. Start a new video called $ARGUMENTS.
1. Ask me only for what you cannot read from the client's website: platform/size, duration, language/dialect, required messages.
2. Scaffold with `npm run new:video -- <kebab-name>`.
3. Draft `src/videos/<name>/script.json` (sections and phrases, plus the full TTS text) and show it to me before spending any credits.
