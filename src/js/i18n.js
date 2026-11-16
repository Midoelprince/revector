/* Revector Arabic layer: hardcoded dictionary, right-to-left flip, no network. */
(function () {
  var AR = {
    /* Header, menus, footer */
    "Skip to content": "تخطَّ إلى المحتوى",
    "Developers": "المطورون",
    "API": "واجهة البرمجة",
    "Pricing": "الأسعار",
    "Support": "الدعم",
    "Menu": "القائمة",
    "Product": "المنتج",
    "Company": "الشركة",
    "About": "حول",
    "Terms": "الشروط",
    "Privacy": "الخصوصية",
    "Converters": "المحوِّلات",
    "Convert PNG to SVG": "تحويل PNG إلى SVG",
    "Convert JPG to SVG": "تحويل JPG إلى SVG",
    "Traced with care by a very meticulous robot.": "رُسمت بعناية على يد روبوت دقيق للغاية.",
    "© Revector Studio": "© استوديو Revector",
    "Developer Overview": "نظرة عامة للمطورين",
    "Documentation": "التوثيق",
    "Error Responses": "رسائل الأخطاء",

    /* Home page */
    "Convert": "حوِّل",
    "Images": "الصور",
    "to": "إلى",
    "Vectors": "متجهات",
    "Online": "بسهولة",
    "Every curve,": "كل منحنى،",
    "carefully traced.": "مرسوم بعناية.",
    "Drop an image to vectorize": "أفلت صورة لتحويلها إلى متجهات",
    "or paste with": "أو الصق باستخدام",
    "Vectorize image": "حوِّل الصورة",
    "Choose an image file": "اختر ملف صورة",
    "Free interactive preview. Download only when you're happy.": "معاينة تفاعلية مجانية. احفظ النتيجة فقط عندما تكون راضيًا.",
    "Building an app?": "تبني تطبيقًا؟",
    "See the API": "اطّلع على واجهة البرمجة",
    "Vectorize this example": "حوِّل هذا المثال",
    "Zoom": "تكبير",
    "Not just a trace. Real geometry.": "ليس مجرد تتبّع، بل هندسة حقيقية.",
    "Whole shapes": "أشكال كاملة",
    "Fewer, better anchor points": "نقاط ارتكاز أقل وأفضل",
    "Shapes that fit together": "أشكال تتلاءم معًا",
    "How It Works": "كيف يعمل",
    "Drop": "أفلِت",
    "Preview for free": "عاين مجانًا",
    "Save as": "احفظ بصيغة",
    "Made for the way you work": "مصمَّم لطريقة عملك",
    "Whatever you make, the result is ready for the next step.": "مهما كان ما تصنعه، تكون النتيجة جاهزة للخطوة التالية.",
    "AI-generated art": "فن مولَّد بالذكاء الاصطناعي",
    "Vectorize Images Online": "حوِّل الصور إلى متجهات",
    "Full Featured": "متكامل الميزات",
    "Deep vector engine": "محرك متجهات متقدم",
    "More detail": "مزيد من التفاصيل",
    "Vector graph": "رسم المتجهات",
    "Full shape fitting": "مطابقة كاملة للأشكال",
    "Curve support": "دعم المنحنيات",
    "Clean corners": "زوايا نظيفة",
    "Corner control": "التحكم في الزوايا",
    "High performance": "أداء عالٍ",
    "Nobody likes waiting.": "لا أحد يحب الانتظار.",
    "Symmetry modelling": "نمذجة التماثل",
    "Adaptive simplification": "تبسيط تكيُّفي",
    "Background removal": "إزالة الخلفية",
    "Region editing": "تحرير المناطق",
    "Palette control": "التحكم في لوحة الألوان",
    "Sub-pixel precision": "دقة دون مستوى البكسل",
    "Fully automatic": "تلقائي بالكامل",
    "No input is needed to get a result.": "لا حاجة لأي إدخال للحصول على نتيجة.",
    "Image types": "أنواع الصور",
    "Pre-crop": "القص المسبق",
    "Full color & transparency": "ألوان كاملة وشفافية",
    "Export choices": "خيارات التصدير",
    "FAQ": "الأسئلة الشائعة",
    "Frequently Asked Questions": "الأسئلة الشائعة",
    "Ready to vectorize your first image?": "مستعد لتحويل صورتك الأولى إلى متجهات؟",
    "Free preview. Nothing leaves your computer.": "معاينة مجانية. لا شيء يغادر جهازك.",
  "Opening, vectorizing, previewing and saving are free. Everything runs on your own computer, with no account and no uploads.": "فتح الملفات وتحويلها إلى متجهات ومعاينتها وحفظها مجاني. كل شيء يعمل على جهازك، دون حساب ودون رفع أي ملفات.",
    "Is Revector free?": "هل Revector مجاني؟",
    "What file formats can I upload and export?": "ما صيغ الملفات التي يمكنني فتحها وتصديرها؟",
    "What is the maximum image size?": "ما الحد الأقصى لحجم الصورة؟",
    "Does it work with transparent images?": "هل يعمل مع الصور الشفافة؟",
    "What are vector images useful for?": "ما فائدة صور المتجهات؟",
    "Will it work on my images?": "هل سيعمل مع صوري؟",
    "Does this work on AI-generated images?": "هل يعمل مع الصور المولَّدة بالذكاء الاصطناعي؟",
    "Will the results work with my software?": "هل تعمل النتائج مع برامجي؟",
    "What makes Revector stand out?": "ما الذي يميّز Revector؟",
    "How much does it cost?": "كم التكلفة؟",

    /* Pricing */
    "Pricing for the Web App and API": "أسعار التطبيق وواجهة البرمجة",
    "Web App": "التطبيق",
    "Most popular": "الأكثر شيوعًا",
    "Unlimited Web Images": "صور غير محدودة",
    "/ month": "/ شهريًا",
    "Billed monthly, cancel anytime.": "فوترة شهرية، ويمكن الإلغاء في أي وقت.",
    "1 Credit = 1 API Image": "رصيد واحد = صورة واحدة عبر الواجهة",
    "Choose": "اختر",
    "Credits/month": "الرصيد/شهريًا",
    "Price/month": "السعر/شهريًا",
    "Price/credit": "السعر/للرصيد",
    "Show more plans": "عرض المزيد من الخطط",
    "Show fewer plans": "عرض خطط أقل",
    "Currency:": "العملة:",
    "Which plan should I choose?": "أي خطة أختار؟",
    "Do unused API credits roll over?": "هل يُرحَّل الرصيد غير المستخدم؟",
    "What payment options do I have?": "ما خيارات الدفع المتاحة؟",

    /* Developers */
    "Revector Developers": "مطورو Revector",
    "Start with SDKs": "ابدأ بحزم التطوير",
    "Use the CLI": "استخدم سطر الأوامر",
    "Read API Docs": "اقرأ توثيق الواجهة",
    "Choose Your Integration Path": "اختر طريقة الربط المناسبة",
    "Start With SDKs": "ابدأ بحزم التطوير",
    "Install": "التثبيت",
    "Call": "الاستدعاء",
    "Download": "تنزيل",
    "Use the Command Line": "استخدم سطر الأوامر",
    "Call the API Directly": "استدعِ الواجهة مباشرة",
    "HTTP Endpoints": "نقاط HTTP",
    "OpenAPI and Tools": "OpenAPI والأدوات",
    "Developer References": "مراجع المطورين",
    "Output Options": "خيارات الإخراج",
    "Pricing and Test Mode": "الأسعار ووضع الاختبار",
    "Errors and Limits": "الأخطاء والحدود",
    "Developer FAQ": "أسئلة المطورين الشائعة",
    "Where should I start?": "من أين أبدأ؟",
    "Can I test it first?": "هل يمكنني التجربة أولًا؟",
    "Which inputs and outputs are supported?": "ما المدخلات والمخرجات المدعومة؟",

    /* Support */
    "Contact Support": "التواصل مع الدعم",
    "Common Problems & Solutions": "المشكلات الشائعة وحلولها",
    "Email": "البريد الإلكتروني",
    "Subject": "الموضوع",
    "Message": "الرسالة",
    "Send Support Request": "إرسال طلب الدعم",
    "A File Will Not Convert": "لا يمكن تحويل ملف",
    "I Cannot Save My Result": "لا يمكنني حفظ النتيجة",
    "Other": "أخرى",

    /* App controls */
    "New image": "صورة جديدة",
    "Side by side": "جنبًا إلى جنب",
    "Pixels": "البكسلات",
    "Outlines": "الحدود",
    "Shapes": "الأشكال",
    "Detail": "التفاصيل",
    "Corners": "الزوايا",
    "Sharpness": "الحدّة",
    "Remove background": "إزالة الخلفية",
    "Click shapes to remove them": "انقر على الأشكال لإزالتها",
    "Refine result": "تحسين النتيجة",
    "Palette": "لوحة الألوان",
    "Colors": "الألوان",
    "Auto": "تلقائي",
    "Layering": "الطبقات",
    "Stacked": "متراكبة",
    "Cutouts (shared edges)": "مقتطعة (حواف مشتركة)",
    "Symmetry": "التماثل",
    "Edit": "تحرير",
    "Crop": "قص",
    "Reset edits": "إلغاء التعديلات",
    "Reset": "إعادة تعيين",
    "Fit": "ملاءمة",
    "Merge colors": "دمج الألوان",
    "Unmerge colors": "فصل الألوان",
    "Pick 2 or more colors": "اختر لونين أو أكثر",
    "Make left and right halves match": "مطابقة النصفين الأيمن والأيسر",
    "Gap filler (hides hairline seams)": "سد الفجوات (يخفي الشقوق الدقيقة)",
    "Color": "اللون",
    "Transparent (cut out)": "شفاف (مقتطع)",
    "OK": "حسنًا",
    "Close": "إغلاق",
    "Error": "خطأ",
    "Great": "رائعة",
    "Okay": "مقبولة",
    "Not good": "ليست جيدة",
    "Not now": "ليس الآن",
    "How did this result turn out?": "كيف جاءت هذه النتيجة؟",
    "Cleaning blended edges…": "تنظيف الحواف المتداخلة…",
    "Cleaning edges…": "تنظيف الحواف…",
    "Tracing shapes…": "تتبُّع الأشكال…",
    "Tracing shared borders…": "تتبُّع الحدود المشتركة…",
    "Smoothing noise…": "تنعيم التشويش…",
    "Finding colors…": "تحديد الألوان…",
    "Removing specks…": "إزالة النقاط الصغيرة…",
    "Done": "تم",
    "Lowest": "الأدنى",
    "Low": "منخفض",
    "Medium": "متوسط",
    "High": "مرتفع",
    "Highest": "الأعلى",
    "Softest": "الأنعم",
    "Soft": "ناعم",
    "Balanced": "متوازن",
    "Crisp": "حاد",
    "Crispest": "الأحدّ",

    /* 1.1.0: navigation, footer, hero */
    "Features": "الميزات",
    "Loading": "جارٍ تحميل",
    "Source code": "الكود المصدري",
    "Releases": "الإصدارات",
    "License": "الرخصة",
    "Language: English": "اللغة: الإنجليزية",
    "English": "English",
    "No account, no uploads, no settings to learn.": "بلا حساب، بلا رفع ملفات، وبلا إعدادات تحتاج تعلّمها.",
    "Choose an image to vectorize": "اختر صورة لتحويلها إلى متجهات",
    "Turn PNG, JPG, GIF and WebP pictures into tidy SVG, PDF, EPS and DXF vectors on your own computer, offline. A very patient robot fits true circles, sharp corners and smooth curves, so the result is ready to print straight away.": "حوِّل صور PNG وJPG وGIF وWebP إلى متجهات SVG وPDF وEPS وDXF نظيفة على جهازك دون اتصال بالإنترنت. روبوت صبور يطابق الدوائر الحقيقية والزوايا الحادة والمنحنيات الناعمة، فتكون النتيجة جاهزة للطباعة فورًا.",
    "PNG · JPG · GIF · BMP · WebP → SVG · PDF · EPS · DXF": "PNG · JPG · GIF · BMP · WebP ← SVG · PDF · EPS · DXF",
    "An example vectorized: pixels left of the divider, vectors right of it, and a loupe tracing the fitted paths over the pixels.": "مثال محوَّل: البكسلات على جانب الفاصل، والمتجهات على الجانب الآخر، وعدسة تُظهر المسارات المطابَقة فوق البكسلات.",
    "Pixels and vectors divider": "الفاصل بين البكسلات والمتجهات",

    /* Sections and cards */
    "Ordinary auto-tracers trace blocks of pixels, leaving jagged edges and heaps of anchor points. Revector rebuilds the shapes your image was made from.": "أدوات التتبّع التلقائي العادية تتبع كتل البكسلات فتترك حوافًا مسنّنة وأكوامًا من نقاط الارتكاز. أما Revector فيعيد بناء الأشكال التي صُنعت منها صورتك.",
    "Circles, ellipses, rounded boxes and stars come out as real geometric shapes, alongside lines, arcs and Bezier curves, so outlines stay true and are easy to edit.": "تخرج الدوائر والأشكال البيضوية والمستطيلات المدوّرة والنجوم كأشكال هندسية حقيقية، إلى جانب الخطوط والأقواس ومنحنيات بيزيه، فتبقى الحدود الخارجية دقيقة وسهلة التحرير.",
    "Every corner is modeled and every curve is smoothed, so you get tidy paths rather than a cloud of nodes to clean up by hand.": "كل زاوية تُنمذَج وكل منحنى يُنعَّم، فتحصل على مسارات مرتبة بدل سحابة من العُقد تحتاج تنظيفها يدويًا.",
    "Neighboring shapes share their boundaries exactly, so colors meet cleanly with no thin gaps or overlaps.": "الأشكال المتجاورة تتشارك حدودها بدقة، فتلتقي الألوان بنظافة دون فجوات رفيعة أو تداخلات.",
    "Drag and drop, paste, or choose a picture. Everything stays on your computer.": "اسحب الصورة وأفلتها، أو الصقها، أو اخترها من جهازك. كل شيء يبقى على حاسوبك.",
    "We fit shapes, curves and corners to your pixels in seconds. No user input is required to produce the result.": "نطابق الأشكال والمنحنيات والزوايا مع بكسلاتك خلال ثوانٍ. لا حاجة لأي تدخل منك للحصول على النتيجة.",
    "Then inspect the whole result for free: zoom in, compare it with the original, and adjust the palette until it looks right.": "ثم افحص النتيجة كاملة مجانًا: كبِّر، وقارنها بالأصل، وعدِّل لوحة الألوان حتى تبدو كما تريد.",
    "Download when you're happy, with settings for editing, cutting and engraving.": "نزِّل النتيجة عندما تكون راضيًا، مع إعدادات للتحرير والقص والحفر.",
    "Logos & brand archives": "الشعارات وأرشيف العلامات التجارية",
    "Cricut, vinyl & screen printing": "كريكت والفينيل وطباعة الشاشة الحريرية",
    "Laser, CNC & engraving": "الليزر وCNC والحفر",
    "Sketches & line art": "الاسكتشات والرسوم الخطية",
    "Icons & pixel art": "الأيقونات وفن البكسل",
    "Tiny icons and low-resolution images are rebuilt at four times their size before tracing, so staircases and anti-aliasing halos disappear and round shapes come out as true curves.": "الأيقونات الصغيرة والصور منخفضة الدقة يُعاد بناؤها بأربعة أضعاف حجمها قبل التتبّع، فتختفي التدرّجات السلّمية وهالات تنعيم الحواف، وتخرج الأشكال المستديرة كمنحنيات حقيقية.",
    "Turn pictures from image generators into editable vector illustrations, icons, stickers and t-shirt designs.": "حوِّل صور مولِّدات الصور إلى رسوم متجهية قابلة للتحرير وأيقونات وملصقات وتصاميم قمصان.",
    "Turn scanned pencil sketches, ink drawings and diagrams into clean line art that scales.": "حوِّل اسكتشات القلم الرصاص الممسوحة ورسوم الحبر والمخططات إلى رسوم خطية نظيفة قابلة للتكبير.",
    "Rebuild blurry logos, old scans and tiny web graphics as sharp master files in EPS, PDF or SVG.": "أعد بناء الشعارات الضبابية والمسوحات القديمة ورسوميات الويب الصغيرة كملفات أصلية حادة بصيغ EPS أو PDF أو SVG.",

    /* FAQ answers */
    "Can I make cut files for laser cutters, Cricut and CNC?": "هل يمكنني إنشاء ملفات قص لقواطع الليزر وكريكت وCNC؟",
    "Yes. Download DXF or SVG, and switch on outlines to get thin strokes instead of filled shapes.": "نعم. نزِّل DXF أو SVG، وفعِّل الحدود الخارجية للحصول على خطوط رفيعة بدل الأشكال المعبّأة.",
    "How is this different from auto-trace in design software?": "ما الفرق بينه وبين التتبّع التلقائي في برامج التصميم؟",
    "Auto-trace tools often follow pixel edges closely and leave lots of points. We group colors first, then smooth and simplify each outline, keeping corners sharp and curves round.": "أدوات التتبّع التلقائي تتبع حواف البكسلات عن قرب وتترك نقاطًا كثيرة. نحن نجمّع الألوان أولًا، ثم ننعّم كل حد خارجي ونبسّطه مع إبقاء الزوايا حادة والمنحنيات مستديرة.",
    "Shapes are stacked so neighboring colors never leave gaps, you can tune the palette and edit shapes before downloading, and nothing leaves your computer. The algorithm fits circular arcs and other common classes of shapes for clarity at any size.": "الأشكال تتراكب فلا تترك الألوان المتجاورة فجوات، ويمكنك ضبط لوحة الألوان وتحرير الأشكال قبل التنزيل، ولا شيء يغادر جهازك. تطابق الخوارزمية الأقواس الدائرية وأصناف الأشكال الشائعة الأخرى لتبقى واضحة بأي حجم.",
    "Upload PNG, JPG, GIF, BMP or WebP. Download SVG, EPS, DXF, PDF or PNG.": "افتح PNG أو JPG أو GIF أو BMP أو WebP. ونزِّل SVG أو EPS أو DXF أو PDF أو PNG.",
    "Large pictures are scaled down to 4096 pixels on the longest side before tracing. Since we have a maximum allowable resolution, crop first to keep the most details where you need them.": "الصور الكبيرة تُصغَّر إلى 4096 بكسل على الضلع الأطول قبل التتبّع. وبما أن هناك حدًا أقصى للدقة، اقتصص الصورة أولًا للحفاظ على التفاصيل حيث تحتاجها.",
    "Yes. Transparent areas automatically stay transparent in the vector result, as long as they have no color behind them.": "نعم. المناطق الشفافة تبقى شفافة تلقائيًا في النتيجة المتجهية ما دام لا يوجد لون خلفها.",
    "Vectors scale to any size without blur, so they suit logos, signs, print, cutting machines, embroidery and web graphics.": "المتجهات تتكبّر إلى أي حجم دون ضبابية، لذا تناسب الشعارات واللافتات والطباعة وآلات القص والتطريز ورسوميات الويب.",
    "It works best on logos, flat illustrations and drawings. Photos work too, but come out as posterised artwork.": "يعمل على أفضل وجه مع الشعارات والرسوم المسطّحة والرسومات. الصور الفوتوغرافية تعمل أيضًا، لكنها تخرج كعمل فني مبسَّط الألوان.",
    "Yes. Images from AI-powered generators often have flat, illustrated styles, which give especially clean results.": "نعم. صور مولِّدات الذكاء الاصطناعي غالبًا ما تكون بأسلوب مسطّح يشبه الرسوم، وهذا يعطي نتائج نظيفة جدًا.",
    "The files are standard SVG, PDF, EPS and DXF, which open in common design, office and cutting programs.": "الملفات بصيغ SVG وPDF وEPS وDXF القياسية، وتُفتح في برامج التصميم والمكتب والقص الشائعة.",
    "Is there a difference between vectorizing and embedding?": "هل هناك فرق بين التحويل إلى متجهات والتضمين؟",
    "Yes. Embedding only wraps the pixels inside a vector file. Vectorizing redraws the picture as real shapes you can edit and scale.": "نعم. التضمين يغلّف البكسلات داخل ملف متجهي فقط. أما التحويل إلى متجهات فيعيد رسم الصورة كأشكال حقيقية يمكنك تحريرها وتكبيرها.",
    "Do you make any claims on the input images or vectorized results?": "هل لديكم أي حقوق على الصور المُدخَلة أو النتائج؟",
    "No. Your pictures and results stay yours.": "لا. صورك ونتائجك تبقى ملكك.",
    "What are your data retention policies?": "ما سياسة الاحتفاظ بالبيانات؟",
    "Nothing is uploaded. Your picture is processed on your computer and is never sent anywhere.": "لا يُرفع أي شيء. صورتك تُعالَج على جهازك ولا تُرسَل إلى أي مكان.",
    "Can I use your output for machine learning training?": "هل يمكنني استخدام النتائج لتدريب نماذج تعلّم الآلة؟",
    "The results are yours to use as you like, as long as you have the rights to the original picture.": "النتائج ملكك تستخدمها كما تشاء، ما دمت تملك حقوق الصورة الأصلية.",
    "The desktop converter is free.": "محوِّل سطح المكتب مجاني.",

    /* App panel */
    "View": "العرض",
    "Settings": "الإعدادات",
    "Zoom in": "تكبير",
    "Zoom out": "تصغير",
    "Smoothness": "النعومة",
    "Icon/Logo Mode (Smooth)": "وضع الأيقونات والشعارات (ناعم)",
    "Click a color to change it or make it transparent. Drag one color onto another to merge them into one shape.": "انقر على لون لتغييره أو جعله شفافًا. اسحب لونًا فوق آخر لدمجهما في شكل واحد.",
    "Cancel merge": "إلغاء الدمج",
    "Drag a box…": "ارسم مربعًا…",
    "File format": "صيغة الملف",
    "EPS – Illustrator": "EPS – إليستريتور",
    "Edit color": "تحرير اللون",
    "Hex color": "اللون السداسي عشري",
    "Hue": "درجة اللون",
    "Saturation and brightness": "التشبّع والسطوع",
    "Back to the traced color": "العودة إلى اللون المتتبَّع",
    "Network Error": "خطأ في الشبكة",
    "The tracing helper couldn't be loaded, so tracing continues on this page instead. It may be a little slower.": "تعذّر تحميل مساعد التتبّع، لذا سيستمر التتبّع في هذه الصفحة نفسها. قد يكون أبطأ قليلًا.",
    "Fatal Error :-(": "خطأ فادح :-(",
    "Something went wrong while tracing this picture. Try a different picture or reload the page.": "حدث خطأ أثناء تتبّع هذه الصورة. جرِّب صورة أخرى أو أعد تحميل الصفحة.",
    "Sorry, that picture couldn't be traced.": "عذرًا، تعذّر تتبّع هذه الصورة.",
    "Sorry, that picture couldn't be opened.": "عذرًا، تعذّر فتح هذه الصورة.",
    "That file isn't a picture. Try PNG, JPG, GIF, BMP or WebP.": "هذا الملف ليس صورة. جرِّب PNG أو JPG أو GIF أو BMP أو WebP.",
    "Please help us improve!": "ساعدنا على التحسين!",
    "Thank you - please share the love!": "شكرًا لك – شارك التجربة مع غيرك!",
    "Glad it helped. Tell a friend who works with pictures.": "يسعدنا أنه أفادك. أخبر صديقًا يعمل مع الصور.",
    "Preparing…": "جارٍ التحضير…",
    "Binarizing & smoothing edges…": "تثنية الألوان وتنعيم الحواف…",
    "Reconstructing edges…": "إعادة بناء الحواف…",
    "colors": "ألوان",
    "shapes": "أشكال",
    "curve segments": "مقاطع منحنيات",
    "traced at full size": "تُتُبِّعت بالحجم الكامل",
    "traced at": "تُتُبِّعت بحجم",
    "transparent": "شفاف",
    "colors merged": "ألوان مدمجة",
    "merged": "مدمجة",
    "Bad Request": "طلب غير صالح",

    /* 1.2.0 editor */
    "Background": "الخلفية",
    "Remove the background and choose what to keep.": "أزل الخلفية واختر ما تريد إبقاءه.",
    "Choose and edit the colors used throughout your image.": "اختر الألوان المستخدمة في صورتك وعدّلها.",
    "Regions": "المناطق",
    "Remove individual shapes or crop the picture.": "احذف أشكالًا مفردة أو اقتصص الصورة.",
    "Geometry": "الهندسة",
    "Symmetry, simplified shapes, detail and layering.": "التماثل والأشكال المبسّطة والتفاصيل والطبقات.",
    "Sharpen or round corners throughout the image.": "اجعل الزوايا حادة أو مدوّرة في الصورة كلها.",
    "All tools": "كل الأدوات",
    "Makes the color along the picture's edge transparent. To keep or drop single shapes, use Regions.": "يجعل اللون الموجود على حافة الصورة شفافًا. لإبقاء أشكال مفردة أو حذفها استخدم «المناطق».",
    "Original": "الأصلية",
    "Output": "الناتجة",
    "Merge": "دمج",
    "Split": "فصل",
    "Palette tools": "أدوات لوحة الألوان",
    "Number of colors": "عدد الألوان",
    "Click a color to select it, double-click to edit it. Drag one color onto another to merge them into one shape.": "انقر على لون لتحديده، وانقر نقرًا مزدوجًا لتعديله. اسحب لونًا فوق آخر لدمجهما في شكل واحد.",
    "Palette presets": "عدد الألوان الجاهز",
    "Reset all": "إعادة تعيين الكل",
    "Fit precise shapes": "مطابقة الأشكال الهندسية بدقة",
    "Circles, ellipses, rectangles and rounded rectangles come out as exact shapes; straight sides and round arcs stay true.": "تخرج الدوائر والأشكال البيضوية والمستطيلات والمستطيلات مدوّرة الزوايا كأشكال هندسية مضبوطة، وتبقى الأضلاع المستقيمة والأقواس دقيقة.",
    "Automatic": "تلقائي",
    "Make all corners sharp": "اجعل كل الزوايا حادة",
    "Make all corners round": "اجعل كل الزوايا مدوّرة",
    "Sharp corners": "الزوايا الحادة",
    "Fewer sharp": "أقل حدة",
    "More sharp": "أكثر حدة",
    "Undo": "تراجع",
    "Redo": "إعادة",

    /* Feature pegboard */
    "More": "المزيد",
    "Local edge reconstruction": "إعادة بناء الحواف محليًا",
    "Small pictures, rebuilt at 4x": "الصور الصغيرة تُعاد بأربعة أضعاف",
    "Edges are fitted with least-squares cubic Bézier curves and straight lines, through edge midpoints rather than pixel corners, so stair steps never reach the output.": "تُطابَق الحواف بمنحنيات بيزيه التكعيبية بطريقة المربعات الصغرى وبخطوط مستقيمة، عبر منتصفات الحواف لا زوايا البكسلات، فلا تصل التدرّجات السلّمية إلى النتيجة أبدًا.",
    "Pictures under 800 px are denoised, snapped with an Otsu threshold and interpolated through signed distance fields at four times their size before tracing. It runs on your computer with no model download and nothing to configure.": "الصور الأصغر من 800 بكسل يُزال تشويشها، وتُثبَّت حوافها بعتبة أوتسو، وتُستوفى عبر حقول المسافة الموقَّعة بأربعة أضعاف حجمها قبل التتبّع. يعمل ذلك على جهازك دون تنزيل أي نموذج ودون أي إعداد.",
    "Neighbouring regions share one traced border, so shapes meet exactly with no hairline gaps or overlaps between colours.": "المناطق المتجاورة تتشارك حدًا متتبَّعًا واحدًا، فتلتقي الأشكال بدقة دون فجوات شعرية أو تداخلات بين الألوان.",
    "Corners and sharp tips are detected on the outline and kept exactly; the runs between them become smooth curves. A slider sets how eagerly corners are kept.": "تُكتشف الزوايا والأطراف الحادة على الحد الخارجي وتُحفظ بدقة، وتتحول المقاطع بينها إلى منحنيات ناعمة. ويحدد شريط تمرير مدى الحرص على إبقاء الزوايا.",
    "Tracing runs in a background worker, the colour analysis is reused when only settings change, and small pictures trace in well under a second.": "يعمل التتبّع في عامل خلفي، ويُعاد استخدام تحليل الألوان عندما تتغير الإعدادات فقط، والصور الصغيرة تُتتبَّع في أقل من ثانية بكثير.",
    "Switch on symmetry to average the two halves of a logo before tracing, so both sides come out identical.": "فعِّل التماثل لحساب متوسط نصفَي الشعار قبل التتبّع، فيخرج الجانبان متطابقين.",
    "Pick the number of colours or let it be chosen for you, recolour, merge or cut out any colour, and remove the background with one checkbox.": "اختر عدد الألوان أو دعه يُختار تلقائيًا، وأعد تلوين أي لون أو ادمجه أو اقتطعه، وأزل الخلفية بخانة اختيار واحدة.",
    "Save SVG, PDF, EPS or DXF with fills only, ready for Illustrator, Inkscape, cutting software and CAD, or a cleaned-up PNG.": "احفظ بصيغ SVG أو PDF أو EPS أو DXF بتعبئة فقط، جاهزة لإليستريتور وإنكسكيب وبرامج القص وCAD، أو كصورة PNG منقّاة."
  };
  /* Paragraphs with links inside are split into several text nodes, so they are translated as a whole:
     key = the element's English text (whitespace collapsed), value = the Arabic inner HTML. */
  var L = function (t) { return '<a href="/#convert">' + t + "</a>"; };
  var AR_HTML = {
    "Bitmap images, such as JPEGs and PNGs are a grid of colored pixels. We turn them into shapes.":
      "الصور النقطية مثل " + L("JPEG") + " و" + L("PNG") + " عبارة عن شبكة من البكسلات الملوّنة، ونحن نحوّلها إلى أشكال.",
    "We combine deep learning networks and classical algorithms that together form the core functionality of Revector. Our proprietary computational geometry framework lets us make automated edits and localized optimizations that are simply not possible with conventional vector image representations. Shape outlines often consist of straight or smoothly varying sections separated from one another by discrete corners.":
      "نجمع بين خوارزميات متعددة تشكّل معًا جوهر Revector. يتيح لنا إطار الهندسة الحسابية الخاص بنا إجراء تعديلات تلقائية وتحسينات موضعية لا تتيحها التمثيلات المتجهية التقليدية. فالحدود الخارجية للأشكال تتألف غالبًا من مقاطع مستقيمة أو متغيرة بنعومة، تفصل بينها زوايا واضحة.",
    "Save as SVG, EPS, DXF and PDF vectors, or a cleaned-up PNG picture.":
      "احفظ النتيجة كمتجهات بصيغ " + L("SVG") + " و" + L("EPS") + " و" + L("DXF") + " و" + L("PDF") + "، أو كصورة PNG منقّاة.",
    "Rebuild blurry logos, old scans and tiny web graphics as sharp master files in EPS, PDF or SVG.":
      "أعد بناء الشعارات الضبابية والمسوحات القديمة ورسوميات الويب الصغيرة كملفات أصلية حادة بصيغ " + L("EPS") + " أو " + L("PDF") + " أو SVG.",
    "Turn a small, fuzzy JPEG into a multi-color SVG cut file with crisp corners and solid shapes, ready for weeding and pressing.":
      "حوِّل صورة JPEG صغيرة ومشوّشة إلى ملف قص " + L("SVG متعدد الألوان") + " بزوايا حادة وأشكال مصمتة، جاهز للتقشير والكبس الحراري.",
    "Export DXF or SVG for your cutting software. The outline setting draws every shape as a thin stroke, and the DXF output keeps to simple lines and curves that your machine software reads without trouble.":
      "صدِّر " + L("DXF") + " أو SVG لبرنامج القص لديك. يرسم خيار الحدود الخارجية كل شكل كخط رفيع، ويقتصر ملف DXF على خطوط ومنحنيات بسيطة يقرؤها برنامج آلتك دون مشاكل.",
    "Turn PNG, JPG, GIF and WebP pictures into clean SVG, PDF, EPS and DXF vectors on your computer. AI-powered tracing for logos, illustrations, print, web, CAD, CNC and all kinds of design workflows.":
      "حوِّل صور PNG وJPG وGIF وWebP إلى متجهات SVG وPDF وEPS وDXF نظيفة على جهازك. تتبّع ذكي للشعارات والرسوم والطباعة والويب وCAD وCNC ولكل أنواع سير عمل التصميم.",
    "Open any raster image and convert it to scalable vector artwork in seconds. Revector turns pixels into editable shapes with smooth curves, fine details and clean colors, for logos, illustrations, diagrams, sketches and design assets. It runs offline on your own computer, so your pictures never leave it.":
      "افتح أي صورة نقطية وحوّلها إلى عمل متجهي قابل للتكبير خلال ثوانٍ. يحوّل Revector البكسلات إلى أشكال قابلة للتحرير بمنحنيات ناعمة وتفاصيل دقيقة وألوان نظيفة، للشعارات والرسوم والمخططات والاسكتشات وعناصر التصميم. يعمل دون اتصال على جهازك، فلا تغادره صورك أبدًا.",
    "Start from everyday picture formats like PNG, JPG, GIF, BMP and WebP, then save useful vector formats including SVG, EPS, DXF and PDF.":
      "ابدأ من صيغ الصور المعتادة مثل " + L("PNG") + " و" + L("JPG") + " و" + L("GIF") + " و" + L("BMP") + " و" + L("WebP") + "، ثم احفظ بصيغ متجهية مفيدة منها " + L("SVG") + " و" + L("EPS") + " و" + L("DXF") + " و" + L("PDF") + ".",
    "Whether you're redrawing a logo, preparing art for print, making pictures for the web or creating DXF paths for CAD and CNC work, Revector gives you clean, editable vector files for professional use.":
      "سواء كنت تعيد رسم شعار، أو تجهّز عملًا للطباعة، أو تصنع صورًا للويب، أو تنشئ مسارات " + L("DXF") + " لأعمال CAD وCNC، يمنحك Revector ملفات متجهية نظيفة وقابلة للتحرير للاستخدام الاحترافي.",
    "Keep resolution independence and small file sizes, with clear, crisp results on every screen size and in print.":
      "حافظ على الاستقلال عن الدقة وأحجام الملفات الصغيرة، مع نتائج واضحة وحادة على كل الشاشات وفي الطباعة."
  };

  /* Example pictures in the showcase: their names appear in tooltips and screen-reader labels. */
  var EXAMPLES = {
    "coffee cup": "كوب قهوة", "sun badge": "شارة الشمس", "mountain badge": "شارة الجبل", "paper plane": "طائرة ورقية",
    "pine badge": "شارة الصنوبر", "chili pepper": "فلفل حار", "donut": "دونات", "night harbor": "ميناء ليلي",
    "night owl": "بومة الليل", "cloud sync": "مزامنة سحابية", "geometric shapes": "أشكال هندسية", "bubble tea": "شاي الفقاعات",
    "calligraphy": "خط عربي", "mascot": "تميمة", "geo badge": "شارة هندسية"
  };
  for (var ex in EXAMPLES) if (Object.prototype.hasOwnProperty.call(EXAMPLES, ex)) {
    AR[ex] = EXAMPLES[ex];
    AR["Show example: " + ex] = "عرض المثال: " + EXAMPLES[ex];
  }
  AR["Main"] = "القائمة الرئيسية";

  var EN = {};
  for (var k in AR) if (Object.prototype.hasOwnProperty.call(AR, k)) EN[AR[k]] = k;

  var swapped = [];
  function norm(s) { return s.replace(/\s+/g, " ").trim(); }
  function swapHtml(el) {
    if (lang !== "ar" || el.__i18nEn !== undefined) return el.__i18nEn !== undefined;
    var ar = AR_HTML[norm(el.textContent || "")];
    if (!ar) return false;
    el.__i18nEn = el.innerHTML;
    el.innerHTML = ar;
    swapped.push(el);
    return true;
  }
  function restoreHtml() {
    for (var i = 0; i < swapped.length; i++) { swapped[i].innerHTML = swapped[i].__i18nEn; swapped[i].__i18nEn = undefined; }
    swapped = [];
  }

  var lang = "en";
  try { lang = localStorage.getItem("lang") === "ar" ? "ar" : "en"; } catch (e) {}

  function applyRoot() {
    var root = document.documentElement;
    if (lang === "ar") { root.setAttribute("dir", "rtl"); root.setAttribute("lang", "ar"); }
    else { root.removeAttribute("dir"); root.setAttribute("lang", "en"); }
  }
  applyRoot();

  function t(s) {
    if (s == null) return s;
    var key = String(s).trim();
    if (lang === "ar") return AR[key] || s;
    return EN[key] || s;
  }
  window.t = t;
  window.getLang = function () { return lang; };

  function swapText(node) {
    var raw = node.nodeValue;
    if (!raw) return;
    var key = raw.trim();
    if (!key) return;
    var next = lang === "ar" ? AR[key] : EN[key];
    if (!next || next === key) return;
    var out = raw.replace(key, next);
    if (out !== raw) node.nodeValue = out;
  }
  var ATTRS = ["placeholder", "aria-label", "title"];
  function swapAttrs(el) {
    for (var i = 0; i < ATTRS.length; i++) {
      var v = el.getAttribute(ATTRS[i]);
      if (!v) continue;
      var n = lang === "ar" ? AR[v.trim()] : EN[v.trim()];
      if (n && n !== v) el.setAttribute(ATTRS[i], n);
    }
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { swapText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    if (root.nodeType === 1) {
      var tag = root.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "svg" || tag === "SVG" || tag === "CODE" || tag === "PRE") return;
      if (root.hasAttribute("data-no-i18n")) return;
      swapAttrs(root);
      if ((tag === "P" || tag === "LI") && swapHtml(root)) return;
    }
    var c = root.firstChild;
    while (c) { walk(c); c = c.nextSibling; }
  }
  function translateAll() {
    if (lang !== "ar") restoreHtml();
    walk(document.body);
    var sw = document.querySelectorAll("[data-lang-switch]");
    for (var i = 0; i < sw.length; i++) sw[i].textContent = lang === "ar" ? "English" : "العربية";
    var title = document.title, tk = title.split(" - ");
    if (tk.length > 1) { var a = t(tk[0]); if (a !== tk[0]) document.title = a + " - " + tk.slice(1).join(" - "); }
  }
  window.translateAll = translateAll;

  var busy = false;
  function observe() {
    if (!window.MutationObserver || !document.body) return;
    new MutationObserver(function (list) {
      if (busy) return;
      busy = true;
      try {
        for (var i = 0; i < list.length; i++) {
          var m = list[i];
          if (m.type === "characterData") swapText(m.target);
          else for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
        }
      } finally { busy = false; }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function start() { translateAll(); observe(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();

  document.addEventListener("click", function (ev) {
    var target = ev.target && ev.target.closest ? ev.target.closest("[data-lang-switch],[data-locale]") : null;
    if (!target) return;
    ev.preventDefault();
    var loc = target.getAttribute("data-locale");
    if (loc) lang = loc === "ar" ? "ar" : "en";
    else lang = lang === "ar" ? "en" : "ar";
    try { localStorage.setItem("lang", lang); } catch (e) {}
    applyRoot();
    busy = true;
    try { translateAll(); } finally { busy = false; }
    window.dispatchEvent(new Event("langchange"));
  });
})();
