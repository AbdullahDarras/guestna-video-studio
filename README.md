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

guestna-video-assets/          ← مستودع الأصول المشترك (مستودع GitHub خاص منفصل، يُسحب تلقائياً بجانب هذا المجلد)
```

معرفة Remotion (الأفضل ممارسات الرسمية) **مضمّنة داخل المستودع** في `.claude/skills/remotion-*`، فلا حاجة لتنصيب إضافة منفصلة ولا مشاكل SSH. تحديثها: `npm run skills:remotion`.

## التثبيت لأعضاء الفريق (بدون حساب GitHub): أمر واحد
مدير المشروع يعطيك **كود وصول** (مفتاح قراءة فقط). افتح Terminal (ماك) والصق السطر التالي بعد استبدال `الكود` بالكود الذي استلمته:

```bash
T=الكود; curl -fsSL -H "Authorization: token $T" https://raw.githubusercontent.com/AbdullahDarras/guestna-video-studio/main/install.sh | GUESTNA_TOKEN=$T bash
```
**ويندوز** (PowerShell، لم يُختبر بعد):
```powershell
$T="الكود"; iwr -UseBasicParsing -Headers @{Authorization="token $T"} https://raw.githubusercontent.com/AbdullahDarras/guestna-video-studio/main/install.ps1 | iex
```
المثبّت ينزّل المشروع والأصول إلى `~/GuestNa`، وينصّب Node والحزم ومتصفح التصيير (حوالي 15 دقيقة مرة واحدة)، ثم يطبع المسار. **افتح مجلد `guestna-video-studio` في Claude Code** واطلب الفيديو. الكود يُحفظ على جهازك فقط ويُستخدم لهذين المستودعين فقط. لتحديث النظام لاحقاً أعد تشغيل نفس الأمر. إن انتهت صلاحية الكود اطلب كوداً جديداً وأعد الأمر.

المطلوب أيضاً: **Claude Code (تطبيق Claude Desktop)** بحساب الفريق، وموصّل **Magnific** مربوط (يضيفه مدير الحساب).

## للمدير: إنشاء كود الوصول
GitHub، ثم Settings، ثم Developer settings، ثم Fine-grained tokens، ثم Generate new token: Repository access = Only select repositories (المستودعان `guestna-video-studio` و`guestna-video-assets`)، وPermissions = Contents: **Read-only**، والصلاحية 90 يوماً. أرسل الكود للفريق بقناة خاصة. للإلغاء احذف المفتاح من نفس الصفحة. لا تضع الكود في أي ملف داخل المستودع.

## التثبيت اليدوي (لمن عنده حساب GitHub وصلاحية)
المطلوب مسبقاً: **Git** مع تسجيل دخول لـGitHub، و**Claude Code (تطبيق Claude Desktop)** بحساب الفريق، وربط موصّل **Magnific** (يضيفه مدير الحساب مرة واحدة)، وأن يكون عندك **صلاحية** على المستودعين الخاصين `guestna-video-studio` و`guestna-video-assets`.

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
السكربت ينصّب Node 20+ إن لزم، والحزم، ويحمّل متصفح التصيير (حوالي 100 ميغا مرة واحدة)، ثم **يسحب مستودع الأصول تلقائياً** إلى `../guestna-video-assets` ويربطه بـ`public/media`، ويتحقق من كل شيء.

- تحديث الأصول لاحقاً: `npm run assets:update`.
- مصدر آخر للأصول (Drive أو تصدير كانفا): `npm run assets:link -- --from "/المسار"` (أضف `--copy` على ويندوز إن فشل الربط).
- العنوان والمجلد الافتراضيان في `assets.config.json`.

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
- ترقية Remotion: `npm run upgrade` ثم `npm run skills:remotion -- --latest` ثم `npm run lint` و`npm run render:demo`.
- لا تضع مفاتيح أو كلمات مرور في المستودع. Magnific وDrive عبر الموصّلات.

## استكشاف الأخطاء
| المشكلة | الحل |
|---|---|
| `public/media is missing` أو فشل سحب الأصول | تأكد من صلاحية مستودع الأصول وتسجيل دخول GitHub، ثم `npm run assets:link` |
| `Alignment failed` عند `npm run voice` | عدد مقاطع الكلام لا يطابق العبارات: ولّد تسجيلاً جديداً بنفس الوصفة (انظر `references/voice-recipe.md`) |
| الخط لا يظهر | تأكد من `public/fonts` ومن `useBrandFonts()` في `Root.tsx` |
| أول تصيير بطيء | يحمّل المتصفح مرة واحدة؛ التالي أسرع |
