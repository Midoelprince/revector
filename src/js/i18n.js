/* Revector Arabic layer: hardcoded dictionary, right-to-left flip, no network. */
(function () {
  var AR = {
    /* Header, menus, footer */
    "Skip to content": "تخطَّ إلى المحتوى",
    "Menu": "القائمة",
    "Product": "المنتج",
    "Company": "الشركة",
    "About": "حول",
    "Terms": "الشروط",
    "Privacy": "الخصوصية",
    "Converters": "المحوِّلات",
    "Convert PNG to SVG": "تحويل PNG إلى SVG",
    "Convert JPG to SVG": "تحويل JPG إلى SVG",
    "© Revector Studio": "© استوديو Revector",
    "Developer Overview": "نظرة عامة للمطورين",
    "Documentation": "التوثيق",
    "Error Responses": "رسائل الأخطاء",

    /* Home page */
    "Vectors": "متجهات",
    "Zoom": "تكبير",
    "How It Works": "كيف يعمل",
    "FAQ": "الأسئلة الشائعة",

    /* 1.3.0: Revector's own site text */
    "Image to vector converter · free and offline": "محوِّل الصور إلى متجهات · مجاني ويعمل دون إنترنت",
    "Pixels in.": "بكسلات تدخل،",
    "Clean paths out.": "ومسارات نظيفة تخرج.",
    "Revector redraws PNG, JPG, GIF, BMP and WebP pictures as editable SVG, PDF, EPS and DXF files. It works entirely on your own computer: no account, no upload and no watermark.": "يعيد Revector رسم صور PNG وJPG وGIF وBMP وWebP كملفات SVG وPDF وEPS وDXF قابلة للتحرير. يعمل بالكامل على جهازك: بلا حساب، وبلا رفع ملفات، وبلا علامة مائية.",
    "Choose a picture to convert": "اختر صورة لتحويلها",
    "Drop a picture here": "أفلت صورة هنا",
    "or paste it with": "أو الصقها باستخدام",
    "Open picture": "افتح صورة",
    "Opens PNG · JPG · GIF · BMP · WebP. Saves SVG · PDF · EPS · DXF · PNG": "يفتح PNG · JPG · GIF · BMP · WebP. ويحفظ SVG · PDF · EPS · DXF · PNG",
    "Choose a picture file": "اختر ملف صورة",
    "Free and open source. Your pictures never leave this computer.": "مجاني ومفتوح المصدر. صورك لا تغادر هذا الجهاز أبدًا.",
    "Not sure yet? Open one of the examples first.": "لست متأكدًا بعد؟ افتح أحد الأمثلة أولًا.",
    "Before and after: the original pixels on one side of the line, the traced vectors on the other. The round lens shows the traced paths drawn over the pixels.": "قبل وبعد: البكسلات الأصلية على جانب من الخط، والمتجهات المتتبَّعة على الجانب الآخر. وتعرض العدسة الدائرية المسارات مرسومة فوق البكسلات.",
    "Open in editor": "افتح في المحرر",
    "What you get back": "ما الذي تحصل عليه",
    "Revector doesn't just follow the edges of the pixels. It sorts out the colors, finds the corners, and draws each outline with as few points as it can.": "لا يكتفي Revector بتتبّع حواف البكسلات، بل يرتّب الألوان ويحدد الزوايا ويرسم كل حدّ بأقل عدد ممكن من النقاط.",
    "True circles and boxes": "دوائر ومستطيلات حقيقية",
    "When an outline is close to a circle, an ellipse, a rectangle or a rounded rectangle, Revector puts in that exact shape. A round dot becomes a real circle you can resize.": "عندما يقترب حدّ ما من دائرة أو شكل بيضوي أو مستطيل أو مستطيل مدوّر الزوايا، يضع Revector ذلك الشكل نفسه بدقة. فتصبح النقطة المستديرة دائرة حقيقية يمكنك تغيير حجمها.",
    "Light on anchor points": "نقاط ارتكاز قليلة",
    "Straight runs become single lines, curves become smooth Bézier curves, and corners stay where the picture has them. Less to tidy up in Illustrator or Inkscape.": "المقاطع المستقيمة تصبح خطوطًا مفردة، والمنحنيات تصبح منحنيات بيزيه ناعمة، والزوايا تبقى حيث هي في الصورة. فيقلّ ما تحتاج ترتيبه في إليستريتور أو إنكسكيب.",
    "No gaps between colors": "لا فجوات بين الألوان",
    "Colors that touch are cut along one shared border, so no white hairlines or overlaps show up when you zoom in or print.": "الألوان المتلامسة تُقطع على حدّ مشترك واحد، فلا تظهر خطوط بيضاء رفيعة ولا تداخلات عند التكبير أو الطباعة.",
    "Open": "افتح",
    "Drop a picture onto the page, paste it, or browse for one. It is read on your computer and never uploaded.": "أفلت صورة على الصفحة، أو الصقها، أو اخترها من جهازك. تُقرأ على حاسوبك ولا تُرفع أبدًا.",
    "A PNG or JPEG is a grid of colored squares. Revector reads that grid and works out the shapes behind it.": "صورة PNG أو JPEG هي شبكة من المربعات الملوّنة. يقرأ Revector هذه الشبكة ويستنتج الأشكال التي تقف خلفها.",
    "Adjust": "عدّل",
    "A first result appears within seconds, with no settings to choose.": "تظهر نتيجة أولى خلال ثوانٍ، دون إعدادات تختارها.",
    "Compare it with the original, zoom right in, change the number of colors, merge or recolor them, and remove shapes you don't want. Undo is always one click away.": "قارنها بالأصل، وكبّر قدر ما تشاء، وغيّر عدد الألوان، وادمجها أو أعد تلوينها، واحذف الأشكال التي لا تريدها. والتراجع دائمًا على بُعد نقرة واحدة.",
    "Save": "احفظ",
    "Pick a format and save. Every export is free and has no watermark.": "اختر صيغة واحفظ. كل تصدير مجاني وبلا علامة مائية.",
    "SVG, PDF, EPS and DXF for design, print and cutting machines, or PNG for a cleaned-up picture.": "SVG وPDF وEPS وDXF للتصميم والطباعة وآلات القص، أو PNG لصورة منقّاة.",
    "Where it helps": "أين يفيدك",
    "A few of the jobs Revector is good at.": "بعض الأعمال التي يجيدها Revector.",
    "Old logos": "الشعارات القديمة",
    "Only have a logo as a small JPEG from an email signature? Redraw it as an EPS, PDF or SVG you can print at any size.": "ليس لديك من شعارك إلا صورة JPEG صغيرة من توقيع بريد إلكتروني؟ أعد رسمه كملف EPS أو PDF أو SVG تطبعه بأي حجم.",
    "Generated artwork": "الصور المولَّدة",
    "Pictures from image generators usually have flat colors, so they trace cleanly into stickers, icons and t-shirt prints.": "صور مولِّدات الصور غالبًا بألوان مسطّحة، فتتحول بنظافة إلى ملصقات وأيقونات وطبعات قمصان.",
    "Vinyl and print cutting": "قص الفينيل والطباعة",
    "Make a multi-color SVG for Cricut, Silhouette or screen printing, with solid shapes that are easy to weed.": "اصنع ملف SVG متعدد الألوان لكريكت أو سيلويت أو الطباعة الحريرية، بأشكال مصمتة يسهل تقشيرها.",
    "Laser and CNC": "الليزر وCNC",
    "DXF files hold the outline of every shape as closed paths, ready for laser, plasma and CNC software such as LightBurn.": "ملفات DXF تحمل حدود كل شكل كمسارات مغلقة، جاهزة لبرامج الليزر والبلازما وCNC مثل LightBurn.",
    "Drawings and diagrams": "الرسومات والمخططات",
    "Scan an ink drawing, a signature or a hand-drawn diagram and get clean line art back.": "امسح رسمًا بالحبر أو توقيعًا أو مخططًا مرسومًا باليد، واحصل على رسم خطي نظيف.",
    "Small icons": "الأيقونات الصغيرة",
    "Tiny icons and pixelated pictures are smoothed before tracing, so stair-stepped edges come out as clean curves.": "الأيقونات الصغيرة والصور المتكسّرة تُنعَّم قبل التتبّع، فتخرج الحواف المدرّجة كمنحنيات نظيفة.",
    "Why it runs on your computer": "لماذا يعمل على جهازك",
    "Most converters ask you to upload your picture to their server. Revector does all the work on your own machine.": "أغلب المحوِّلات تطلب منك رفع صورتك إلى خوادمها. أما Revector فينجز العمل كله على جهازك.",
    "It works without an internet connection, there is no limit on how many pictures you convert, and client logos or private sketches never pass through anyone else's hands.": "يعمل دون اتصال بالإنترنت، ولا حدّ لعدد الصور التي تحوّلها، وشعارات عملائك أو رسوماتك الخاصة لا تمرّ بيد أحد غيرك.",
    "Revector is open source under the MIT License, so anyone can read exactly what it does with your files.": "Revector مفتوح المصدر برخصة MIT، فيمكن لأي شخص أن يقرأ بالضبط ما يفعله بملفاتك.",
    "Under the hood": "ما تحت الغطاء",
    "Curve fitting": "مطابقة المنحنيات",
    "Lines and Bézier curves, fitted by least squares": "خطوط ومنحنيات بيزيه بطريقة المربعات الصغرى",
    "Small-picture cleanup": "تنظيف الصور الصغيرة",
    "Low-resolution pictures are rebuilt first": "الصور منخفضة الدقة يُعاد بناؤها أولًا",
    "Shared borders": "حدود مشتركة",
    "One edge between two colors": "حدّ واحد بين كل لونين",
    "Corner detection": "اكتشاف الزوايا",
    "Sharp where the picture is sharp": "حادة حيث تكون الصورة حادة",
    "Background tracing": "تتبّع في الخلفية",
    "The window never freezes": "النافذة لا تتجمد أبدًا",
    "Mirror symmetry": "التماثل المرآتي",
    "Matching left and right halves": "نصفان أيمن وأيسر متطابقان",
    "Color editing": "تحرير الألوان",
    "Merge, recolor or cut out": "دمج أو إعادة تلوين أو اقتطاع",
    "Five formats": "خمس صيغ",
    "SVG · PDF · EPS · DXF · PNG": "SVG · PDF · EPS · DXF · PNG",
    "Is Revector really free?": "هل Revector مجاني فعلًا؟",
    "Yes. Converting and saving cost nothing, there is no account to make, and the files have no watermark.": "نعم. التحويل والحفظ لا يكلّفان شيئًا، ولا حساب تحتاج إنشاءه، والملفات بلا علامة مائية.",
    "Are my pictures uploaded anywhere?": "هل تُرفع صوري إلى أي مكان؟",
    "No. Pictures are read and traced on your computer and are never sent over the internet.": "لا. تُقرأ الصور وتُتتبَّع على جهازك ولا تُرسَل عبر الإنترنت أبدًا.",
    "Which files can I open and save?": "ما الملفات التي يمكنني فتحها وحفظها؟",
    "Open PNG, JPG, GIF, BMP or WebP. Save SVG, PDF, EPS, DXF or PNG.": "افتح PNG أو JPG أو GIF أو BMP أو WebP. واحفظ SVG أو PDF أو EPS أو DXF أو PNG.",
    "What kind of pictures work best?": "ما نوع الصور الأنسب؟",
    "Logos, icons, flat illustrations, cartoons and line drawings with clear colors. Photos can be traced too, but they come out as a poster-style picture with a limited number of colors.": "الشعارات والأيقونات والرسوم المسطّحة والكرتون والرسوم الخطية ذات الألوان الواضحة. يمكن تتبّع الصور الفوتوغرافية أيضًا، لكنها تخرج بأسلوب الملصقات وبعدد محدود من الألوان.",
    "How large can a picture be?": "ما أكبر حجم للصورة؟",
    "Any size opens. Pictures bigger than 4096 pixels on their longest side are scaled down before tracing, so crop to the part you need to keep the most detail.": "تُفتح الصور بأي حجم. الصور التي يتجاوز ضلعها الأطول 4096 بكسل تُصغَّر قبل التتبّع، لذا اقتصص الجزء الذي تحتاجه لتحافظ على أكبر قدر من التفاصيل.",
    "Does it keep transparent backgrounds?": "هل يحافظ على الخلفيات الشفافة؟",
    "Yes. Transparent areas stay empty in the result. You can also make any color transparent, or remove the background with one checkbox.": "نعم. المناطق الشفافة تبقى فارغة في النتيجة. ويمكنك أيضًا جعل أي لون شفافًا، أو إزالة الخلفية بخانة اختيار واحدة.",
    "Can I make files for Cricut, laser cutters or CNC?": "هل يمكنني صنع ملفات لكريكت أو قواطع الليزر أو CNC؟",
    "Yes. Save SVG for Cricut and vinyl cutters, or DXF for laser and CNC software.": "نعم. احفظ SVG لكريكت وقواطع الفينيل، أو DXF لبرامج الليزر وCNC.",
    "Will the files open in my design software?": "هل تُفتح الملفات في برامج التصميم لديّ؟",
    "They are standard SVG, PDF, EPS and DXF files, which Illustrator, Inkscape, CorelDRAW, Affinity Designer and most cutting programs can open.": "هي ملفات SVG وPDF وEPS وDXF قياسية، يفتحها إليستريتور وإنكسكيب وكوريل درو وأفينيتي ديزاينر وأغلب برامج القص.",
    "Who owns the results?": "لمن تعود ملكية النتائج؟",
    "You do. Revector makes no claim on your pictures or the files you save. Just make sure you have the right to use the original picture.": "لك أنت. لا يدّعي Revector أي حق في صورك أو الملفات التي تحفظها. فقط تأكد أن لديك حق استخدام الصورة الأصلية.",
    "How do I get updates?": "كيف أحصل على التحديثات؟",
    "The installed app checks for updates when it starts, or click Check for Updates at the top of the window. The portable version doesn't update itself, so download the newest one from the Releases page.": "التطبيق المثبَّت يتحقق من التحديثات عند تشغيله، أو انقر «التحقق من التحديثات» أعلى النافذة. النسخة المحمولة لا تحدّث نفسها، فنزّل أحدث نسخة من صفحة الإصدارات.",
    "Got a picture to convert?": "لديك صورة تريد تحويلها؟",
    "Drop it anywhere on this page, or open it here.": "أفلتها في أي مكان على هذه الصفحة، أو افتحها من هنا.",
    "For everyone who would rather not redraw a logo by hand.": "لكل من يفضّل ألّا يعيد رسم شعار بيده.",
    "Converter": "المحوِّل",
    "Adjust the result": "عدّل النتيجة",
    "Make the background transparent.": "اجعل الخلفية شفافة.",
    "How many colors, and which ones.": "كم لونًا، وأي الألوان.",
    "Exact shapes, symmetry, detail and layering.": "الأشكال الدقيقة والتماثل والتفاصيل والطبقات.",
    "How sharp or round the corners come out.": "مدى حدّة الزوايا أو استدارتها.",

    /* App controls */
    "Download": "تنزيل",
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
    "Pixels and vectors divider": "الفاصل بين البكسلات والمتجهات",

    /* Sections and cards */

    /* FAQ answers */

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
    "Regions": "المناطق",
    "Remove individual shapes or crop the picture.": "احذف أشكالًا مفردة أو اقتصص الصورة.",
    "Geometry": "الهندسة",
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
  var AR_HTML = {};

  /* Example pictures in the showcase: their names appear in tooltips and screen-reader labels. */
  var EXAMPLES = {
    "lighthouse": "منارة", "fox": "ثعلب", "cactus": "صبّار", "rocket": "صاروخ",
    "whale": "حوت", "retro sun": "شمس الغروب", "camera icon": "أيقونة كاميرا", "bicycle": "درّاجة",
    "pizza": "بيتزا", "camping badge": "شارة التخييم", "calligraphy": "خط عربي", "mascot": "تميمة"
  };
  for (var ex in EXAMPLES) if (Object.prototype.hasOwnProperty.call(EXAMPLES, ex)) {
    AR[ex] = EXAMPLES[ex];
    AR["Show example: " + ex] = "عرض المثال: " + EXAMPLES[ex];
  }
  AR["Main"] = "القائمة الرئيسية";

  /* Desktop app: updates and saved files */
  var DESKTOP_AR = {
    "Check for Updates": "التحقق من التحديثات",
    "Checking…": "جارٍ التحقق…",
    "Current version": "الإصدار الحالي",
    "Dismiss": "إغلاق",
    "Download progress": "تقدّم التنزيل",
    "Update available": "يتوفر تحديث",
    "You have": "لديك",
    "Click to download.": "انقر للتنزيل.",
    "Downloading…": "جارٍ التنزيل…",
    "Restart to update": "أعد التشغيل للتحديث",
    "Restarting…": "جارٍ إعادة التشغيل…",
    "Installs the update and starts Revector again. Save your work first.": "يثبّت التحديث ويعيد تشغيل Revector. احفظ عملك أولًا.",
    "Checking for updates…": "جارٍ التحقق من التحديثات…",
    "You're up to date": "لديك أحدث إصدار",
    "the newest version.": "هو أحدث إصدار.",
    "Updates aren't available here": "التحديثات غير متاحة هنا",
    "Updates work in the installed app. This is a development run.": "التحديثات تعمل في التطبيق المثبَّت فقط. هذا تشغيل تجريبي.",
    "The portable version can't update itself. Download the newest one, or use the installer.": "النسخة المحمولة لا تحدّث نفسها. نزّل أحدث نسخة أو استخدم المثبِّت.",
    "The updater isn't part of this build.": "أداة التحديث غير مضمَّنة في هذه النسخة.",
    "Couldn't update": "تعذّر التحديث",
    "Check your internet connection and try again.": "تحقق من اتصالك بالإنترنت ثم حاول مجددًا.",
    "Try Again": "حاول مجددًا",
    "File saved": "تم حفظ الملف",
    "Couldn't save the file": "تعذّر حفظ الملف",
    "Show in Folder": "إظهار في المجلد",
    "Open File": "فتح الملف"
  };
  for (var dk in DESKTOP_AR) if (Object.prototype.hasOwnProperty.call(DESKTOP_AR, dk)) AR[dk] = DESKTOP_AR[dk];

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
