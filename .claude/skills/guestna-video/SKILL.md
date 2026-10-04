---
name: guestna-video
description: Use when producing, editing or reviewing any GuestNa (جستنا) motion video, reel or promo built with Remotion in this repo: briefs, scripts, Gulf voiceover, scene timing, brand visuals, AI images/video, rendering and QA. Trigger on "سو فيديو", "ريلز", "موشن", "فويس أوفر", "عدّل الفيديو", "render", or any change to src/videos.
---

# إنتاج فيديو جستنا

اقرأ `CLAUDE.md` أولاً (القواعد الثابتة). هذا السكل هو **خطوات التنفيذ**.

## المسار (بالترتيب)
1. **الموجز:** المنصة المستهدفة، المقاس (ريلز 9:16 افتراضياً)، المدة، الجمهور، المصدر الوحيد للمعلومات (موقع العميل). اقرأ الموقع بالمتصفح ولا تخترع محتوى.
2. **السكربت:** اكتب النص بلهجة خليجية خفيفة، مقسوماً إلى **فقرات** (تصير مشاهد) وكل فقرة إلى **عبارات** (تظهر عناصر على الشاشة بتوقيت الكلمة). ضعها في `src/videos/<name>/script.json` (انظر `edu/script.json` كمثال، فيه أيضاً نص TTS الكامل).
3. **الصوت:** تسجيل واحد متصل → `public/media/<name>/voice/take.mp3` → `npm run voice -- --video <name>`. راجع `references/voice-recipe.md`. يُنتج `voice-final.mp3` و`timing.ts`.
4. **الأصول:** حدّد لكل مشهد صورة/لقطة. استخدم الأصول المشتركة أولاً (`npm run assets:check`)، ثم ولّد أو جلب ما ينقص (Magnific: images_generate, video_generate, stock). سجّل المصدر في `assets.json`. صور بدل فيديو في القوائم.
5. **المشاهد:** مجلد `src/videos/<name>` (انسخ `npm run new:video`). استخدم `kit.tsx` و`brand.tsx` و`at(scene, phrase)` من `timing.ts`. راجع `references/motion-kit.md`.
6. **التحقق:** `npm run lint`، ثم إطارات `remotion still` من كل مشهد وفي منتصف الحركات. اتبع `references/review-checklist.md`.
7. **التصيير والتسليم:** `npx remotion render <Id> out/<name>.mp4 --codec=h264`، افحص المدة والصوت، أرسل الملف مع ملخص (ما تغيّر، التكلفة، ما لا تستطيع التحقق منه).

## تعديلات المستخدم المتكررة (كيف تتعامل)
- "الصوت فيه جملة مصرية/خاطئة" → أعد توليد التسجيل كاملاً بنفس الوصفة (ولّد تسجيلين وابنِ الاثنين)، ولا تقطّع جملاً منفصلة.
- "عنصر متأخر/مبكر عن الصوت" → عدّل `extra` في `at(s, k, extra)` أو أعد قياس التوقيت؛ لا تضع أرقاماً يدوية.
- "مسافات/حواف" → راجع هوامش الأمان في CLAUDE.md وصغّر الخط بدل الضغط.
- "غيّر اللقطات إلى سعودية" → ولّد بالذكاء الاصطناعي (صورة أو فيديو واحد) ووثّق المصدر.
