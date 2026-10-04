# عدّة الحركة (`src/kit.tsx`) والهوية (`src/brand.tsx`)

كل الحركة بـ`useCurrentFrame` وليس CSS transitions. الأرقام فريمات عند 30fps.

| العنصر | الاستخدام |
|---|---|
| `useIn(start, dur=10)` | تقدّم 0→1 مع easing موحّد (`EASE`) |
| `usePop(start, damping)` | قفزة سريعة (spring) للشارات والأيقونات والبطاقات |
| `MaskLine` | سطر عنوان يصعد من خلف قناع (`delay`, `size`, `color`) |
| `Ring` | حلقة الباترن الرسمية تدور خلف المحتوى |
| `Floaters` | مكعبات الهوية تطفو للأعلى (حركة خلفية خفيفة) |
| `DiamondWipe` | انتقال ماسي، 16 فريم، القطع عند الفريم 8 (يوضع كـSequence عند `cut-8`) |
| `Burst` | انفجار مكعبات للتأكيد (`colors` اختيارية) |
| `Disc` | أيقونة رسمية داخل دائرة |
| `Pill` | كبسولة نص |
| `Clip` / `Pic` | فيديو / صورة بتكبير بطيء (ملء الشاشة أو داخل بطاقة) |
| `useBrandFonts()` | تحميل Somar Sans (يُستدعى مرة في `Root.tsx`) |

## التوقيت من الصوت
```ts
import { at, dur } from "./timing";      // مولّد من npm run voice
// scene رقم 3، العبارة رقم 1، متأخرة 4 فريم:
<Card delay={at(3, 1, 4)} />
```
مدة المشهد `dur(s)`. لا ترقّم الفريمات يدوياً.

## مشهد جديد: قالب سريع
انسخ `src/videos/demo/BrandDemo.tsx`. أضف المشهد في `index.ts` للفيديو (قائمة `scenes`) ثم في `Sequence` داخل المكوّن الرئيسي (انظر `edu/GuestNaEdu.tsx`).
