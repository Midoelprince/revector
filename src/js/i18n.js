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
    "Download": "تصدير",
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
    "Crispest": "الأحدّ"
  };
  var EN = {};
  for (var k in AR) if (Object.prototype.hasOwnProperty.call(AR, k)) EN[AR[k]] = k;

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
    }
    var c = root.firstChild;
    while (c) { walk(c); c = c.nextSibling; }
  }
  function translateAll() {
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
