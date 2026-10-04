# GuestNa Video Studio

نظام إنتاج فيديوهات الموشن لجستنا: محرك Remotion + هوية جستنا + صوت خليجي بتوقيت تلقائي + معرفة Claude (قواعد وسكل) داخل المستودع نفسه.

## كيف يعمل
```
guestna-video-studio/          ← هذا المستودع (Git)
  src/brand.tsx, src/kit.tsx   ← الهوية وعدّة الحركة
  src/videos/<name>/           ← كل فيديو: مشاهد + script.json + timing.ts + assets.json
  public/{fonts,logos,patterns,icons,pay}   ← أصول الهوية (داخل Git)
  public/media/                ← الوسائط الخارجية (خارج Git، مربوطة من مجلد الأصول)
  scripts/                     ← تثبيت، ربط الأصول، الصوت، إنشاء فيديو جديد (Node، ماك وويندوز)
  CLAUDE.md + .claude/         ← قواعد Claude والسكل والأوامر (تُحمَّل تلقائياً عند فتح المجلد)

guestna-video-assets/          ← مجلد الأصول المشترك (Drive، ولاحقاً مربوط مع كانفا). ليس في Git.
```

## التثبيت على جهاز جديد (حوالي 15 دقيقة)
المطلوب مسبقاً: **Git** و**Claude Code (تطبيق Claude Desktop)** مع تسجيل الدخول بحساب الفريق، وربط موصّل **Magnific** (يضيفه مدير الحساب مرة واحدة من إعدادات الموصّلات).

**ماك / لينكس**
```bash
git clone <رابط-المستودع> guestna-video-studio
cd guestna-video-studio
./setup.sh
```
**ويندوز** (PowerShell، لم يُختبر بعد على ويندوز، أبلغوا عن أي مشكلة)
```powershell
git clone <رابط-المستودع> guestna-video-studio
cd guestna-video-studio
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```
السكربت ينصّب Node 20+ إن لزم، والحزم، ويحمّل متصفح التصيير (حوالي 100 ميغا مرة واحدة)، ثم يتحقق من كل شيء.

**ربط مجلد الأصول المشترك** (مرة واحدة؛ المسار هو مجلد Drive المتزامن على جهازك):
```bash
npm run assets:link -- --from "/المسار/إلى/guestna-video-assets"
npm run assets:check
```
(أو ضع `GUESTNA_ASSETS=/المسار` في ملف `.env` محلي.) على ويندوز يعمل الربط بدون صلاحيات مدير؛ وإن فشل استخدم `--copy`.

اختبار سريع: `npm run render:demo` يصيّر فيديواً تجريبياً من 5 ثوان بدون أي أصول خارجية.

## الاستخدام اليومي
افتح مجلد المستودع في Claude Code. ستجد القواعد والسكل `guestna-video` محمّلة. ثم:
- `/new-video <اسم> <وصف>`: يبدأ فيديو جديداً (سكربت، صوت، مشاهد).
- `/voice <اسم>`: يبني الصوت النهائي والتوقيت من تسجيل TTS.
- `/render <المعرّف>`: فحص وتصيير وتسليم.
- `/check`: يتأكد أن الجهاز جاهز.
- معاينة وتعديل بصري: `npm run dev` (Remotion Studio).

## فيديو جديد
```bash
npm run new:video -- umrah-trips      # ينشئ src/videos/umrah-trips ويسجّله
```
ثم اطلب من Claude بناء المشاهد. ضع أصوله في `guestna-video-assets/umrah-trips/` وأعلنها في `src/videos/umrah-trips/assets.json`.

## الأصول والكانفا
الأصول (لقطات، صور، موسيقى، تسجيلات) **لا تدخل Git**. كل فيديو يعلن ما يحتاجه في `assets.json` (المسار + الوصف + المصدر/الرخصة)، و`npm run assets:check` يخبرك بالناقص. عند ربط كانفا سيُستبدل مجلد Drive بمصدر كانفا دون تغيير بنية الأكواد (نفس مسارات `public/media`).

## الصيانة (للمسؤول عن المستودع)
- التحسينات (مكوّنات حركة، قواعد، إصلاحات) عبر Pull Request. بعد الدمج يكفي `git pull` عند الجميع.
- ترقية Remotion: `npm run upgrade` ثم `npm run lint` و`npm run render:demo`.
- لا تضع مفاتيح أو كلمات مرور في المستودع. Magnific وDrive عبر الموصّلات.

## استكشاف الأخطاء
| المشكلة | الحل |
|---|---|
| `public/media is missing` | `npm run assets:link -- --from <المسار>` |
| `Alignment failed` عند `npm run voice` | عدد مقاطع الكلام لا يطابق العبارات: ولّد تسجيلاً جديداً بنفس الوصفة (انظر `references/voice-recipe.md`) |
| الخط لا يظهر | تأكد من `public/fonts` ومن `useBrandFonts()` في `Root.tsx` |
| أول تصيير بطيء | يحمّل المتصفح مرة واحدة؛ التالي أسرع |
