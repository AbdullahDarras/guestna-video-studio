# مفردات الحركة (مولَّد من `motion/lexicon.json`، لا تعدّله يدوياً)

> المصطلحات مبنية على [قاموس التحريك](https://motioname.com). الصياغة والربط بعدّتنا خاص بنا. للبحث السريع: `npm run motion -- lookup <كلمة>`.

## مدد الحركة المقترحة (30fps)
| النوع | ms | فريم |
|---|---|---|
| تفاعل دقيق (ضغطة، هوفر) | 100 إلى 200 | 3 إلى 6 |
| عنصر صغير (تلميح، شارة) | 150 إلى 250 | 5 إلى 8 |
| عنصر متوسط (بطاقة، لوحة) | 250 إلى 400 | 8 إلى 12 |
| انتقال بين مشاهد كاملة | 350 إلى 600 | 11 إلى 18 |

قاعدة الريلز: الدخول ease-out أو expo-out، الخروج ease-in وأسرع من الدخول بنحو الربع، الحركة داخل الشاشة ease-in-out، التفاعل بالسحب spring.

## منحنيات التسارع

| id | المصطلح | المعنى | عندنا في Remotion | برومبت |
|---|---|---|---|---|
| `linear` | Linear<br>خطي | سرعة ثابتة، تبدو آلية. فقط للدوران والتمرير المستمر وأشرطة التقدم. | interpolate بدون easing. الحلقة الدوّارة Ring تستخدمه. | `constant speed` |
| `ease-in` | Ease In<br>تسارع | تبدأ بطيئة وتنتهي سريعة. للعناصر الخارجة من الكادر. | Easing.in(Easing.cubic) أو bezier(.55,0,1,.45) | `ease-in, accelerating out` |
| `ease-out` | Ease Out<br>تباطؤ | تبدأ سريعة وتهدأ في النهاية. الأنسب للعناصر الداخلة. | Easing.out(Easing.cubic) أو bezier(0,.55,.45,1) | `ease-out, settling softly` |
| `ease-in-out` | Ease In-Out<br>تسارع ثم تباطؤ | بطيئة في الطرفين سريعة في الوسط. لحركة عنصر من مكان لمكان داخل الكادر. | Easing.inOut(Easing.cubic) أو bezier(.65,0,.35,1) | `smooth ease-in-out` |
| `expo-out` | Expo Out<br>تباطؤ حاد | انطلاقة سريعة جداً ثم استقرار طويل ناعم. إحساس فاخر. هذا هو EASE الافتراضي في هويتنا. | EASE في brand.tsx = bezier(.16,1,.3,1). useIn و MaskLine يستخدمانه. | `expo-out easing, fast start, long soft settle` |
| `back-out` | Back Out / Overshoot<br>تجاوز ثم رجوع | يتجاوز مكانه قليلاً ثم يرجع. حيوية ومرح للأيقونات والبطاقات. | usePop(start, damping) أو bezier(.34,1.56,.64,1) | `pop-in with slight overshoot` |
| `back-in` | Anticipation Ease<br>تمهيد عكسي | يرجع للخلف قليلاً قبل أن ينطلق. يجهّز العين. | bezier(.36,0,.66,-.56) | `pull back slightly before moving` |
| `spring` | Spring<br>زنبرك | حركة فيزيائية بصلابة وتخميد بدل مدة. الأنسب للسحب والإيماءات والتفاعل. | spring({ fps, frame, config: { stiffness, damping } }) | `springy, physical motion` |
| `bounce` | Bounce<br>ارتداد | يرتطم ويرتد كالكرة. بحذر وللمرح فقط. | Easing.bounce | `bouncing ease-out` |
| `steps` | Steps<br>خطوات متقطعة | قفزات ثابتة بلا نعومة: سبرايت وعدادات. | Math.floor(frame / n) لتقطيع الزمن | `stepped, frame-by-frame` |

## مبادئ التحريك الأساسية

| id | المصطلح | المعنى | عندنا في Remotion | برومبت |
|---|---|---|---|---|
| `squash-stretch` | Squash & Stretch<br>ضغط وتمدد | يتمدد مع السرعة وينضغط عند الاصطدام مع ثبات الحجم. وزن ومرونة. | scaleX/scaleY معاكسان حول 1 مع spring | `squash on impact, stretch in the air` |
| `anticipation` | Anticipation<br>التمهيد | حركة صغيرة معاكسة قبل الحركة الرئيسية. | keyframe عكسي 4 إلى 6 فريم قبل الدخول | `crouch in anticipation, then leap` |
| `staging` | Staging<br>التقديم | توجيه العين للمهم بالضوء أو الحجم أو الحركة وتهدئة الباقي. | خفّض opacity للخلفية وكبّر العنصر البطل | `spotlight the hero, dim the surroundings` |
| `pose-to-pose` | Pose to Pose<br>وضعيات مفتاحية | حدد الوضعيات الأساسية ثم املأ ما بينها. | interpolate بين مفاتيح قليلة | `keyframe animation between key poses` |
| `follow-through` | Follow Through & Overlap<br>استمرار وتداخل | الأجزاء المرنة تكمل حركتها بعد توقف الجسم ولكل جزء تأخير. | تأخير spring لكل طبقة فرعية 2 إلى 4 فريم | `follow-through and overlapping action` |
| `slow-in-out` | Slow In & Slow Out<br>تباطؤ الطرفين | الحركة تبطؤ عند البداية والنهاية مثل الواقع. في After Effects اسمها Easy Ease. | أي easing غير linear | `smooth slow-in and slow-out` |
| `arcs` | Arcs<br>الأقواس | الحركة الطبيعية تسير في أقواس لا خطوط مستقيمة. | اجمع x وy بمنحنيين مختلفين التوقيت | `moves along a smooth arc path` |
| `secondary-action` | Secondary Action<br>حركة ثانوية | حركة صغيرة تدعم الأساسية دون أن تسرق الانتباه. | Floaters أو نبضة خفيفة خلف العنصر | `small supporting secondary motion` |
| `timing-weight` | Timing<br>التوقيت | عدد الكادرات يحدد الوزن: الثقيل بطيء، الخفيف سريع. | غيّر frames في useIn أو damping في usePop | `heavy and slow vs light and fast` |
| `exaggeration` | Exaggeration<br>مبالغة | تضخيم الحركة عن الواقع لتصبح أوضح. | زد scale الدخول أو overshoot قليلاً | `exaggerated, expressive motion` |
| `solid-drawing` | Solid Drawing<br>رسم مجسّم | التعامل مع الأشكال ككتل لها حجم حتى في الرسم المسطح. | rotateX/rotateY مع perspective | `consistent volume and perspective` |
| `appeal` | Appeal<br>جاذبية | شكل بسيط وتعبير واضح وسهل القراءة. | أشكال الهوية فقط، بلا تفاصيل زائدة | `charming, clear, readable design` |

## تحريك النصوص

| id | المصطلح | المعنى | عندنا في Remotion | برومبت |
|---|---|---|---|---|
| `kinetic-type` | Kinetic Typography<br>تايبوجرافي حركي | كلمات تظهر وتتحرك على إيقاع الكلام. أساس إعلانات الريلز. | عنصر لكل عبارة بـ at(scene, phrase) | `bold words pop in sync with the beat` |
| `text-mask-reveal` | Text Mask Reveal<br>كشف النص بالقناع | النص يصعد من خلف خط مخفي. أنيق ونظيف. | MaskLine (delay, size, color) | `each line slides up from behind an invisible mask` |
| `typewriter` | Typewriter<br>آلة كاتبة | حروف تظهر واحداً بعد الآخر مع مؤشر يومض. مناسب للانجليزي التقني فقط. | slice على النص حسب الفريم. لا تستخدمه للعربي (يكسر الاتصال). | `typewriter text with blinking cursor` |
| `letter-stagger` | Letter Stagger<br>تتابع الحروف | كل حرف يدخل بتأخير. ممنوع في العربية لأنه يقطع اتصال الحروف. | للانجليزي فقط | `letter-by-letter stagger` |
| `word-stagger` | Word Stagger<br>تتابع الكلمات | كل كلمة تدخل بتأخير بسيط. هذا بديلنا للعربية. | ملفوف في كلمات، delay = i * 3 فريم. مع MaskLine لكل سطر. | `word-by-word stagger` |
| `text-scramble` | Text Scramble<br>فك التشفير | حروف عشوائية تستقر على الكلمة. طابع تقني. | للانجليزي والأرقام فقط | `random characters resolve into the title` |
| `lower-third` | Lower Third<br>الشريط السفلي | شريط باسم وصفة المتحدث أسفل الشاشة. | Pill + MaskLine داخل هوامش الأمان | `clean lower third, accent bar then name reveal` |

## أشكال ومسارات وعناصر

| id | المصطلح | المعنى | عندنا في Remotion | برومبت |
|---|---|---|---|---|
| `line-draw` | Trim Paths / Line Draw<br>رسم الخط | خط يُرسم من بدايته لنهايته. | strokeDasharray و strokeDashoffset مع interpolate | `single stroke draws itself on` |
| `swoosh` | Swoosh Underline<br>خط مرسوم متموّج | بديل أنيق للخط الرفيع تحت العنوان: منحنى يرسم نفسه وينتهي بمعين صغير. الخطوط الجامدة تحت العناوين غير مقبولة عندنا. | Swoosh (at, width, color) |  |
| `shape-morph` | Shape Morph<br>تحوّل الشكل | شكل يتحول لشكل آخر بسلاسة. | interpolatePath من @remotion/paths أو تبديل opacity بين شكلين | `smooth shape morphing` |
| `motion-path` | Motion Path<br>مسار الحركة | عنصر يتبع مساراً منحنياً ويدور مع اتجاهه. | getPointAtLength من @remotion/paths (مثال: الباص في LogisticsScene) | `follows a curved motion path` |
| `map-route` | Map Route<br>مسار على الخريطة | خط يُرسم بين نقطتين مع علامة تتحرك عليه. للسفر والرحلات. | line-draw + motion-path. مناسب جداً لرحلات جستنا | `route line draws from pin A to pin B with a moving marker` |
| `radial-repeater` | Repeater / Radial<br>تكرار دائري | نسخ من شكل موزعة حول مركز. | map على مصفوفة مع rotate = i * 360 / n (باترن الهوية) | `radial repeater pulsing in sequence` |
| `stagger` | Stagger / Offset<br>تتابع زمني | مجموعة عناصر بالحركة نفسها وتأخير متدرج، فتتكون موجة. | delay = at(...) + i * 3 إلى 6 فريم | `staggered offsets creating a wave` |
| `seamless-loop` | Seamless Loop<br>حلقة متصلة | حركة تنتهي حيث بدأت. | دوال دورية: Math.sin(frame / period) | `perfect seamless loop` |
| `wiggle` | Wiggle<br>اهتزاز عشوائي | اهتزاز مستمر في الموضع أو الدوران. | noise من @remotion/noise | `random jittery wiggle` |
| `echo-trails` | Echo / Trails<br>أثر | نسخ باهتة تتبع العنصر وتوضح مساره وسرعته. | ارسم نسخاً بتأخير frame - k وopacity متناقص | `fading echo trails` |
| `isometric` | Isometric<br>أيزومتريك | رسم ثلاثي الأبعاد بزوايا ثابتة بلا منظور. شرح المنتجات. | transform: rotateX(60deg) rotateZ(45deg) | `isometric 3D blocks dropping into place` |
| `flip-3d` | 3D Flip<br>قلب ثلاثي | بطاقة تنقلب لتكشف وجهها الآخر. | rotateY مع backfaceVisibility hidden | `card flips 180 degrees in 3D` |
| `walk-cycle` | Walk Cycle<br>دورة مشي | مشي يتكرر في مكانه والخلفية تتحرك. | Lottie أو سبرايت | `looping walk cycle in profile` |
| `counter` | Count-up / Data Animation<br>عدّاد وإنفوجرافيك | رقم يعد من الصفر وأعمدة تنمو بالتتابع. لا نضع أرقاماً من خارج موقع العميل. | Math.round(interpolate(frame, [a,b],[0,N])) في NumbersScene | `bar chart grows with staggered timing while a counter counts up` |

## مؤثرات

| id | المصطلح | المعنى | عندنا في Remotion | برومبت |
|---|---|---|---|---|
| `particles` | Particles / Burst<br>جسيمات وانفجار | نقاط تنفجر من مركز وتتلاشى. للتأكيد والاحتفال. | Burst (at, x, y, colors) | `particle burst exploding outward` |
| `glitch` | Glitch<br>جليتش | تشويش رقمي. طابع تقني لا يناسب هوية جستنا الدافئة، تجنّبه. | غير مستخدم | `RGB channel split glitch` |
| `logo-reveal` | Logo Reveal<br>كشف الشعار | الشعار يظهر بحركة مميزة. الأخير في الفيديو بخلفية بيضاء وألوانه الأصلية. | usePop على الشعار + Ring خلفه (EduOutroScene) | `minimal logo reveal, mark draws on then wordmark slides out` |
| `pulse-rings` | Pulse Rings<br>موجات نبض | حلقات تتسع وتتلاشى. موقع أو بث أو إشارة. | حلقات scale من 0.4 إلى 1.6 مع opacity ينقص | `radar pulse rings expanding` |
| `light-sweep` | Shine / Light Sweep<br>لمعة ضوء | شريط ضوء يعبر العنصر. فخامة أو لفت نظر لزر. | تدرج linear-gradient يتحرك بـ translateX داخل قناع | `glossy light sweep across the badge` |
| `parallax` | Parallax<br>بارالاكس | القريب يتحرك أسرع من البعيد. أساس الإحساس بالعمق. | طبقات بسرعات مختلفة، أو Pic بتكبير بطيء مختلف | `strong parallax between foreground and background` |
| `parallax-25d` | 2.5D Parallax<br>بارالاكس 2.5D | صورة مسطحة تُقسم لطبقات وكاميرا تتحرك بينها. | طبقات PNG بعد images_remove_background ثم parallax | `flat illustration split into layers with a slow camera move` |
| `ken-burns` | Slow Push (Ken Burns)<br>تكبير بطيء للصورة | تكبير أو سحب بطيء جداً على صورة ثابتة يعطي حياة. هو ما تفعله Pic وClip. | Pic / Clip (تكبير بطيء مدمج) | `slow push in on a still image` |

## انتقالات ومونتاج

| id | المصطلح | المعنى | عندنا في Remotion | برومبت |
|---|---|---|---|---|
| `hard-cut` | Hard Cut<br>قطع مباشر | انتقال فوري. الأكثر استخداماً. | Sequence تلو Sequence بلا تأثير | `hard cut` |
| `jump-cut` | Jump Cut<br>قطع قافز | قطع داخل اللقطة نفسها. إيقاع سريع. | Sequence يتخطى frames من الـ Clip عبر startFrom | `jump cuts, fast rhythm` |
| `match-cut` | Match Cut<br>قطع متطابق | قطع بين شكلين متشابهين في مكانهما بالكادر. | ضع الشكل المشترك في نفس الإحداثيات في المشهدين | `match cut, same position in frame` |
| `j-l-cut` | J/L Cut<br>قطع الصوت المتداخل | صوت المشهد التالي يبدأ قبل صورته أو يستمر بعدها. | هذا ما نفعله: الصوت قبل الـ DiamondWipe بفريمات (cutAhead) | `audio leads the cut` |
| `cross-dissolve` | Cross Dissolve<br>مزج تدريجي | لقطة تذوب في أخرى. مرور وقت أو ذكرى. | opacity لمشهدين متراكبين | `slow cross dissolve` |
| `fade-black` | Fade to Black<br>تلاشي للأسود | نهاية فصل. لا نستخدمه، نختم بمشهد أبيض. | AbsoluteFill أسود opacity 0→1 | `fade to black` |
| `dip-white` | Dip to White<br>وميض أبيض | وميض أبيض سريع. صدمة أو حماس. | AbsoluteFill أبيض opacity ينبض 6 فريم | `quick white flash transition` |
| `wipe` | Wipe<br>مسح | لقطة جديدة تمسح القديمة بخط يتحرك. | clipPath: inset() متحرك | `wipe transition` |
| `iris` | Iris<br>دائرة | دائرة تنفتح لتكشف اللقطة التالية. | Shell enter = iris مع origin (حلقة برتقالية على الحافة) | `iris-in transition` |
| `push-slide` | Push / Slide<br>دفع | اللقطة الجديدة تدفع القديمة. في العربية تدخل الجديدة من اليسار. | Shell enter/exit = rise (تصعد الجديدة فوق القديمة) | `push transition, new scene pushes the old one out` |
| `whip-transition` | Whip Transition<br>انتقال خاطف | حركة سريعة جداً بضبابية تربط لقطتين. شائع في الريلز. | Shell enter/exit = whip (تمرير جانبي مع ضبابية) | `whip pan transition with heavy motion blur` |
| `zoom-transition` | Zoom Transition<br>انتقال بالزووم | زووم سريع ينتهي بدخول اللقطة التالية. | Shell enter/exit = zoom (src/transitions.tsx) | `fast zoom-through transition` |
| `spin-transition` | Spin Transition<br>انتقال بالدوران | الكادر يدور ثم تظهر اللقطة التالية وهي تدور. | rotate مع scale | `spin transition` |
| `light-leak` | Light Leak<br>تسريب ضوء | وهج دافئ يعبر الكادر عند القطع. طابع فيلم. | تدرج برتقالي (desert) متحرك فوق القطع | `warm light leak transition` |
| `morph-transition` | Morph Transition<br>تحول بين لقطتين | عنصر يتحول لعنصر في اللقطة التالية. أقوى ما يصنعه الذكاء الاصطناعي عبر الكادر الأول والأخير. | في Remotion: عنصر مشترك بنفس المكان. أو ولّد بـ start/end frame | `seamless morph transition` |
| `shape-transition` | Shape Transition<br>انتقال بالأشكال | أشكال ملونة تتسع وتغطي الشاشة ثم تنكشف. انتقال الهوية عندنا هو الماسة. | DiamondWipe (انتقال الهوية الصلب). للفيديوهات الجديدة فضّل Shell الأنعم | `colored shapes expand to wipe the screen` |

## حركات الكاميرا

| id | المصطلح | المعنى | عندنا في Remotion | برومبت |
|---|---|---|---|---|
| `pan` | Pan<br>بان | الكاميرا ثابتة وتدور أفقياً. كل الكادر ينزلق بنفس السرعة بلا عمق. | translateX على المشهد كله | `slow pan from left to right, camera fixed on a tripod` |
| `tilt` | Tilt<br>تيلت | الكاميرا في مكانها وتميل لأعلى أو لأسفل. | translateY على المشهد كله | `camera tilts up slowly to reveal the subject` |
| `zoom` | Zoom<br>زووم | تغيير البعد البؤري، الصورة كلها تكبر بنسبة واحدة فتبدو مسطحة. | scale على المشهد كله (Pic) | `slow optical zoom in, the camera does not move` |
| `dolly` | Dolly In / Out<br>دوللي | الكاميرا نفسها تتقدم أو ترجع. القريب يكبر أسرع من البعيد فيظهر عمق حقيقي. | طبقات تكبر بنسب مختلفة (parallax + scale) | `slow dolly in, the camera physically moves forward, natural parallax` |
| `truck` | Truck / Crab<br>تراك جانبي | الكاميرا تنتقل بالعرض موازية للمشهد مع بارالاكس واضح. | طبقات تنزلق بسرعات مختلفة | `camera trucks left alongside the subject, strong parallax` |
| `pedestal` | Pedestal<br>بيدستال | الكاميرا ترتفع أو تنخفض رأسياً وهي مستوية. | translateY بسرعات مختلفة للطبقات | `camera pedestals up smoothly, staying level` |
| `orbit` | Arc / Orbit<br>دوران حول الهدف | الكاميرا تدور في قوس والهدف يبقى بالمنتصف. | غير مناسب للـ 2D. ولّده بالذكاء الاصطناعي | `camera orbits around the subject in a smooth arc, subject stays centered` |
| `crane` | Crane / Jib<br>كرين | ترتفع أو تهبط على ذراع، غالباً للافتتاح أو الختام. | translateY مع scale خفيف | `crane shot rising up and away, revealing the wide landscape` |
| `dolly-zoom` | Dolly Zoom<br>دوللي زووم | ترجع وتزوّم للأمام معاً: الشخص ثابت والخلفية تتمدد. صدمة. لا يناسب أجواءنا. | غير مستخدم | `dolly zoom vertigo effect` |
| `roll` | Roll<br>رول | الكاميرا تدور حول محورها فيدور الأفق. ارتباك أو حلم. | rotate على المشهد | `camera slowly rolls, horizon rotating` |
| `whip-pan` | Whip Pan<br>بان خاطف | بان سريع جداً بضبابية حركة. انتقال أو رد فعل مفاجئ. | translateX سريع + blur | `fast whip pan with heavy motion blur` |
| `crash-zoom` | Crash Zoom<br>كراش زووم | زووم خاطف على تفصيلة. كوميديا أو إدراك مفاجئ. | scale من 1 إلى 1.4 خلال 4 فريم | `sudden crash zoom into the subject` |
| `tracking` | Tracking Shot<br>تتبع | الكاميرا تمشي مع الشخص فيبقى ثابتاً تقريباً والخلفية تجري. | الخلفية تنزلق والعنصر ثابت | `tracking shot following the subject at the same speed` |
| `pullback-reveal` | Pull-Back Reveal<br>كشف بالرجوع | تبدأ على تفصيلة ثم ترجع لتكشف المكان. تحكي قصة بلقطة واحدة. | scale من 1.6 إلى 1 على Pic | `starts on an extreme close-up, slowly pulls back to reveal the place` |
| `fpv-drone` | FPV Drone<br>درون سريع | طيران سريع بين العناصر. ديناميكي ومغامر، يناسب الرحلات. | ولّده بالذكاء الاصطناعي | `FPV drone shot flying fast and low through the scene, immersive fly-through` |
| `drone-reveal` | Drone Rise<br>صعود جوي كاشف | الدرون يرتفع من خلف عنصر قريب ليكشف المنظر. ممتاز لوجهات سياحية. | ولّده بالذكاء الاصطناعي | `aerial drone shot rising up from behind the foreground to reveal the landscape` |
| `spiral` | Spiral<br>سبايرال | تتقدم وتدور حول محورها. دخول درامي. | scale مع rotate | `camera spirals in toward the subject` |
| `turntable` | Turntable / 360<br>دوران 360 | المنتج يدور على قاعدة. فيديوهات المنتجات. | rotateY مستمر | `product turntable, rotating 360 degrees, static camera` |
| `static` | Static / Locked-off<br>كاميرا ثابتة | حامل ثلاثي بلا حركة. مفيدة جداً لمنع حركة كاميرا عشوائية في أدوات التوليد. | لا حركة على المشهد (فقط العناصر) | `static locked-off shot on a tripod, no camera movement` |
| `handheld` | Handheld<br>كاميرا محمولة | اهتزاز طبيعي خفيف. واقعية وأسلوب وثائقي. | noise خفيف على translate | `handheld camera with subtle natural shake, documentary style` |
| `gimbal` | Steadicam / Gimbal<br>حركة ناعمة طافية | تتحرك بحرية ونعومة كأنها تطفو. | translate ناعم بـ ease-in-out | `smooth steadicam shot gliding forward, floating gimbal movement` |

## أحجام اللقطات والزوايا

| id | المصطلح | المعنى | عندنا في Remotion | برومبت |
|---|---|---|---|---|
| `ews` | Extreme Wide<br>واسعة جداً | المكان هو البطل والشخص صغير. لتعريف المكان. | Clip/Pic بملء الشاشة | `extreme wide shot, tiny figure in a vast landscape, establishing shot` |
| `ws` | Wide<br>واسعة | الشخص كاملاً مع مساحة كبيرة حوله. |  | `wide shot, full body with plenty of surrounding space` |
| `fs` | Full Shot<br>كاملة | الشخص من الرأس للقدم. لغة الجسد. |  | `full shot, head to toe filling the frame` |
| `mws` | Cowboy<br>متوسطة واسعة | من منتصف الفخذ لأعلى. |  | `medium wide cowboy shot from mid-thigh up` |
| `ms` | Medium<br>متوسطة | من الخصر لأعلى. أشهر لقطة للحوار. |  | `medium shot from the waist up` |
| `mcu` | Medium Close-Up<br>متوسطة قريبة | من الصدر لأعلى. تعبير الوجه مع قليل من السياق. |  | `medium close-up from the chest up` |
| `cu` | Close-Up<br>قريبة | الوجه يملأ الكادر. المشاعر وردود الفعل. |  | `close-up of the face filling the frame` |
| `ecu` | Extreme Close-Up<br>قريبة جداً | تفصيلة واحدة: عين أو يد على زر. |  | `extreme close-up, macro detail` |
| `eye-level` | Eye Level<br>مستوى العين | زاوية محايدة طبيعية. |  | `eye-level shot, neutral perspective` |
| `high-angle` | High Angle<br>زاوية عالية | من أعلى لأسفل، يبدو الشخص أصغر. |  | `high angle shot looking down` |
| `low-angle` | Low Angle<br>زاوية منخفضة | من أسفل لأعلى، يبدو قوياً وبطولياً. |  | `low angle shot looking up, heroic` |
| `overhead` | Bird's-Eye<br>عين الطائر | من فوق عمودياً. تكوين جرافيكي كالخريطة. |  | `overhead bird's-eye view, camera looking straight down` |
| `aerial` | Aerial<br>جوية | من درون أو طائرة. تُظهر الحجم الحقيقي للمكان. |  | `aerial shot from high altitude` |
| `ots` | Over-the-Shoulder<br>من فوق الكتف | خلف كتف شخص تنظر لمن أمامه. للحوار. |  | `over-the-shoulder shot` |
| `pov` | POV<br>عين الشخصية | المشاهد يرى ما تراه الشخصية. انغماس. |  | `first-person POV shot` |

## التكوين

| id | المصطلح | المعنى | عندنا في Remotion | برومبت |
|---|---|---|---|---|
| `rule-of-thirds` | Rule of Thirds<br>قاعدة الأثلاث | ضع الموضوع على أحد تقاطعات الشبكة 3×3. أكثر حيوية من المنتصف. |  | `subject placed on the left third, rule of thirds` |
| `center-symmetry` | Center / Symmetry<br>مركز وتماثل | الموضوع بالمنتصف. قوي ومباشر للمنتجات والشعار. | left:0, right:0 مع justify center | `perfectly symmetrical centered composition` |
| `negative-space` | Negative Space<br>مساحة فارغة | مساحة واسعة حول موضوع صغير. تترك مكاناً للنص. | اترك الثلث العلوي والسفلي لعناوين الريلز | `large negative space, room for text` |
| `leading-lines` | Leading Lines<br>خطوط موجهة | خطوط في المشهد تقود العين نحو الموضوع. |  | `leading lines guide the eye toward the subject` |
| `lead-room` | Headroom & Lead Room<br>مساحة الرأس والنظر | مساحة أكبر في اتجاه نظر الشخص أو حركته. |  | `comfortable headroom, extra lead room` |
| `frame-in-frame` | Frame Within a Frame<br>إطار داخل إطار | باب أو نافذة تؤطر الموضوع. |  | `subject framed through an archway` |

## حركة الشخصية والبيئة

| id | المصطلح | المعنى | عندنا في Remotion | برومبت |
|---|---|---|---|---|
| `walk` | Walk<br>المشي | حدّد الاتجاه والسرعة. |  | `walks slowly from left to right across the frame, natural gait` |
| `run` | Run<br>الجري | حركة سريعة، أضف تفاصيل الجسم. |  | `sprints toward the camera, arms pumping` |
| `look-camera` | Look at Camera<br>التفات للكاميرا | لحظة قوية في الإعلانات والافتتاحيات. |  | `slowly turns her head and looks directly into the camera, subtle smile` |
| `cloth-wind` | Hair & Cloth in Wind<br>شعر وقماش بالهواء | حركة ثانوية تعطي حياة لشخص واقف. من أنجح الحركات في الأدوات. |  | `hair and clothes flutter gently in the wind as they stand still` |
| `gesture` | Gesture / Wave<br>إيماءة | حركة يد واضحة. اجعلها بسيطة وبطيئة لتقليل مشاكل الأصابع. |  | `raises a hand and waves at the camera in a friendly way` |
| `idle` | Idle / Breathing<br>سكون حي | تنفس ورمش وتمايل خفيف. يمنع الإحساس بصورة جامدة. |  | `stands still, breathing gently, blinking naturally, subtle idle movement` |
| `wind-trees` | Wind in Trees<br>رياح في الأشجار | أشجار وعشب وسحب تتحرك. |  | `trees and tall grass sway in a breeze, clouds moving` |
| `water` | Water & Ripples<br>ماء وتموجات | سطح ماء يتموج ويلمع. جميلة وسهلة. |  | `gentle ripples on the water, sparkling sun reflections` |
| `dust-motes` | Dust & Particles<br>غبار وجزيئات | ذرات تطفو في شعاع ضوء. عمق وإحساس سينمائي. | Floaters | `dust particles floating in a beam of sunlight` |
| `sand-desert` | Sand & Desert Wind<br>رمال وهواء صحراوي | رمال تنساب مع الريح. بيئة سعودية. إضافة خاصة بنا. |  | `fine sand drifting in the desert wind, soft haze` |
| `cinemagraph` | Cinemagraph<br>سينماجراف | صورة ثابتة يتحرك فيها عنصر واحد في حلقة متصلة. رخيص ومؤثر. | Pic ثابتة + عنصر واحد متحرك | `completely still image, only one element moves in a seamless loop` |

## الإضاءة

| id | المصطلح | المعنى | عندنا في Remotion | برومبت |
|---|---|---|---|---|
| `golden-hour` | Golden Hour<br>الساعة الذهبية | شمس منخفضة دافئة وظلال طويلة. تناسب الوجهات السعودية. |  | `golden hour light, warm low sun, long soft shadows` |
| `blue-hour` | Blue Hour<br>الساعة الزرقاء | بعد الغروب: سماء زرقاء وضوء بارد هادئ. |  | `blue hour, deep blue sky after sunset, cool calm light` |
| `night` | Night / Moonlight<br>ليل وضوء قمر | اذكر مصدر الضوء حتى لا يصير الكادر مظلماً. |  | `night scene lit by moonlight, cool blue tones` |
| `backlight` | Backlight / Silhouette<br>إضاءة خلفية | الشخص ظل داكن على خلفية مضيئة. |  | `strong backlight, figure as a dark silhouette against the bright sky` |
| `low-key` | Low-Key<br>إضاءة درامية | كادر مظلم وضوء واحد مركّز. تباين وتوتر. |  | `low-key lighting, single hard light, deep shadows` |
| `god-rays` | Volumetric Rays<br>أشعة حجمية | أشعة مرئية تمر عبر الغبار أو الضباب. |  | `volumetric god rays streaming through the haze` |
| `soft-overcast` | Overcast / Soft<br>ضوء غائم ناعم | ضوء منتشر بلا ظلال قوية. |  | `overcast sky, soft diffused light, no hard shadows` |
| `bright-daylight` | Bright Daylight<br>نهار ساطع | ضوء نهار قوي ونظيف. الأنسب لمقاطع المدارس والأطفال. إضافة خاصة بنا. |  | `bright natural daylight, clean and cheerful, soft shadows` |

## السرعة والزمن

| id | المصطلح | المعنى | عندنا في Remotion | برومبت |
|---|---|---|---|---|
| `real-time` | Real Time<br>سرعة طبيعية | الحركة كما في الواقع، 24 أو 30 كادراً. |  | `real-time speed, natural motion` |
| `slow-motion` | Slow Motion<br>حركة بطيئة | تصوير بكادرات عالية وعرض عادي. للحظات الدرامية. | playbackRate أقل من 1 على Clip | `slow motion at 120fps` |
| `timelapse` | Time-lapse<br>تايم لابس | كاميرا ثابتة وساعات تتحول لثوانٍ. | playbackRate عالٍ | `time-lapse, clouds racing, static camera` |
| `hyperlapse` | Hyperlapse<br>هايبرلابس | تايم لابس والكاميرا تتحرك مسافة كبيرة. سفر سريع. |  | `hyperlapse moving through the landscape` |
| `speed-ramp` | Speed Ramp<br>تغيير السرعة داخل اللقطة | سريع ثم بطيء ثم سريع. أكشن ورياضة. | interpolate لـ playbackRate | `speed ramp, fast motion easing into slow motion at the peak moment` |
| `freeze-frame` | Freeze Frame<br>تجميد | الحركة تتوقف على كادر ثم تكمل. لإبراز لحظة. | Freeze من remotion | `action freezes in a still frame, then continues` |
| `reverse` | Reverse<br>حركة عكسية | الحدث من النهاية للبداية. |  | `reverse motion, the action plays backwards` |

## العدسة والفوكس

| id | المصطلح | المعنى | عندنا في Remotion | برومبت |
|---|---|---|---|---|
| `rack-focus` | Rack Focus<br>تحويل الفوكس | الفوكس ينتقل من قريب لبعيد ليوجه الانتباه. | blur يتبدل بين طبقتين | `rack focus from the foreground to the person in the background` |
| `shallow-dof` | Shallow Depth of Field<br>عمق ميدان ضحل | موضوع حاد وخلفية مغبشة. عزل وسينمائية. | filter: blur على الخلفية | `shallow depth of field, subject sharp, soft creamy bokeh, 85mm f/1.4` |
| `deep-focus` | Deep Focus<br>فوكس عميق | كل شيء حاد من المقدمة للخلفية. |  | `deep focus, everything sharp` |
| `tilt-shift` | Tilt-Shift<br>مجسم مصغر | شريط حاد والباقي مغبش، فيبدو المكان كمجسم. جميل للمدن. |  | `tilt-shift miniature effect, narrow band of focus` |
| `lens-flare` | Lens Flare<br>وهج العدسة | بقع وخطوط ضوء من مصدر قوي. |  | `warm anamorphic lens flare` |
| `motion-blur` | Motion Blur<br>ضبابية الحركة | التلطخ الطبيعي للأجسام السريعة. غيابه يجعل الحركة متقطعة. | <CameraMotionBlur> أو blur على الانتقالات الخاطفة | `natural motion blur on fast movement` |

## التوليد بالذكاء الاصطناعي

| id | المصطلح | المعنى | عندنا في Remotion | برومبت |
|---|---|---|---|---|
| `t2v` | Text-to-Video<br>من نص لفيديو | وصف فقط والأداة تولّد كل شيء. تحكم أقل بالشكل. |  | `(describe subject, camera, light)` |
| `i2v` | Image-to-Video<br>من صورة لفيديو | صورة كأول كادر، وتصف الحركة فقط. أفضل تحكم بالشكل والشخصية، وهو الأرخص عندنا مع صور مولّدة. | ولّد الصورة بـ images_generate ثم حرّكها بـ video_generate | `(do not repeat what is in the image, describe only what moves)` |
| `first-last` | Start & End Frame<br>الكادر الأول والأخير | تعطي صورة البداية والنهاية والأداة تولّد ما بينهما. للانتقالات والتحولات. |  | `smooth continuous transition from the first frame to the last frame` |
| `v2v` | Video-to-Video<br>من فيديو لفيديو | إعادة رسم فيديو بأسلوب جديد مع الحفاظ على الحركة. شدة التغيير تحدد كم يبقى من الأصل. |  | `restyle keeping the original motion and timing` |
| `motion-brush` | Motion Brush<br>فرشاة الحركة | تحدد منطقة واتجاهاً لحركة جزء واحد والباقي ثابت. |  | `only the clouds drift slowly to the right, everything else stays still` |
| `camera-control` | Camera Control<br>تحكم الكاميرا | منزلقات للحركة بدل كتابتها. اختر محوراً واحداً بقيمة متوسطة. |  | `one camera axis at medium intensity, no other camera movement` |
| `motion-strength` | Motion Strength<br>شدة الحركة | كمية الحركة. العالي يزيد التشوه والمنخفض أثبت. ابدأ من المنتصف. |  | `subtle motion, gentle and minimal movement, stable scene` |
| `negative-prompt` | Negative Prompt<br>برومبت سلبي | ما لا تريده. إن لم تدعمه الأداة صِف الثبات بجمل إيجابية. |  | `morphing, warping, flicker, distorted face, extra fingers, text, watermark, camera shake` |
| `character-ref` | Character Reference<br>ثبات الشخصية | صورة مرجعية لتبقى الملامح والملابس ثابتة بين اللقطات. |  | `same character as the reference image: identical face and outfit in all shots` |
| `lip-sync` | Lip Sync<br>مزامنة الشفاه | تحريك الفم ليطابق صوتاً. وجه أمامي واضح. |  | `medium close-up, the character speaks directly to camera with natural lip sync` |
| `aspect-ratio` | Aspect Ratio<br>نسبة الأبعاد | حدّدها قبل التوليد لأن تغييرها بعده يقص الصورة. ريلز 9:16. | width 1080 height 1920 | `vertical 9:16 composition, subject centered, space for captions at the bottom` |
| `clip-duration` | Duration & FPS<br>المدة والكادرات | أغلب الأدوات 5 إلى 10 ثوانٍ، فاجعل المقطع حدثاً واحداً. 30fps للسوشيال. | FPS = 30 | `single 5-second shot, one continuous action` |
| `seed` | Seed<br>البذرة | نفس البرومبت مع نفس الـ seed يعطي نتيجة قريبة. احفظه وغيّر كلمة واحدة في كل مرة. |  | `fix the seed, change one word at a time` |
| `extend` | Extend<br>تمديد | تكمل المقطع من آخر كادر. صف ما يحدث بعد ذلك فقط. |  | `continue the shot, same lighting and style` |
| `gen-loop` | Loop<br>تكرار متصل | آخر كادر يطابق الأول. أو استخدم الصورة نفسها كأول وآخر كادر. |  | `seamless loop, last frame matches the first frame` |
| `interpolation` | Frame Interpolation<br>كادرات بينية | إضافة كادرات لتنعيم الحركة أو صنع بطيء. |  | `interpolate from 24fps to 60fps` |
| `upscale` | Upscale<br>رفع الدقة | تكبير مع إضافة تفاصيل. آخر خطوة قبل المونتاج. | video_upscale أو images_upscale من Magnific | `upscale to 4K, preserve film grain, no oversharpening` |

## مشاكل التوليد وحلولها

| id | المصطلح | المعنى | عندنا في Remotion | برومبت |
|---|---|---|---|---|
| `fix-morphing` | Morphing / Warping<br>تشوّه وتحوّل | الشكل يذوب أو يتحول. السبب حركة كثيرة أو برومبت متناقض. |  | `FIX: lower motion strength, one simple action, image-to-video. Negative: morphing, warping, melting` |
| `fix-flicker` | Flicker<br>وميض | إضاءة أو ألوان ترتعش بين الكادرات. |  | `FIX: consistent lighting, stable exposure. Negative: flicker, strobing` |
| `fix-camera-drift` | Unwanted Camera Drift<br>حركة كاميرا غير مطلوبة | الأدوات تضيف حركة إن لم تحددها. |  | `FIX: static camera, locked-off tripod shot, no camera movement` |
| `fix-chaos` | Too Much Motion<br>حركة زائدة | كل شيء يتحرك معاً فتضيع اللقطة. |  | `FIX: only the subject moves, background still, one camera move only` |
| `fix-frozen` | No Motion<br>فيديو شبه ثابت | برومبت يصف الشكل بدل الحركة. |  | `FIX: use clear action verbs (walks, turns, pours), add slow push in` |
| `fix-speed` | Wrong Speed<br>سرعة غير مناسبة | تبدو مسرّعة. حدّد الإيقاع صراحة. |  | `FIX: natural real-time speed, slow deliberate movement` |
| `fix-identity-drift` | Identity Drift<br>تغير الملامح | الوجه أو الملابس تتغير في اللقطة أو بين اللقطات. |  | `FIX: character reference image, short shots, same face and outfit throughout` |
| `fix-hands` | Hands & Fingers<br>الأيدي والأصابع | أصابع زائدة أو ملتحمة مع الحركة السريعة. |  | `FIX: simple slow hand motion or keep hands out of frame` |
| `fix-garbled-text` | Garbled Text<br>نص مشوّه | الكتابة داخل لقطة مولّدة تتشوه، والعربي أسوأ. نصنا كله من Remotion. | كل النصوص من Remotion فوق اللقطة | `FIX: do not generate text in the shot; add titles in Remotion` |
| `fix-physics` | Broken Physics<br>فيزياء غير منطقية | أجسام تخترق بعضها أو تطفو. |  | `FIX: realistic physics, natural gravity and weight` |
| `fix-loop-seam` | Loop Seam<br>قفزة اللوب | آخر كادر لا يطابق الأول فيقفز. |  | `FIX: same image as first and last frame, or crossfade the ends` |

## مصطلحات إنتاج

| id | المصطلح | المعنى | عندنا في Remotion | برومبت |
|---|---|---|---|---|
| `keyframe` | Keyframe<br>كي فريم | نقطة على التايملاين بقيمة محددة والباقي يُحسب. | نقاط interpolate |  |
| `interpolation-type` | Interpolation<br>استيفاء | طريقة حساب القيم بين المفاتيح: Linear أو Bezier أو Hold. | extrapolate و easing في interpolate |  |
| `frame-rate` | Frame Rate<br>معدل الكادرات | 24 سينمائي، 30 سوشيال وهو ما نستخدمه، 60 ناعم جداً. | FPS = 30 |  |
| `timecode` | Timecode<br>كود زمني | عنوان الكادر ساعة:دقيقة:ثانية:كادر. | frame / FPS |  |
| `shutter-angle` | Shutter Angle<br>زاوية الغالق | تحدد ضبابية الحركة. 180 درجة هي الإحساس السينمائي. | CameraMotionBlur shutterAngle |  |
| `pre-compose` | Pre-compose<br>تجميع مسبق | تجميع طبقات لتحريكها ككتلة. | مكوّن React منفصل داخل Sequence |  |
| `null-parent` | Null / Parenting<br>كائن فارغ وربط | طبقة غير مرئية تتحكم بطبقات مربوطة بها. | div أب بـ transform والأبناء داخله |  |
| `matte` | Mask / Matte<br>قناع | شكل يحدد الجزء الظاهر من طبقة. | overflow hidden أو clipPath أو mask-image |  |
| `rotoscoping` | Rotoscoping<br>روتوسكوب | فصل الشخص عن الخلفية. الذكاء الاصطناعي يفعله. | images_remove_background أو video_remove_background (Magnific) |  |
| `motion-tracking` | Motion Tracking<br>تتبع الحركة | تثبيت نص أو عنصر على نقطة متحركة. |  |  |
| `color-grading` | Color Grading<br>تلوين | ضبط الألوان لمزاج موحد. عندنا ألوان الهوية. | video_color_grade (Magnific) أو filter على Clip |  |
| `lut` | LUT<br>جدول ألوان | ملف تلوين جاهز بضغطة. |  |  |
| `lottie` | Lottie<br>لوتي | JSON لتشغيل أنيميشن After Effects. @remotion/lottie يدعمه. | @remotion/lottie |  |
| `depth-map` | Depth Map<br>خريطة عمق | صورة رمادية ببعد كل جزء. أساس 2.5D. | images_depth_map (Magnific) |  |
| `temporal-consistency` | Temporal Consistency<br>ثبات زمني | ثبات الأشكال والألوان بين الكادرات. |  |  |
