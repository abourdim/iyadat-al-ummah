/* ══════════════════════════════════════════════
   عيادة الأمة — The Ummah Clinic — app.js
   Based on "علل وأدوية" by Sheikh Mohammed al-Ghazali
   ══════════════════════════════════════════════ */

// ─── STATE ───
let currentLang = localStorage.getItem('ummahClinicLang') || 'ar';
let currentTheme = localStorage.getItem('ummahClinicTheme') || 'clinic';
let quizState = JSON.parse(localStorage.getItem('ummahClinicQuiz') || 'null');
let audioCtx = null;

// ─── i18n DATA ───
const T = {
  // App titles
  appTitle: { ar: 'عيادة الأمة', en: 'The Ummah Clinic', fr: 'La Clinique de la Oumma' },
  appSub: {
    ar: 'تشخيص روحي لعلل الأمة وأدويتها — مستوحى من كتاب "علل وأدوية" للشيخ محمد الغزالي',
    en: 'A spiritual diagnosis of the Ummah\'s ailments & remedies — Inspired by "Ailments & Remedies" by Sheikh Mohammed al-Ghazali',
    fr: 'Diagnostic spirituel des maux de la Oumma et leurs remedes — Inspire du livre "Maux et Remedes" de Cheikh Mohammed al-Ghazali'
  },
  splashHint: { ar: 'اضغط للتخطي', en: 'tap to skip', fr: 'toucher pour passer' },
  verseTrans: {
    ar: '',
    en: 'Be not like those who forgot God, so He made them forget themselves (59:19)',
    fr: 'Ne soyez pas comme ceux qui ont oublie Dieu et qu\'Il a fait oublier a eux-memes (59:19)'
  },

  // Tabs
  tabHome: { ar: 'الرئيسية', en: 'Home', fr: 'Accueil' },
  tabAilments: { ar: 'العلل', en: 'Ailments', fr: 'Maux' },
  tabRemedies: { ar: 'الأدوية', en: 'Remedies', fr: 'Remedes' },
  tabQuiz: { ar: 'تشخيص', en: 'Diagnosis', fr: 'Diagnostic' },
  tabAbout: { ar: 'الكتاب', en: 'Book', fr: 'Livre' },

  // Themes
  themeNames: {
    clinic: { ar: 'عيادة', en: 'Clinic', fr: 'Clinique' },
    night: { ar: 'ليل', en: 'Night', fr: 'Nuit' },
    healing: { ar: 'شفاء', en: 'Healing', fr: 'Guerison' }
  },
  themeIcons: { clinic: '\u{1F3E5}', night: '\u{1F319}', healing: '\u{1F33F}' },

  // Home page
  homeTitle: { ar: 'غرفة الاستقبال', en: 'Reception Room', fr: 'Salle d\'accueil' },
  homeDesc: {
    ar: 'مرحبا بك في عيادة الأمة. هنا نشخّص الأمراض التي تصيب مجتمعنا، ونصف الأدوية التي وصفها الشيخ محمد الغزالي. مجتمعنا مريض — هذا هو التشخيص — وهذا هو الدواء.',
    en: 'Welcome to the Ummah Clinic. Here we diagnose the diseases affecting our community and prescribe the remedies described by Sheikh Mohammed al-Ghazali. Our community is sick — here is the diagnosis — and here is the medicine.',
    fr: 'Bienvenue a la Clinique de la Oumma. Ici nous diagnostiquons les maladies qui affectent notre communaute et prescrivons les remedes decrits par Cheikh Mohammed al-Ghazali. Notre communaute est malade — voici le diagnostic — et voici le remede.'
  },

  // Blind driver
  blindDriverTitle: {
    ar: 'تشبيه السائق الأعمى',
    en: 'The Blind Driver Analogy',
    fr: 'L\'analogie du conducteur aveugle'
  },
  blindDriverText: {
    ar: 'يقول الشيخ الغزالي: ما فائدة قوانين المرور لسائق أعمى؟ إنه لا يرى الطريق أصلا. هكذا هو حال الأمة عندما تفرغ قلوبها من ذكر الله — كل الإصلاحات الخارجية لن تنفع إذا كان الداخل مريضا.',
    en: 'Sheikh al-Ghazali asks: What use are traffic rules for a blind driver? He cannot see the road at all. This is the state of the Ummah when hearts are emptied of God-consciousness — all external reforms are useless when the internal condition is diseased.',
    fr: 'Cheikh al-Ghazali demande : A quoi servent les regles de circulation pour un conducteur aveugle ? Il ne peut pas voir la route. C\'est l\'etat de la Oumma quand les coeurs sont vides de conscience divine — toutes les reformes exterieures sont inutiles quand la condition interieure est malade.'
  },
  blindDriverAnalogy: {
    ar: 'القلوب الفارغة من ذكر الله هي أصل كل العلل. كما أن السائق الأعمى لا تنفعه إشارات المرور، فإن المجتمع الذي فقد صلته بالله لا تنفعه القوانين والأنظمة.',
    en: 'Hearts emptied of God-consciousness are the root of ALL ailments. Just as traffic signals are useless for a blind driver, laws and systems cannot help a society that has lost its connection with God.',
    fr: 'Les coeurs vides de conscience divine sont la racine de TOUS les maux. Tout comme les feux de circulation sont inutiles pour un conducteur aveugle, les lois et systemes ne peuvent pas aider une societe qui a perdu sa connexion avec Dieu.'
  },
  blindDriverBlind: {
    ar: 'أعمى — لا يرى الطريق',
    en: 'Blind — Cannot see the road',
    fr: 'Aveugle — Ne voit pas la route'
  },
  blindDriverSeeing: {
    ar: 'بصير — يرى بنور الله',
    en: 'Seeing — Guided by God\'s light',
    fr: 'Voyant — Guide par la lumiere divine'
  },
  blindDriverSliderLabel: {
    ar: 'حرّك المؤشر: من العمى إلى البصيرة',
    en: 'Move the slider: from blindness to insight',
    fr: 'Deplacez le curseur : de la cecite a la clairvoyance'
  },
  blindDriverStateBlind: {
    ar: 'قوانين بلا بصيرة = فوضى. الإصلاح بلا إيمان كالسراب.',
    en: 'Rules without insight = chaos. Reform without faith is a mirage.',
    fr: 'Des regles sans clairvoyance = chaos. La reforme sans foi est un mirage.'
  },
  blindDriverStateDim: {
    ar: 'بداية الوعي. ضوء خافت لكنه لا يكفي لرؤية الطريق بوضوح.',
    en: 'Beginning of awareness. Dim light, but not enough to see the road clearly.',
    fr: 'Debut de la conscience. Lumiere faible, mais pas assez pour voir la route clairement.'
  },
  blindDriverStatePartial: {
    ar: 'رؤية جزئية. الإيمان يعمل لكن يحتاج تعميقا وتطبيقا.',
    en: 'Partial vision. Faith is working but needs deepening and application.',
    fr: 'Vision partielle. La foi fonctionne mais necessite un approfondissement.'
  },
  blindDriverStateSeeing: {
    ar: 'بصيرة كاملة. القلب حي بذكر الله — الإصلاح ينبع من الداخل.',
    en: 'Full insight. The heart is alive with God-consciousness — reform springs from within.',
    fr: 'Pleine clairvoyance. Le coeur est vivant de conscience divine — la reforme jaillit de l\'interieur.'
  },

  // Stats
  statAilments: { ar: 'علة', en: 'Ailments', fr: 'Maux' },
  statRemedies: { ar: 'دواء', en: 'Remedies', fr: 'Remedes' },
  statCategories: { ar: 'فئات', en: 'Categories', fr: 'Categories' },
  statPages: { ar: 'صفحة', en: 'Pages', fr: 'Pages' },

  // Quick nav
  qnavAilments: { ar: 'اكتشف العلل', en: 'Explore Ailments', fr: 'Explorer les Maux' },
  qnavRemedies: { ar: 'اكتشف الأدوية', en: 'Explore Remedies', fr: 'Explorer les Remedes' },
  qnavQuiz: { ar: 'ابدأ التشخيص', en: 'Start Diagnosis', fr: 'Commencer le Diagnostic' },
  qnavAbout: { ar: 'عن الكتاب', en: 'About the Book', fr: 'A propos du Livre' },

  // Daily prescription
  dailyPrescTitle: { ar: 'الوصفة اليومية', en: 'Daily Prescription', fr: 'Prescription du Jour' },
  dailyPrescAilment: { ar: 'العلة', en: 'Today\'s Ailment', fr: 'Le Mal du Jour' },
  dailyPrescRemedy: { ar: 'الدواء', en: 'Today\'s Remedy', fr: 'Le Remede du Jour' },

  // Ailment card labels
  whatItLooks: { ar: 'كيف يبدو في حياتنا اليومية', en: 'What it looks like in daily life', fr: 'A quoi cela ressemble au quotidien' },
  whyDangerous: { ar: 'تشخيص الغزالي: لماذا هو خطير', en: 'Al-Ghazali\'s diagnosis: Why it\'s dangerous', fr: 'Diagnostic d\'al-Ghazali : Pourquoi c\'est dangereux' },
  prescribedRemedy: { ar: 'الدواء الموصوف', en: 'Prescribed remedy', fr: 'Remede prescrit' },
  seeRemedy: { ar: 'انظر الدواء', en: 'See Remedy', fr: 'Voir le Remede' },

  // Remedy card labels
  howItHeals: { ar: 'كيف يشفي', en: 'How it heals', fr: 'Comment cela guerit' },
  practicalSteps: { ar: 'خطوات عملية', en: 'Practical steps', fr: 'Etapes pratiques' },

  // Share
  shareCard: { ar: 'مشاركة', en: 'Share', fr: 'Partager' },
  shareCopied: { ar: 'تم نسخ النص', en: 'Text copied', fr: 'Texte copie' },

  // Quiz
  quizTitle: { ar: 'التشخيص الذاتي', en: 'Self-Diagnosis', fr: 'Auto-diagnostic' },
  quizDesc: {
    ar: 'أجب عن هذه الأسئلة بصدق لتعرف أي العلل تؤثر عليك أكثر. هذا ليس اختبارا — إنه مرآة.',
    en: 'Answer these questions honestly to discover which ailments affect you most. This is not a test — it is a mirror.',
    fr: 'Repondez a ces questions honnetement pour decouvrir quels maux vous affectent le plus. Ce n\'est pas un test — c\'est un miroir.'
  },
  quizStart: { ar: 'ابدأ التشخيص', en: 'Start Diagnosis', fr: 'Commencer' },
  quizNext: { ar: 'التالي', en: 'Next', fr: 'Suivant' },
  quizPrev: { ar: 'السابق', en: 'Previous', fr: 'Precedent' },
  quizSubmit: { ar: 'أظهر النتائج', en: 'Show Results', fr: 'Voir les Resultats' },
  quizResultTitle: { ar: 'نتائج تشخيصك', en: 'Your Diagnosis Results', fr: 'Resultats de votre Diagnostic' },
  quizReset: { ar: 'إعادة التشخيص', en: 'Retake Diagnosis', fr: 'Refaire le Diagnostic' },
  quizHigh: { ar: 'يحتاج علاجا عاجلا', en: 'Needs urgent treatment', fr: 'Necessite un traitement urgent' },
  quizMedium: { ar: 'يحتاج انتباها', en: 'Needs attention', fr: 'Necessite de l\'attention' },
  quizLow: { ar: 'حالة جيدة', en: 'Good condition', fr: 'Bonne condition' },
  quizOf: { ar: 'من', en: 'of', fr: 'de' },
  quizQuestion: { ar: 'السؤال', en: 'Question', fr: 'Question' },
  quizCatProgress: { ar: 'التقدم حسب الفئة', en: 'Progress by Category', fr: 'Progres par Categorie' },

  // About
  aboutBookTitle: { ar: 'عن الكتاب', en: 'About the Book', fr: 'A propos du Livre' },
  aboutAuthorTitle: { ar: 'عن المؤلف', en: 'About the Author', fr: 'A propos de l\'Auteur' },
  aboutDisclaimerTitle: { ar: 'إخلاء مسؤولية', en: 'Disclaimer', fr: 'Avertissement' },
  aboutSourcesTitle: { ar: 'المصادر', en: 'Sources', fr: 'Sources' },

  aboutBook: {
    ar: 'كتاب "علل وأدوية" للشيخ محمد الغزالي هو تشخيص روحي شامل لأمراض الأمة الإسلامية. يتناول الكتاب خمسة محاور رئيسية: الأمراض الروحية والسياسية والفكرية والاجتماعية والاقتصادية، ويقدم لكل منها العلاج المناسب من منظور إسلامي.',
    en: '"Ailments & Remedies" by Sheikh Mohammed al-Ghazali is a comprehensive spiritual diagnosis of the Muslim Ummah\'s diseases. The book addresses five main areas: spiritual, political, intellectual, social, and economic ailments, offering appropriate treatments from an Islamic perspective.',
    fr: '"Maux et Remedes" de Cheikh Mohammed al-Ghazali est un diagnostic spirituel complet des maladies de la Oumma musulmane. Le livre aborde cinq domaines principaux : les maux spirituels, politiques, intellectuels, sociaux et economiques, offrant des traitements appropries dans une perspective islamique.'
  },
  aboutAuthor: {
    ar: 'الشيخ محمد الغزالي (1917-1996) عالم ومفكر إسلامي مصري من أبرز علماء القرن العشرين. عُرف بجرأته في نقد الأوضاع السياسية والاجتماعية، وبدعوته إلى تجديد الفكر الإسلامي. ألّف أكثر من 60 كتابا في الفكر والدعوة.',
    en: 'Sheikh Mohammed al-Ghazali (1917-1996) was an Egyptian Islamic scholar and thinker, one of the most prominent of the 20th century. Known for his boldness in critiquing political and social conditions, and his call for renewing Islamic thought. He authored over 60 books on Islamic thought and outreach.',
    fr: 'Cheikh Mohammed al-Ghazali (1917-1996) etait un erudit et penseur islamique egyptien, l\'un des plus eminents du 20e siecle. Connu pour son audace a critiquer les conditions politiques et sociales, et son appel au renouveau de la pensee islamique. Il a ecrit plus de 60 livres.'
  },
  aboutDisclaimer: {
    ar: 'أنا لست عالما. هذا جهد متواضع من أب مسلم. المحتوى مستمد من الكتاب ومصادر إسلامية موثوقة. هذا ليس فتوى. استشر أهل العلم.',
    en: 'I am not a scholar. This is a humble effort by a Muslim parent. Content is from the book and trusted Islamic sources. This is not a fatwa. Consult scholars for rulings.',
    fr: 'Je ne suis pas un erudit. Ceci est un humble effort d\'un parent musulman. Le contenu provient du livre et de sources islamiques fiables. Ceci n\'est pas une fatwa. Consultez les savants.'
  },
  aboutSources: {
    ar: 'كتاب "علل وأدوية" — محمد الغزالي | القرآن الكريم | ',
    en: '"Ailments & Remedies" — Mohammed al-Ghazali | The Holy Quran | ',
    fr: '"Maux et Remedes" — Mohammed al-Ghazali | Le Saint Coran | Application reconstruite avec l\'aide de l\'IA'
  },

  // Help
  helpTitle: { ar: 'المساعدة', en: 'Help', fr: 'Aide' },
  helpDisclaimer: { ar: 'إخلاء مسؤولية', en: 'Disclaimer', fr: 'Avertissement' },
  helpNav: { ar: 'التنقل', en: 'Navigation', fr: 'Navigation' },
  helpThemes: { ar: 'السمات', en: 'Themes', fr: 'Themes' },
  helpContrib: { ar: 'المساهمة', en: 'Contributing', fr: 'Contribuer' },

  // Dua panel
  duaTitle: { ar: 'أدعية الشفاء', en: 'Healing Duas', fr: 'Duas de Guerison' },

  // Toast
  toastTheme: { ar: 'تم تغيير السمة', en: 'Theme changed', fr: 'Theme change' },
  toastLang: { ar: 'تم تغيير اللغة', en: 'Language changed', fr: 'Langue changee' },
  toastQuizSaved: { ar: 'تم حفظ إجاباتك', en: 'Answers saved', fr: 'Reponses sauvegardees' },
  toastQuizReset: { ar: 'تم إعادة التشخيص', en: 'Diagnosis reset', fr: 'Diagnostic reinitialise' },

  // Category names
  catSpiritual: { ar: 'العلل الروحية', en: 'Spiritual Ailments', fr: 'Maux Spirituels' },
  catPolitical: { ar: 'العلل السياسية', en: 'Political Ailments', fr: 'Maux Politiques' },
  catIntellectual: { ar: 'العلل الفكرية', en: 'Intellectual Ailments', fr: 'Maux Intellectuels' },
  catSocial: { ar: 'العلل الاجتماعية', en: 'Social Ailments', fr: 'Maux Sociaux' },
  catEconomic: { ar: 'العلل الاقتصادية', en: 'Economic Ailments', fr: 'Maux Economiques' },

  catSpiritualRem: { ar: 'الأدوية الروحية', en: 'Spiritual Remedies', fr: 'Remedes Spirituels' },
  catPoliticalRem: { ar: 'الأدوية السياسية', en: 'Political Remedies', fr: 'Remedes Politiques' },
  catIntellectualRem: { ar: 'الأدوية الفكرية', en: 'Intellectual Remedies', fr: 'Remedes Intellectuels' },
  catSocialRem: { ar: 'الأدوية الاجتماعية', en: 'Social Remedies', fr: 'Remedes Sociaux' },
  catEconomicRem: { ar: 'الأدوية الاقتصادية', en: 'Economic Remedies', fr: 'Remedes Economiques' },

  // Search
  searchPlaceholder: { ar: 'بحث...', en: 'Search...', fr: 'Rechercher...' },
};

// ─── AILMENTS DATA ───
const ailmentsData = [
  // === SPIRITUAL ===
  {
    cat: 'spiritual', icon: '\u{1F494}', emoji: '\u{1FAB9}',
    name: { ar: 'خواء القلوب من ذكر الله', en: 'Hearts emptied of God-consciousness', fr: 'Coeurs vides de conscience divine' },
    daily: {
      ar: 'تجد الناس يصلون ويصومون لكن بلا خشوع ولا تدبر. الصلاة حركات بلا روح، والصيام جوع بلا تقوى. القلب غافل وإن كان الجسد يؤدي الشعائر.',
      en: 'People pray and fast but without reverence or reflection. Prayer becomes mere motions without spirit, fasting becomes hunger without piety. The heart is heedless even as the body performs rituals.',
      fr: 'Les gens prient et jeunent mais sans reverence ni reflexion. La priere devient de simples mouvements sans esprit, le jeune devient la faim sans piete. Le coeur est insouciant meme quand le corps accomplit les rites.'
    },
    diagnosis: {
      ar: 'يرى الغزالي أن هذا هو أصل كل العلل. عندما يفرغ القلب من ذكر الله، تدخله أمراض الدنيا: الحسد والكبر وحب المال. القلب الفارغ كالبيت المهجور — تسكنه الحشرات والأفاعي.',
      en: 'Al-Ghazali sees this as the ROOT of all ailments. When the heart empties of God-consciousness, worldly diseases enter: envy, arrogance, love of wealth. An empty heart is like an abandoned house — insects and snakes take residence.',
      fr: 'Al-Ghazali voit cela comme la RACINE de tous les maux. Quand le coeur se vide de la conscience divine, les maladies mondaines y entrent : envie, arrogance, amour de la richesse. Un coeur vide est comme une maison abandonnee.'
    },
    remedy: {
      ar: 'ملء القلب بالتقوى وذكر الله الحقيقي — ليس تكرار الكلمات بل حضور القلب مع الله في كل لحظة.',
      en: 'Fill the heart with true God-consciousness (taqwa) — not mere repetition of words but the heart being present with God in every moment.',
      fr: 'Remplir le coeur de vraie conscience divine (taqwa) — pas la simple repetition de mots mais le coeur present avec Dieu a chaque instant.'
    },
    verse: '\u0623\u064E\u0644\u064E\u0627 \u0628\u0650\u0630\u0650\u0643\u0652\u0631\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u062A\u064E\u0637\u0652\u0645\u064E\u0626\u0650\u0646\u0651\u064F \u0627\u0644\u0652\u0642\u064F\u0644\u064F\u0648\u0628\u064F',
    verseRef: { ar: 'الرعد: 28', en: 'Ar-Ra\'d 13:28', fr: 'Ar-Ra\'d 13:28' }
  },
  {
    cat: 'spiritual', icon: '\u{1F3AD}', emoji: '\u{1F3AD}',
    name: { ar: 'العبادات الجوفاء', en: 'Hollow rituals', fr: 'Rituels creux' },
    daily: {
      ar: 'تجد المسجد مليئا بالمصلين لكن الغيبة والنميمة تملأ المجتمع. الناس يتسابقون على الصف الأول لكنهم يغشون في التجارة. العبادة انفصلت عن السلوك.',
      en: 'The mosque is full of worshippers but gossip and backbiting fill the community. People race for the front row but cheat in business. Worship has disconnected from behavior.',
      fr: 'La mosquee est pleine de fideles mais les commerages remplissent la communaute. Les gens se precipitent au premier rang mais trichent en affaires. Le culte s\'est deconnecte du comportement.'
    },
    diagnosis: {
      ar: 'العبادة التي لا تغير السلوك ليست عبادة — إنها عادة. الغزالي يحذر: الله لا ينظر إلى أجسادكم ولا إلى صوركم ولكن ينظر إلى قلوبكم.',
      en: 'Worship that does not change behavior is not worship — it is habit. Al-Ghazali warns: God does not look at your bodies or your forms but looks at your hearts.',
      fr: 'Le culte qui ne change pas le comportement n\'est pas un culte — c\'est une habitude. Al-Ghazali avertit : Dieu ne regarde pas vos corps ou vos formes mais regarde vos coeurs.'
    },
    remedy: {
      ar: 'ربط العبادة بالأخلاق. الصلاة تنهى عن الفحشاء والمنكر. الصيام يعلّم الصبر والرحمة. الحج يعلّم المساواة.',
      en: 'Link worship to ethics. Prayer forbids indecency. Fasting teaches patience and mercy. Hajj teaches equality.',
      fr: 'Lier le culte a l\'ethique. La priere interdit l\'indecence. Le jeune enseigne la patience et la misericorde. Le Hajj enseigne l\'egalite.'
    },
    verse: '\u0625\u0650\u0646\u0651\u064E \u0627\u0644\u0635\u0651\u064E\u0644\u064E\u0627\u0629\u064E \u062A\u064E\u0646\u0652\u0647\u064E\u0649\u0670 \u0639\u064E\u0646\u0650 \u0627\u0644\u0652\u0641\u064E\u062D\u0652\u0634\u064E\u0627\u0621\u0650 \u0648\u064E\u0627\u0644\u0652\u0645\u064F\u0646\u0643\u064E\u0631\u0650',
    verseRef: { ar: 'العنكبوت: 45', en: 'Al-Ankabut 29:45', fr: 'Al-Ankabut 29:45' }
  },
  {
    cat: 'spiritual', icon: '\u{1F921}', emoji: '\u{1F9D4}',
    name: { ar: 'التدين الزائف', en: 'False piety', fr: 'Fausse piete' },
    daily: {
      ar: 'أشخاص يظهرون التدين لكسب احترام الناس أو المناصب. يطيلون اللحى ويقصّرون الثياب لكنهم يظلمون الناس ويأكلون حقوقهم. مظهر بلا جوهر.',
      en: 'People display religiosity to gain respect or positions. They grow beards and shorten garments but oppress people and consume their rights. Appearance without substance.',
      fr: 'Des gens affichent la religiosite pour gagner du respect ou des postes. Ils portent la barbe et raccourcissent les vetements mais oppriment les gens et consomment leurs droits. L\'apparence sans le fond.'
    },
    diagnosis: {
      ar: 'التدين الزائف أخطر من الجهل لأنه يشوّه صورة الدين نفسه. الناس ترى هؤلاء وتظن أن هذا هو الإسلام فتنفر منه.',
      en: 'False piety is more dangerous than ignorance because it distorts the image of religion itself. People see these individuals and think this IS Islam, so they turn away from it.',
      fr: 'La fausse piete est plus dangereuse que l\'ignorance car elle deforme l\'image de la religion elle-meme. Les gens voient ces individus et pensent que C\'EST l\'Islam, alors ils s\'en detournent.'
    },
    remedy: {
      ar: 'الإخلاص لله وحده. مراجعة النية قبل كل عمل. تذكر أن الله يعلم ما تخفي الصدور.',
      en: 'Sincerity to God alone. Review your intention before every action. Remember that God knows what hearts conceal.',
      fr: 'Sincerite envers Dieu seul. Revoir son intention avant chaque action. Se rappeler que Dieu sait ce que les coeurs cachent.'
    },
    verse: '\u064A\u064F\u0631\u064E\u0627\u0621\u064F\u0648\u0646\u064E \u0627\u0644\u0646\u0651\u064E\u0627\u0633\u064E \u0648\u064E\u0644\u064E\u0627 \u064A\u064E\u0630\u0652\u0643\u064F\u0631\u064F\u0648\u0646\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u064E \u0625\u0650\u0644\u0651\u064E\u0627 \u0642\u064E\u0644\u0650\u064A\u0644\u064B\u0627',
    verseRef: { ar: 'النساء: 142', en: 'An-Nisa 4:142', fr: 'An-Nisa 4:142' }
  },
  // NEW: Blaming Satan
  {
    cat: 'spiritual', icon: '\u{1F47F}', emoji: '\u{1F47F}',
    name: { ar: 'إلقاء اللوم على الشيطان بدل تحمل المسؤولية', en: 'Blaming Satan instead of taking responsibility', fr: 'Accuser Satan au lieu de prendre ses responsabilites' },
    daily: {
      ar: 'كلما أخطأ أحدهم قال "الشيطان أغواني" وكأنه لا إرادة له. يرتكب المعاصي ثم يلوم الشيطان بدل أن يراجع نفسه. التهرب من المسؤولية أصبح عادة.',
      en: 'Whenever someone errs they say "Satan tempted me" as if they have no will. They commit sins then blame Satan instead of self-reflection. Evading responsibility has become habitual.',
      fr: 'Chaque fois que quelqu\'un fait une erreur, il dit "Satan m\'a tente" comme s\'il n\'avait pas de volonte. Ils commettent des peches puis accusent Satan au lieu de se remettre en question. L\'evasion de la responsabilite est devenue habituelle.'
    },
    diagnosis: {
      ar: 'يؤكد الغزالي أن الله أعطى الإنسان العقل والإرادة والاختيار. الشيطان يوسوس لكن القرار بيد الإنسان. إلقاء اللوم على الشيطان هروب من مواجهة النفس وتعطيل للعقل الذي كرّم الله به بني آدم.',
      en: 'Al-Ghazali emphasizes that God gave humans reason, will, and choice. Satan whispers, but the decision is in human hands. Blaming Satan is fleeing from self-confrontation and disabling the intellect God honored humanity with.',
      fr: 'Al-Ghazali souligne que Dieu a donne aux humains la raison, la volonte et le choix. Satan chuchote, mais la decision est entre les mains de l\'homme. Accuser Satan, c\'est fuir la confrontation avec soi-meme.'
    },
    remedy: {
      ar: 'تحمل المسؤولية الشخصية عن كل فعل. محاسبة النفس يوميا. الاعتراف بالخطأ أول خطوات الإصلاح.',
      en: 'Take personal responsibility for every action. Hold yourself accountable daily. Admitting fault is the first step toward reform.',
      fr: 'Assumer la responsabilite personnelle de chaque action. Se remettre en question quotidiennement. Admettre ses fautes est le premier pas vers la reforme.'
    },
    verse: '\u0625\u0650\u0646\u0651\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u064E \u0644\u064E\u0627 \u064A\u064F\u063A\u064E\u064A\u0651\u0650\u0631\u064F \u0645\u064E\u0627 \u0628\u0650\u0642\u064E\u0648\u0652\u0645\u064D \u062D\u064E\u062A\u0651\u064E\u0649\u0670 \u064A\u064F\u063A\u064E\u064A\u0651\u0650\u0631\u064F\u0648\u0627 \u0645\u064E\u0627 \u0628\u0650\u0623\u064E\u0646\u0641\u064F\u0633\u0650\u0647\u0650\u0645\u0652',
    verseRef: { ar: 'الرعد: 11', en: 'Ar-Ra\'d 13:11', fr: 'Ar-Ra\'d 13:11' }
  },
  // NEW: Treating backwardness as acceptable
  {
    cat: 'spiritual', icon: '\u{1F614}', emoji: '\u{1F614}',
    name: { ar: 'قبول التخلف كقدر بدل اعتباره ذنبا', en: 'Treating backwardness as fate instead of a sin', fr: 'Accepter le retard comme destin au lieu d\'un peche' },
    daily: {
      ar: 'يقول الناس "هذا قدر الله" عندما يرون تخلف مجتمعاتهم. يستسلمون للفقر والجهل والمرض بحجة القدر، بدل أن يعملوا لتغيير واقعهم.',
      en: 'People say "this is God\'s decree" when they see their societies\' backwardness. They surrender to poverty, ignorance, and disease in the name of destiny, instead of working to change their reality.',
      fr: 'Les gens disent "c\'est le decret de Dieu" quand ils voient le retard de leurs societes. Ils se soumettent a la pauvrete, l\'ignorance et la maladie au nom du destin.'
    },
    diagnosis: {
      ar: 'الغزالي يرفض هذا المنطق بشدة. التخلف ليس قدرا بل نتيجة تقصير. الأمة التي تقبل التخلف تخون أمانة الاستخلاف في الأرض. القدر لا يُحتج به على التقاعس.',
      en: 'Al-Ghazali vehemently rejects this logic. Backwardness is not fate but the result of negligence. A nation that accepts backwardness betrays the trust of stewardship on earth. Destiny cannot be used as an excuse for inaction.',
      fr: 'Al-Ghazali rejette fermement cette logique. Le retard n\'est pas le destin mais le resultat de la negligence. Une nation qui accepte le retard trahit la confiance de l\'intendance sur terre.'
    },
    remedy: {
      ar: 'اعتبار التخلف ذنبا جماعيا يجب التوبة منه بالعمل والإصلاح. التوكل يعني الأخذ بالأسباب لا الاستسلام.',
      en: 'Consider backwardness a collective sin that requires repentance through work and reform. Trust in God means taking action, not surrendering.',
      fr: 'Considerer le retard comme un peche collectif qui exige le repentir par le travail et la reforme. La confiance en Dieu signifie agir, pas se rendre.'
    },
    verse: '\u0648\u064E\u0623\u064E\u0639\u0650\u062F\u0651\u064F\u0648\u0627 \u0644\u064E\u0647\u064F\u0645 \u0645\u0651\u064E\u0627 \u0627\u0633\u0652\u062A\u064E\u0637\u064E\u0639\u0652\u062A\u064F\u0645 \u0645\u0651\u0650\u0646 \u0642\u064F\u0648\u0651\u064E\u0629\u064D',
    verseRef: { ar: 'الأنفال: 60', en: 'Al-Anfal 8:60', fr: 'Al-Anfal 8:60' }
  },

  // === POLITICAL ===
  {
    cat: 'political', icon: '\u{1F451}', emoji: '\u{1F3DB}',
    name: { ar: 'الاستبداد والطغيان', en: 'Despotism and tyranny', fr: 'Despotisme et tyrannie' },
    daily: {
      ar: 'حكومات تحكم بالحديد والنار وتقمع كل صوت معارض. الناس تخاف أن تنتقد الحاكم أكثر مما تخاف أن تعصي الله. السلطة أصبحت هدفا لا أمانة.',
      en: 'Governments rule with iron and fire, suppressing all dissent. People fear criticizing the ruler more than disobeying God. Power has become a goal, not a trust.',
      fr: 'Les gouvernements gouvernent avec le fer et le feu, supprimant toute dissidence. Les gens craignent plus de critiquer le dirigeant que de desobeir a Dieu. Le pouvoir est devenu un but, pas un mandat.'
    },
    diagnosis: {
      ar: 'الغزالي يرى أن الاستبداد هو أخطر أمراض السياسة لأنه يقتل الإرادة الجماعية ويحول الشعوب إلى قطعان. المستبد يدّعي أنه يحكم باسم الله وهو يحكم باسم نفسه.',
      en: 'Al-Ghazali sees despotism as the deadliest political disease because it kills collective will and turns nations into herds. The despot claims to rule in God\'s name while ruling in his own.',
      fr: 'Al-Ghazali voit le despotisme comme la maladie politique la plus mortelle car elle tue la volonte collective et transforme les nations en troupeaux. Le despote pretend gouverner au nom de Dieu tout en gouvernant en son propre nom.'
    },
    remedy: {
      ar: 'تفعيل مبدأ الشورى الحقيقي. الحاكم خادم للأمة لا سيد عليها.',
      en: 'Activate the true principle of shura (consultation). The ruler is a servant of the nation, not its master.',
      fr: 'Activer le vrai principe de la choura (consultation). Le dirigeant est un serviteur de la nation, pas son maitre.'
    },
    verse: '\u0648\u064E\u0623\u064E\u0645\u0652\u0631\u064F\u0647\u064F\u0645\u0652 \u0634\u064F\u0648\u0631\u064E\u0649\u0670 \u0628\u064E\u064A\u0652\u0646\u064E\u0647\u064F\u0645\u0652',
    verseRef: { ar: 'الشورى: 38', en: 'Ash-Shura 42:38', fr: 'Ash-Shura 42:38' }
  },
  {
    cat: 'political', icon: '\u{1F54C}', emoji: '\u{2696}',
    name: { ar: 'توظيف الدين لخدمة السلطة', en: 'Using religion to serve power', fr: 'Instrumentalisation de la religion' },
    daily: {
      ar: 'علماء يبررون كل قرار للحاكم بآية أو حديث. يحرّمون الخروج على الظالم ويسكتون عن الظلم. الدين أصبح أداة لتخدير الشعوب.',
      en: 'Scholars justify every ruler\'s decision with a verse or hadith. They forbid opposing the oppressor and stay silent about injustice. Religion has become a tool to sedate the masses.',
      fr: 'Des savants justifient chaque decision du dirigeant avec un verset ou un hadith. Ils interdisent de s\'opposer a l\'oppresseur et restent silencieux face a l\'injustice. La religion est devenue un outil pour sedater les masses.'
    },
    diagnosis: {
      ar: 'عندما يتحول الدين إلى أداة سياسية، يفقد قدسيته ومصداقيته. الغزالي يحذر: عالم السوء الذي يبرر الظلم أخطر على الأمة من الظالم نفسه.',
      en: 'When religion becomes a political tool, it loses its sanctity and credibility. Al-Ghazali warns: the corrupt scholar who justifies oppression is more dangerous to the Ummah than the oppressor himself.',
      fr: 'Quand la religion devient un outil politique, elle perd sa sacralite et sa credibilite. Al-Ghazali avertit : le savant corrompu qui justifie l\'oppression est plus dangereux que l\'oppresseur lui-meme.'
    },
    remedy: {
      ar: 'فصل المؤسسة الدينية عن السلطة مع الحفاظ على القيم الإسلامية في الحكم. العالم الحق يقول الحق ولو على نفسه.',
      en: 'Separate the religious institution from power while preserving Islamic values in governance. A true scholar speaks truth even against himself.',
      fr: 'Separer l\'institution religieuse du pouvoir tout en preservant les valeurs islamiques dans la gouvernance. Un vrai savant dit la verite meme contre lui-meme.'
    },
    verse: '\u0648\u064E\u0644\u064E\u0627 \u062A\u064E\u0634\u0652\u062A\u064E\u0631\u064F\u0648\u0627 \u0628\u0650\u0622\u064A\u064E\u0627\u062A\u0650\u064A \u062B\u064E\u0645\u064E\u0646\u064B\u0627 \u0642\u064E\u0644\u0650\u064A\u0644\u064B\u0627',
    verseRef: { ar: 'البقرة: 41', en: 'Al-Baqarah 2:41', fr: 'Al-Baqarah 2:41' }
  },
  {
    cat: 'political', icon: '\u{1F910}', emoji: '\u{1F910}',
    name: { ar: 'السكوت عن الظلم', en: 'Silence on injustice', fr: 'Silence face a l\'injustice' },
    daily: {
      ar: 'الناس ترى الظلم وتسكت خوفا على رزقها أو منصبها. "ما لنا والسياسة" أصبحت العبارة الشائعة. الظلم يتمدد لأن لا أحد يقول "لا".',
      en: 'People see injustice and stay silent fearing for their livelihood or position. "Politics is not our business" became the common phrase. Injustice spreads because no one says "no".',
      fr: 'Les gens voient l\'injustice et restent silencieux de peur pour leur gagne-pain ou leur poste. "La politique n\'est pas notre affaire" est devenu la phrase courante. L\'injustice s\'etend car personne ne dit "non".'
    },
    diagnosis: {
      ar: 'السكوت عن الظلم شراكة فيه. الغزالي يذكّر بأن النبي صلى الله عليه وسلم قال: أفضل الجهاد كلمة حق عند سلطان جائر.',
      en: 'Silence on injustice is complicity in it. Al-Ghazali reminds us that the Prophet (peace be upon him) said: the best jihad is a word of truth before a tyrannical ruler.',
      fr: 'Le silence face a l\'injustice est une complicite. Al-Ghazali nous rappelle que le Prophete (paix sur lui) a dit : le meilleur jihad est une parole de verite devant un dirigeant tyrannique.'
    },
    remedy: {
      ar: 'الأمر بالمعروف والنهي عن المنكر بالحكمة والموعظة الحسنة. كل فرد مسؤول.',
      en: 'Enjoin good and forbid evil with wisdom and good counsel. Every individual is responsible.',
      fr: 'Ordonner le bien et interdire le mal avec sagesse et bon conseil. Chaque individu est responsable.'
    },
    verse: '\u0643\u064F\u0646\u062A\u064F\u0645\u0652 \u062E\u064E\u064A\u0652\u0631\u064E \u0623\u064F\u0645\u0651\u064E\u0629\u064D \u0623\u064F\u062E\u0652\u0631\u0650\u062C\u064E\u062A\u0652 \u0644\u0650\u0644\u0646\u0651\u064E\u0627\u0633\u0650 \u062A\u064E\u0623\u0652\u0645\u064F\u0631\u064F\u0648\u0646\u064E \u0628\u0650\u0627\u0644\u0652\u0645\u064E\u0639\u0652\u0631\u064F\u0648\u0641\u0650 \u0648\u064E\u062A\u064E\u0646\u0652\u0647\u064E\u0648\u0652\u0646\u064E \u0639\u064E\u0646\u0650 \u0627\u0644\u0652\u0645\u064F\u0646\u0643\u064E\u0631\u0650',
    verseRef: { ar: 'آل عمران: 110', en: 'Al Imran 3:110', fr: 'Al Imran 3:110' }
  },
  // NEW: Rulers using religion to justify power
  {
    cat: 'political', icon: '\u{1F3DB}', emoji: '\u{1F3DB}',
    name: { ar: 'الحاكم الذي يتلبس بالدين', en: 'Rulers cloaking themselves in religion', fr: 'Dirigeants se drapant de religion' },
    daily: {
      ar: 'حاكم يبني المساجد بينما يسرق أموال الشعب. يتظاهر بالورع في رمضان بينما سجونه مليئة بالأبرياء. يستخدم الفتوى الرسمية لتبرير سياساته.',
      en: 'A ruler builds mosques while stealing public funds. He displays piety in Ramadan while his prisons are full of innocents. He uses official religious edicts to justify his policies.',
      fr: 'Un dirigeant construit des mosquees tout en volant les fonds publics. Il affiche sa piete pendant le Ramadan tandis que ses prisons sont pleines d\'innocents. Il utilise les edits religieux officiels pour justifier ses politiques.'
    },
    diagnosis: {
      ar: 'يرى الغزالي أن أخطر أنواع الاستبداد هو الذي يتلبس بالدين. فالناس لا تستطيع أن تعترض على ما يُقدَّم باسم الله. هذا النفاق السياسي يفسد الدين والدنيا معا.',
      en: 'Al-Ghazali sees the most dangerous form of despotism as the one cloaked in religion. People cannot object to what is presented in God\'s name. This political hypocrisy corrupts both religion and worldly affairs.',
      fr: 'Al-Ghazali voit la forme la plus dangereuse du despotisme comme celle drapee de religion. Les gens ne peuvent pas s\'opposer a ce qui est presente au nom de Dieu. Cette hypocrisie politique corrompt la religion et les affaires mondaines.'
    },
    remedy: {
      ar: 'المحاسبة الشعبية للحاكم بناء على أفعاله لا أقواله. الدين لا يحمي الظالم بل يدينه.',
      en: 'Public accountability of rulers based on actions not words. Religion does not protect the oppressor — it condemns him.',
      fr: 'La responsabilite publique des dirigeants basee sur les actes et non les paroles. La religion ne protege pas l\'oppresseur — elle le condamne.'
    },
    verse: '\u0623\u064E\u062A\u064E\u0623\u0652\u0645\u064F\u0631\u064F\u0648\u0646\u064E \u0627\u0644\u0646\u0651\u064E\u0627\u0633\u064E \u0628\u0650\u0627\u0644\u0652\u0628\u0650\u0631\u0651\u0650 \u0648\u064E\u062A\u064E\u0646\u0633\u064E\u0648\u0652\u0646\u064E \u0623\u064E\u0646\u0641\u064F\u0633\u064E\u0643\u064F\u0645\u0652',
    verseRef: { ar: 'البقرة: 44', en: 'Al-Baqarah 2:44', fr: 'Al-Baqarah 2:44' }
  },

  // === INTELLECTUAL ===
  {
    cat: 'intellectual', icon: '\u{1F512}', emoji: '\u{1F9E0}',
    name: { ar: 'إغلاق باب الاجتهاد', en: 'Closing the gate of ijtihad', fr: 'Fermeture de la porte de l\'ijtihad' },
    daily: {
      ar: 'أي سؤال جديد يُقابل بـ "هذا بدعة" أو "ليس عليه دليل من السلف". العقل المسلم توقف عن التفكير الإبداعي وأصبح يكرر ما قاله الأولون بلا تجديد.',
      en: 'Any new question is met with "this is bid\'ah (innovation)" or "the early scholars didn\'t say this." The Muslim mind stopped creative thinking and merely repeats what predecessors said without renewal.',
      fr: 'Toute nouvelle question est accueillie par "c\'est une bid\'ah (innovation)" ou "les anciens savants n\'ont pas dit cela." L\'esprit musulman a cesse de penser de maniere creative et repete simplement ce que les predecesseurs ont dit.'
    },
    diagnosis: {
      ar: 'الغزالي يؤكد أن إغلاق باب الاجتهاد هو إعدام للعقل المسلم. الإسلام دين صالح لكل زمان ومكان، وهذا يتطلب اجتهادا مستمرا لمواكبة التغيرات.',
      en: 'Al-Ghazali insists that closing the gate of ijtihad is an execution of the Muslim mind. Islam is suitable for all times and places, and this requires continuous ijtihad to keep up with changes.',
      fr: 'Al-Ghazali insiste que la fermeture de la porte de l\'ijtihad est une execution de l\'esprit musulman. L\'Islam convient a tous les temps et lieux, et cela necessite un ijtihad continu pour suivre les changements.'
    },
    remedy: {
      ar: 'إعادة فتح باب الاجتهاد للعلماء المؤهلين. التمييز بين الثوابت التي لا تتغير والمتغيرات التي تحتاج تجديدا.',
      en: 'Reopen the gate of ijtihad for qualified scholars. Distinguish between constants that don\'t change and variables that need renewal.',
      fr: 'Rouvrir la porte de l\'ijtihad pour les savants qualifies. Distinguer entre les constantes qui ne changent pas et les variables qui necessitent un renouveau.'
    },
    verse: '\u0642\u064F\u0644\u0652 \u0647\u064E\u0644\u0652 \u064A\u064E\u0633\u0652\u062A\u064E\u0648\u0650\u064A \u0627\u0644\u0651\u064E\u0630\u0650\u064A\u0646\u064E \u064A\u064E\u0639\u0652\u0644\u064E\u0645\u064F\u0648\u0646\u064E \u0648\u064E\u0627\u0644\u0651\u064E\u0630\u0650\u064A\u0646\u064E \u0644\u064E\u0627 \u064A\u064E\u0639\u0652\u0644\u064E\u0645\u064F\u0648\u0646\u064E',
    verseRef: { ar: 'الزمر: 9', en: 'Az-Zumar 39:9', fr: 'Az-Zumar 39:9' }
  },
  {
    cat: 'intellectual', icon: '\u{1F6AB}', emoji: '\u{1F4DA}',
    name: { ar: 'الفصل بين العلم الديني والدنيوي', en: 'Separating religious and worldly knowledge', fr: 'Separation entre savoir religieux et mondain' },
    daily: {
      ar: 'طالب الطب أو الهندسة يُنظر إليه على أنه "دنيوي"، وطالب الشريعة على أنه "متدين". كأن الله لم يأمرنا بالتعلم في كل المجالات.',
      en: 'The medical or engineering student is seen as "worldly" while the Islamic studies student is seen as "religious." As if God didn\'t command us to learn in all fields.',
      fr: 'L\'etudiant en medecine ou en ingenierie est vu comme "mondain" tandis que l\'etudiant en etudes islamiques est vu comme "religieux." Comme si Dieu ne nous avait pas ordonne d\'apprendre dans tous les domaines.'
    },
    diagnosis: {
      ar: 'هذا الفصل المصطنع أضعف الأمة في الميدانين. لا العلوم الدنيوية تقدمت لأنها فُصلت عن القيم، ولا العلوم الشرعية تطورت لأنها فُصلت عن الواقع.',
      en: 'This artificial separation weakened the Ummah in both fields. Worldly sciences didn\'t advance because they were separated from values, and religious sciences didn\'t develop because they were separated from reality.',
      fr: 'Cette separation artificielle a affaibli la Oumma dans les deux domaines. Les sciences mondaines n\'ont pas progresse car separees des valeurs, et les sciences religieuses ne se sont pas developpees car separees de la realite.'
    },
    remedy: {
      ar: 'دمج العلوم الدينية والدنيوية. كل علم نافع هو عبادة. العالم المسلم يجب أن يكون عالما بدينه ودنياه.',
      en: 'Integrate religious and worldly knowledge. Every beneficial knowledge is worship. A Muslim scholar should be knowledgeable in both religion and the world.',
      fr: 'Integrer les savoirs religieux et mondains. Toute connaissance benefique est un culte. Un savant musulman doit etre savant en religion et dans le monde.'
    },
    verse: '\u0627\u0642\u0652\u0631\u064E\u0623\u0652 \u0628\u0650\u0627\u0633\u0652\u0645\u0650 \u0631\u064E\u0628\u0651\u0650\u0643\u064E \u0627\u0644\u0651\u064E\u0630\u0650\u064A \u062E\u064E\u0644\u064E\u0642\u064E',
    verseRef: { ar: 'العلق: 1', en: 'Al-Alaq 96:1', fr: 'Al-Alaq 96:1' }
  },
  {
    cat: 'intellectual', icon: '\u{1F9CA}', emoji: '\u{1F4A4}',
    name: { ar: 'الجمود الفكري', en: 'Intellectual stagnation', fr: 'Stagnation intellectuelle' },
    daily: {
      ar: 'رفض كل فكرة جديدة لمجرد أنها جديدة. الخوف من النقاش والحوار. اعتبار السؤال تشكيكا والنقد عدوانا. "هكذا وجدنا آباءنا" هو الجواب لكل شيء.',
      en: 'Rejecting every new idea simply because it\'s new. Fear of discussion and dialogue. Viewing questions as doubt and criticism as aggression. "This is how we found our fathers" is the answer to everything.',
      fr: 'Rejeter chaque nouvelle idee simplement parce qu\'elle est nouvelle. Peur de la discussion et du dialogue. Voir les questions comme du doute et la critique comme une agression. "C\'est ainsi que nous avons trouve nos peres" est la reponse a tout.'
    },
    diagnosis: {
      ar: 'الغزالي يحذر من أن الجمود الفكري هو انتحار حضاري. الأمة التي تتوقف عن التفكير تتوقف عن الحياة. القرآن نفسه يدعو إلى التفكر والتدبر.',
      en: 'Al-Ghazali warns that intellectual stagnation is civilizational suicide. A nation that stops thinking stops living. The Quran itself calls for reflection and contemplation.',
      fr: 'Al-Ghazali avertit que la stagnation intellectuelle est un suicide civilisationnel. Une nation qui cesse de penser cesse de vivre. Le Coran lui-meme appelle a la reflexion et la contemplation.'
    },
    remedy: {
      ar: 'تشجيع التفكير النقدي والسؤال. العودة إلى منهج القرآن في دعوة العقل. "أفلا تعقلون" "أفلا تتفكرون" — القرآن يحتفي بالعقل.',
      en: 'Encourage critical thinking and questioning. Return to the Quran\'s approach of engaging the mind. "Will you not reason?" "Will you not reflect?" — the Quran celebrates the intellect.',
      fr: 'Encourager la pensee critique et le questionnement. Revenir a l\'approche du Coran qui engage l\'esprit. "Ne raisonnez-vous pas ?" "Ne reflechissez-vous pas ?" — le Coran celebre l\'intellect.'
    },
    verse: '\u0623\u064E\u0641\u064E\u0644\u064E\u0627 \u064A\u064E\u062A\u064E\u062F\u064E\u0628\u0651\u064E\u0631\u064F\u0648\u0646\u064E \u0627\u0644\u0652\u0642\u064F\u0631\u0652\u0622\u0646\u064E \u0623\u064E\u0645\u0652 \u0639\u064E\u0644\u064E\u0649\u0670 \u0642\u064F\u0644\u064F\u0648\u0628\u064D \u0623\u064E\u0642\u0652\u0641\u064E\u0627\u0644\u064F\u0647\u064E\u0627',
    verseRef: { ar: 'محمد: 24', en: 'Muhammad 47:24', fr: 'Muhammad 47:24' }
  },
  // NEW: Emotional activism without scholarly grounding
  {
    cat: 'intellectual', icon: '\u{1F525}', emoji: '\u{1F525}',
    name: { ar: 'الحماس الديني بلا علم', en: 'Emotional religious activism without scholarship', fr: 'Activisme religieux emotionnel sans savoir' },
    daily: {
      ar: 'شباب متحمسون يفتون بلا علم ويكفّرون بلا فهم. يختزلون الدين في صراخ ومظاهرات بلا رؤية واضحة. الحماس موجود لكن العلم غائب.',
      en: 'Enthusiastic youth issuing religious rulings without knowledge and excommunicating without understanding. They reduce religion to shouting and protests without clear vision. Enthusiasm exists but scholarship is absent.',
      fr: 'Des jeunes enthousiastes emettant des avis religieux sans connaissance et excommuniant sans comprehension. Ils reduisent la religion a des cris et des manifestations sans vision claire. L\'enthousiasme existe mais le savoir est absent.'
    },
    diagnosis: {
      ar: 'الغزالي يحذر من أن الحماس بلا علم أخطر من الجهل البسيط. المتحمس الجاهل يظن أنه يخدم الإسلام بينما هو يشوّه صورته. الجهل المركب أعظم من الجهل البسيط.',
      en: 'Al-Ghazali warns that enthusiasm without knowledge is more dangerous than simple ignorance. The zealous ignorant thinks he serves Islam while distorting its image. Compound ignorance is greater than simple ignorance.',
      fr: 'Al-Ghazali avertit que l\'enthousiasme sans connaissance est plus dangereux que la simple ignorance. Le zelote ignorant pense servir l\'Islam tout en deformant son image.'
    },
    remedy: {
      ar: 'ربط الحماس بالعلم الصحيح. لا إفتاء بلا تأهيل. الحكمة قبل الحماس.',
      en: 'Link enthusiasm with proper knowledge. No rulings without qualification. Wisdom before zeal.',
      fr: 'Lier l\'enthousiasme au savoir correct. Pas d\'avis religieux sans qualification. La sagesse avant le zele.'
    },
    verse: '\u0642\u064F\u0644\u0652 \u0647\u064E\u0644\u0652 \u0646\u064F\u0646\u064E\u0628\u0651\u0650\u0626\u064F\u0643\u064F\u0645 \u0628\u0650\u0627\u0644\u0652\u0623\u064E\u062E\u0652\u0633\u064E\u0631\u0650\u064A\u0646\u064E \u0623\u064E\u0639\u0652\u0645\u064E\u0627\u0644\u064B\u0627',
    verseRef: { ar: 'الكهف: 103', en: 'Al-Kahf 18:103', fr: 'Al-Kahf 18:103' }
  },

  // === SOCIAL ===
  {
    cat: 'social', icon: '\u{1F465}', emoji: '\u{1F91D}',
    name: { ar: 'تآكل الهوية', en: 'Identity erosion', fr: 'Erosion de l\'identite' },
    daily: {
      ar: 'شباب يخجلون من ثقافتهم الإسلامية ويقلدون الغرب في كل شيء. ليس الاستفادة من الحضارات الأخرى — بل التقليد الأعمى الذي يمسخ الهوية.',
      en: 'Youth ashamed of their Islamic culture, imitating the West in everything. Not benefiting from other civilizations — but blind imitation that erases identity.',
      fr: 'Des jeunes honteux de leur culture islamique, imitant l\'Occident en tout. Pas beneficier des autres civilisations — mais une imitation aveugle qui efface l\'identite.'
    },
    diagnosis: {
      ar: 'الغزالي يميز بين التفاعل الحضاري الإيجابي والذوبان. الأمة التي تفقد هويتها تفقد سبب وجودها. التقليد الأعمى علامة ضعف لا تقدم.',
      en: 'Al-Ghazali distinguishes between positive civilizational interaction and dissolution. A nation that loses its identity loses its reason for existence. Blind imitation is a sign of weakness, not progress.',
      fr: 'Al-Ghazali distingue entre l\'interaction civilisationnelle positive et la dissolution. Une nation qui perd son identite perd sa raison d\'etre. L\'imitation aveugle est un signe de faiblesse, pas de progres.'
    },
    remedy: {
      ar: 'بناء هوية إسلامية واثقة تأخذ من الآخرين ما ينفع وترفض ما يضر. القوة في الأصالة مع الانفتاح.',
      en: 'Build a confident Islamic identity that takes what benefits from others and rejects what harms. Strength is in authenticity with openness.',
      fr: 'Construire une identite islamique confiante qui prend des autres ce qui est benefique et rejette ce qui nuit. La force est dans l\'authenticite avec l\'ouverture.'
    },
    verse: '\u0648\u064E\u062C\u064E\u0639\u064E\u0644\u0652\u0646\u064E\u0627\u0643\u064F\u0645\u0652 \u0634\u064F\u0639\u064F\u0648\u0628\u064B\u0627 \u0648\u064E\u0642\u064E\u0628\u064E\u0627\u0626\u0650\u0644\u064E \u0644\u0650\u062A\u064E\u0639\u064E\u0627\u0631\u064E\u0641\u064F\u0648\u0627',
    verseRef: { ar: 'الحجرات: 13', en: 'Al-Hujurat 49:13', fr: 'Al-Hujurat 49:13' }
  },
  {
    cat: 'social', icon: '\u{1F469}', emoji: '\u{1F6AB}',
    name: { ar: 'تهميش المرأة', en: 'Marginalization of women', fr: 'Marginalisation des femmes' },
    daily: {
      ar: 'حرمان المرأة من التعليم والعمل باسم الدين. تقييدها في البيت بحجج شرعية مغلوطة. نسيان أن خديجة كانت تاجرة وعائشة كانت عالمة.',
      en: 'Depriving women of education and work in the name of religion. Confining them to the home with false religious arguments. Forgetting that Khadijah was a businesswoman and Aisha was a scholar.',
      fr: 'Priver les femmes d\'education et de travail au nom de la religion. Les confiner a la maison avec de faux arguments religieux. Oublier que Khadijah etait une femme d\'affaires et Aisha etait une savante.'
    },
    diagnosis: {
      ar: 'الغزالي يؤكد أن تهميش نصف المجتمع هو تعطيل لنصف طاقة الأمة. التقاليد الجاهلية تلبست ثوب الدين وحرمت المرأة من حقوقها الشرعية.',
      en: 'Al-Ghazali affirms that marginalizing half of society paralyzes half the Ummah\'s energy. Pre-Islamic traditions wore the garb of religion and deprived women of their legitimate rights.',
      fr: 'Al-Ghazali affirme que marginaliser la moitie de la societe paralyse la moitie de l\'energie de la Oumma. Les traditions pre-islamiques ont revetu l\'habit de la religion et prive les femmes de leurs droits legitimes.'
    },
    remedy: {
      ar: 'تعليم المرأة وتمكينها كما فعل الإسلام الأول. المرأة شقيقة الرجل في الأحكام. العودة إلى النموذج النبوي في التعامل مع المرأة.',
      en: 'Educate and empower women as early Islam did. Women are the counterparts of men in rulings. Return to the Prophetic model in treating women.',
      fr: 'Eduquer et autonomiser les femmes comme l\'Islam premier l\'a fait. Les femmes sont les homologues des hommes dans les jugements. Revenir au modele prophetique dans le traitement des femmes.'
    },
    verse: '\u0648\u064E\u0644\u064E\u0647\u064F\u0646\u0651\u064E \u0645\u0650\u062B\u0652\u0644\u064F \u0627\u0644\u0651\u064E\u0630\u0650\u064A \u0639\u064E\u0644\u064E\u064A\u0652\u0647\u0650\u0646\u0651\u064E \u0628\u0650\u0627\u0644\u0652\u0645\u064E\u0639\u0652\u0631\u064F\u0648\u0641\u0650',
    verseRef: { ar: 'البقرة: 228', en: 'Al-Baqarah 2:228', fr: 'Al-Baqarah 2:228' }
  },
  {
    cat: 'social', icon: '\u{1F4F1}', emoji: '\u{1F4F1}',
    name: { ar: 'تفكك الروابط الاجتماعية', en: 'Social bonds disintegration', fr: 'Desintegration des liens sociaux' },
    daily: {
      ar: 'الجيران لا يعرفون بعضهم. الأقارب لا يتزاورون. الأغنياء في عالم والفقراء في عالم آخر. المسجد لم يعد مركزا للمجتمع.',
      en: 'Neighbors don\'t know each other. Relatives don\'t visit. The rich live in one world, the poor in another. The mosque is no longer the community center.',
      fr: 'Les voisins ne se connaissent pas. Les proches ne se visitent pas. Les riches vivent dans un monde, les pauvres dans un autre. La mosquee n\'est plus le centre communautaire.'
    },
    diagnosis: {
      ar: 'المجتمع المسلم كالجسد الواحد — إذا اشتكى منه عضو تداعى له سائر الجسد. الغزالي يرى أن تفكك الروابط الاجتماعية يجعل المجتمع هشا أمام أي تحدٍ.',
      en: 'The Muslim community is like one body — if one part suffers, the whole body responds. Al-Ghazali sees social disintegration making the community fragile against any challenge.',
      fr: 'La communaute musulmane est comme un seul corps — si une partie souffre, tout le corps repond. Al-Ghazali voit la desintegration sociale rendant la communaute fragile face a tout defi.'
    },
    remedy: {
      ar: 'إحياء مفهوم الأخوة الإسلامية العملية. زيارة المريض، إطعام الجائع، صلة الرحم، إصلاح ذات البين.',
      en: 'Revive practical Islamic brotherhood. Visit the sick, feed the hungry, maintain family ties, reconcile people.',
      fr: 'Raviver la fraternite islamique pratique. Visiter les malades, nourrir les affames, maintenir les liens familiaux, reconcilier les gens.'
    },
    verse: '\u0625\u0650\u0646\u0651\u064E\u0645\u064E\u0627 \u0627\u0644\u0652\u0645\u064F\u0624\u0652\u0645\u0650\u0646\u064F\u0648\u0646\u064E \u0625\u0650\u062E\u0652\u0648\u064E\u0629\u064C \u0641\u064E\u0623\u064E\u0635\u0652\u0644\u0650\u062D\u064F\u0648\u0627 \u0628\u064E\u064A\u0652\u0646\u064E \u0623\u064E\u062E\u064E\u0648\u064E\u064A\u0652\u0643\u064F\u0645\u0652',
    verseRef: { ar: 'الحجرات: 10', en: 'Al-Hujurat 49:10', fr: 'Al-Hujurat 49:10' }
  },
  // NEW: Brain drain
  {
    cat: 'social', icon: '\u{2708}', emoji: '\u{2708}',
    name: { ar: 'هجرة العقول بدل الإصلاح من الداخل', en: 'Brain drain — fleeing instead of reforming', fr: 'Fuite des cerveaux au lieu de reformer' },
    daily: {
      ar: 'أفضل الأطباء والمهندسين والعلماء يهاجرون إلى الغرب بحثا عن ظروف أفضل. البلاد تفقد كفاءاتها والمجتمع يزداد ضعفا. الهجرة أصبحت الحلم الأول للشباب.',
      en: 'The best doctors, engineers, and scholars emigrate to the West seeking better conditions. Countries lose their talents and society grows weaker. Emigration has become the youth\'s primary dream.',
      fr: 'Les meilleurs medecins, ingenieurs et savants emigrent en Occident a la recherche de meilleures conditions. Les pays perdent leurs talents et la societe s\'affaiblit. L\'emigration est devenue le reve principal des jeunes.'
    },
    diagnosis: {
      ar: 'الغزالي يرى أن الهجرة الجماعية للكفاءات هي استنزاف للأمة. الحل ليس الهروب بل الإصلاح. كل عقل يهاجر هو خسارة مضاعفة: خسارة لبلده ومكسب لمنافسيه.',
      en: 'Al-Ghazali views the mass emigration of talents as a drain on the Ummah. The solution is not escape but reform. Every mind that emigrates is a double loss: a loss for their country and a gain for competitors.',
      fr: 'Al-Ghazali voit l\'emigration massive des talents comme un drain pour la Oumma. La solution n\'est pas la fuite mais la reforme. Chaque esprit qui emigre est une double perte.'
    },
    remedy: {
      ar: 'خلق بيئات جاذبة للكفاءات في بلادهم. الإصلاح من الداخل واجب. على المهاجرين المساهمة في تنمية بلادهم ولو عن بعد.',
      en: 'Create attractive environments for talents in their own countries. Internal reform is a duty. Emigrants should contribute to their homeland\'s development, even from afar.',
      fr: 'Creer des environnements attractifs pour les talents dans leurs propres pays. La reforme interne est un devoir. Les emigres doivent contribuer au developpement de leur patrie.'
    },
    verse: '\u0648\u064E\u0644\u064E\u0627 \u062A\u064F\u0641\u0652\u0633\u0650\u062F\u064F\u0648\u0627 \u0641\u0650\u064A \u0627\u0644\u0652\u0623\u064E\u0631\u0652\u0636\u0650 \u0628\u064E\u0639\u0652\u062F\u064E \u0625\u0650\u0635\u0652\u0644\u064E\u0627\u062D\u0650\u0647\u064E\u0627',
    verseRef: { ar: 'الأعراف: 56', en: 'Al-A\'raf 7:56', fr: 'Al-A\'raf 7:56' }
  },

  // === ECONOMIC ===
  {
    cat: 'economic', icon: '\u{1F4B0}', emoji: '\u{1F4B8}',
    name: { ar: 'الاستغلال الاقتصادي', en: 'Economic exploitation', fr: 'Exploitation economique' },
    daily: {
      ar: 'أصحاب رؤوس الأموال يستغلون العمال ويدفعون لهم أجورا بائسة. الأغنياء يزدادون غنى والفقراء يزدادون فقرا. الاحتكار والغش التجاري أصبحا عادة.',
      en: 'Capital owners exploit workers and pay miserable wages. The rich get richer and the poor get poorer. Monopoly and commercial fraud have become the norm.',
      fr: 'Les detenteurs de capitaux exploitent les travailleurs et paient des salaires miserables. Les riches s\'enrichissent et les pauvres s\'appauvrissent. Le monopole et la fraude commerciale sont devenus la norme.'
    },
    diagnosis: {
      ar: 'الغزالي يربط الظلم الاقتصادي بالبعد عن الله. من نسي الآخرة سعى إلى جمع الدنيا بأي ثمن. المال في الإسلام وسيلة لا غاية.',
      en: 'Al-Ghazali links economic injustice to distance from God. Whoever forgets the Hereafter seeks to accumulate this world at any cost. Money in Islam is a means, not an end.',
      fr: 'Al-Ghazali lie l\'injustice economique a l\'eloignement de Dieu. Celui qui oublie l\'Au-dela cherche a accumuler ce monde a tout prix. L\'argent en Islam est un moyen, pas une fin.'
    },
    remedy: {
      ar: 'تفعيل نظام الزكاة الحقيقي. دفع الأجور العادلة. منع الاحتكار. المال مال الله ونحن مستخلفون فيه.',
      en: 'Activate the true zakat system. Pay fair wages. Prevent monopoly. Wealth belongs to God and we are its trustees.',
      fr: 'Activer le vrai systeme de la zakat. Payer des salaires equitables. Empecher le monopole. La richesse appartient a Dieu et nous en sommes les gardiens.'
    },
    verse: '\u0648\u064E\u0627\u0644\u0651\u064E\u0630\u0650\u064A\u0646\u064E \u064A\u064E\u0643\u0652\u0646\u0650\u0632\u064F\u0648\u0646\u064E \u0627\u0644\u0630\u0651\u064E\u0647\u064E\u0628\u064E \u0648\u064E\u0627\u0644\u0652\u0641\u0650\u0636\u0651\u064E\u0629\u064E \u0648\u064E\u0644\u064E\u0627 \u064A\u064F\u0646\u0641\u0650\u0642\u064F\u0648\u0646\u064E\u0647\u064E\u0627 \u0641\u0650\u064A \u0633\u064E\u0628\u0650\u064A\u0644\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0641\u064E\u0628\u064E\u0634\u0651\u0650\u0631\u0652\u0647\u064F\u0645 \u0628\u0650\u0639\u064E\u0630\u064E\u0627\u0628\u064D \u0623\u064E\u0644\u0650\u064A\u0645\u064D',
    verseRef: { ar: 'التوبة: 34', en: 'At-Tawbah 9:34', fr: 'At-Tawbah 9:34' }
  },
  {
    cat: 'economic', icon: '\u{1F3E6}', emoji: '\u{1F4CA}',
    name: { ar: 'الفساد المالي والرشوة', en: 'Financial corruption and bribery', fr: 'Corruption financiere et pots-de-vin' },
    daily: {
      ar: 'لا يمكنك إنجاز معاملة حكومية بدون "واسطة" أو رشوة. المناصب تُباع وتُشترى. المال العام يُنهب والناس تسكت.',
      en: 'You cannot complete a government transaction without connections or a bribe. Positions are bought and sold. Public funds are plundered and people stay silent.',
      fr: 'Vous ne pouvez pas effectuer une transaction gouvernementale sans connexions ou pot-de-vin. Les postes sont achetes et vendus. Les fonds publics sont pilles et les gens restent silencieux.'
    },
    diagnosis: {
      ar: 'الفساد مرض معدٍ — يبدأ صغيرا ثم ينتشر حتى يصبح ثقافة. الغزالي يؤكد أن المال الحرام يفسد القلب كما يفسد السم الجسد.',
      en: 'Corruption is a contagious disease — it starts small then spreads until it becomes culture. Al-Ghazali affirms that unlawful money corrupts the heart as poison corrupts the body.',
      fr: 'La corruption est une maladie contagieuse — elle commence petit puis se repand jusqu\'a devenir culture. Al-Ghazali affirme que l\'argent illicite corrompt le coeur comme le poison corrompt le corps.'
    },
    remedy: {
      ar: 'الشفافية والمحاسبة. تعيين الكفاءات لا الأقارب. مراقبة المال العام. تذكر أن كل درهم حرام سيُسأل عنه صاحبه.',
      en: 'Transparency and accountability. Appoint competence, not relatives. Monitor public funds. Remember that every unlawful penny will be questioned.',
      fr: 'Transparence et responsabilite. Nommer les competences, pas les proches. Surveiller les fonds publics. Se rappeler que chaque sou illicite sera questionne.'
    },
    verse: '\u0648\u064E\u0644\u064E\u0627 \u062A\u064E\u0623\u0652\u0643\u064F\u0644\u064F\u0648\u0627 \u0623\u064E\u0645\u0652\u0648\u064E\u0627\u0644\u064E\u0643\u064F\u0645 \u0628\u064E\u064A\u0652\u0646\u064E\u0643\u064F\u0645 \u0628\u0650\u0627\u0644\u0652\u0628\u064E\u0627\u0637\u0650\u0644\u0650',
    verseRef: { ar: 'البقرة: 188', en: 'Al-Baqarah 2:188', fr: 'Al-Baqarah 2:188' }
  },
  {
    cat: 'economic', icon: '\u{1F937}', emoji: '\u{1F4A4}',
    name: { ar: 'الكسل وترك العمل', en: 'Laziness and abandoning work', fr: 'Paresse et abandon du travail' },
    daily: {
      ar: 'شباب يريدون الثراء السريع بدون عمل. الاتكال على الغير والانتظار. "الله يرزق" أصبحت حجة للكسل بدل أن تكون عقيدة تبعث على العمل.',
      en: 'Youth want quick wealth without work. Dependence on others and waiting. "God provides" became an excuse for laziness instead of a belief that motivates work.',
      fr: 'Les jeunes veulent la richesse rapide sans travail. Dependance des autres et attente. "Dieu pourvoit" est devenu une excuse pour la paresse au lieu d\'une croyance qui motive le travail.'
    },
    diagnosis: {
      ar: 'الغزالي يرفض التواكل ويؤكد أن الإسلام دين عمل. التوكل على الله لا يعني ترك الأسباب — بل الأخذ بالأسباب مع الثقة بالله.',
      en: 'Al-Ghazali rejects passive reliance and affirms Islam is a religion of action. Trusting God doesn\'t mean abandoning effort — it means taking action while trusting God.',
      fr: 'Al-Ghazali rejette la dependance passive et affirme que l\'Islam est une religion d\'action. Faire confiance a Dieu ne signifie pas abandonner l\'effort — cela signifie agir tout en faisant confiance a Dieu.'
    },
    remedy: {
      ar: 'الأخذ بالأسباب والعمل بجد. يد الله مع الجماعة. اعقلها وتوكل. إتقان العمل عبادة.',
      en: 'Take initiative and work hard. God\'s hand is with the community. Tie your camel and trust God. Excellence in work is worship.',
      fr: 'Prendre l\'initiative et travailler dur. La main de Dieu est avec la communaute. Attache ton chameau et fais confiance a Dieu. L\'excellence dans le travail est un culte.'
    },
    verse: '\u0648\u064E\u0642\u064F\u0644\u0650 \u0627\u0639\u0652\u0645\u064E\u0644\u064F\u0648\u0627 \u0641\u064E\u0633\u064E\u064A\u064E\u0631\u064E\u0649 \u0627\u0644\u0644\u0651\u064E\u0647\u064F \u0639\u064E\u0645\u064E\u0644\u064E\u0643\u064F\u0645\u0652 \u0648\u064E\u0631\u064E\u0633\u064F\u0648\u0644\u064F\u0647\u064F \u0648\u064E\u0627\u0644\u0652\u0645\u064F\u0624\u0652\u0645\u0650\u0646\u064F\u0648\u0646\u064E',
    verseRef: { ar: 'التوبة: 105', en: 'At-Tawbah 9:105', fr: 'At-Tawbah 9:105' }
  }
];

// Category metadata
const categories = [
  { id: 'spiritual', icon: '\u{1FAC0}', nameKey: 'catSpiritual', remNameKey: 'catSpiritualRem', color: 'var(--rose)' },
  { id: 'political', icon: '\u{1F3DB}', nameKey: 'catPolitical', remNameKey: 'catPoliticalRem', color: 'var(--blue)' },
  { id: 'intellectual', icon: '\u{1F9E0}', nameKey: 'catIntellectual', remNameKey: 'catIntellectualRem', color: 'var(--gold)' },
  { id: 'social', icon: '\u{1F465}', nameKey: 'catSocial', remNameKey: 'catSocialRem', color: 'var(--pri)' },
  { id: 'economic', icon: '\u{1F4B0}', nameKey: 'catEconomic', remNameKey: 'catEconomicRem', color: 'var(--grn)' }
];

// ─── REMEDIES DATA (global for pairing) ───
const remediesData = {
  spiritual: [
    {
      emoji: '\u{1F49A}', name: { ar: 'ملء القلب بالتقوى', en: 'Filling the heart with Taqwa', fr: 'Remplir le coeur de Taqwa' },
      desc: { ar: 'التقوى ليست مجرد خوف من العقاب — إنها استحضار دائم لعظمة الله في كل لحظة. عندما يمتلئ القلب بالتقوى، تنطفئ أمراض الحسد والكبر والرياء.', en: 'Taqwa is not mere fear of punishment — it is a constant awareness of God\'s greatness in every moment. When the heart fills with taqwa, the diseases of envy, arrogance, and showing off are extinguished.', fr: 'La taqwa n\'est pas une simple peur de la punition — c\'est une conscience constante de la grandeur de Dieu a chaque instant. Quand le coeur se remplit de taqwa, les maladies de l\'envie, de l\'arrogance et de l\'ostentation s\'eteignent.' },
      steps: [
        { ar: 'ابدأ يومك بذكر الله وأذكار الصباح', en: 'Start your day with remembrance of God and morning supplications', fr: 'Commencez votre journee par le rappel de Dieu et les invocations du matin' },
        { ar: 'صلّ بتدبر — اقرأ معاني ما تقرأ', en: 'Pray with reflection — understand what you recite', fr: 'Priez avec reflexion — comprenez ce que vous recitez' },
        { ar: 'حاسب نفسك قبل النوم', en: 'Hold yourself accountable before sleep', fr: 'Rendez-vous des comptes avant de dormir' }
      ],
      verse: '\u0625\u0650\u0646\u0651\u064E \u0623\u064E\u0643\u0652\u0631\u064E\u0645\u064E\u0643\u064F\u0645\u0652 \u0639\u0650\u0646\u062F\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0623\u064E\u062A\u0652\u0642\u064E\u0627\u0643\u064F\u0645\u0652',
      verseRef: { ar: '\u0627\u0644\u062D\u062C\u0631\u0627\u062A: 13', en: 'Al-Hujurat 49:13', fr: 'Al-Hujurat 49:13' }
    },
    {
      emoji: '\u{1F4D6}', name: { ar: 'ربط العبادة بالسلوك', en: 'Linking worship to behavior', fr: 'Lier le culte au comportement' },
      desc: { ar: 'العبادة الحقيقية تُثمر أخلاقا حسنة. إذا صليت ولم تتحسن أخلاقك، فراجع صلاتك. العبادة ليست مجرد طقوس — إنها تربية للنفس.', en: 'True worship produces good character. If you pray but your character doesn\'t improve, review your prayer. Worship is not mere ritual — it is the education of the soul.', fr: 'Le vrai culte produit un bon caractere. Si vous priez mais que votre caractere ne s\'ameliore pas, revisez votre priere. Le culte n\'est pas un simple rituel — c\'est l\'education de l\'ame.' },
      steps: [
        { ar: 'بعد كل صلاة، اختر خلقا واحدا للعمل عليه', en: 'After each prayer, choose one character trait to work on', fr: 'Apres chaque priere, choisissez un trait de caractere a travailler' },
        { ar: 'اربط الصيام بالصبر والرحمة في تعاملاتك', en: 'Link fasting to patience and mercy in your dealings', fr: 'Liez le jeune a la patience et la misericorde dans vos relations' },
        { ar: 'اجعل الزكاة تربية للنفس لا مجرد فريضة مالية', en: 'Make zakat a training of the soul, not just a financial obligation', fr: 'Faites de la zakat une formation de l\'ame, pas juste une obligation financiere' }
      ],
      verse: '\u0642\u064E\u062F\u0652 \u0623\u064E\u0641\u0652\u0644\u064E\u062D\u064E \u0645\u064E\u0646 \u0632\u064E\u0643\u0651\u064E\u0627\u0647\u064E\u0627',
      verseRef: { ar: '\u0627\u0644\u0634\u0645\u0633: 9', en: 'Ash-Shams 91:9', fr: 'Ash-Shams 91:9' }
    },
    {
      emoji: '\u{1F31F}', name: { ar: 'الإخلاص في النية', en: 'Sincerity in intention', fr: 'Sincerite dans l\'intention' },
      desc: { ar: 'الإخلاص هو أن تعمل لله وحده. لا تبحث عن مدح الناس أو إعجابهم. العمل الخالص ولو كان صغيرا خير من العمل الكبير المشوب بالرياء.', en: 'Sincerity means working for God alone. Don\'t seek people\'s praise or admiration. A small sincere deed is better than a grand one tainted with showing off.', fr: 'La sincerite signifie travailler pour Dieu seul. Ne cherchez pas les louanges ou l\'admiration des gens. Un petit acte sincere est meilleur qu\'un grand acte entache d\'ostentation.' },
      steps: [
        { ar: 'راجع نيتك قبل كل عمل: لمن أفعل هذا؟', en: 'Review your intention before every action: for whom am I doing this?', fr: 'Revisez votre intention avant chaque action : pour qui est-ce que je fais cela ?' },
        { ar: 'تعلم أن تعمل الخير في السر', en: 'Learn to do good in secret', fr: 'Apprenez a faire le bien en secret' },
        { ar: 'لا تنتظر شكرا من الناس', en: 'Don\'t expect thanks from people', fr: 'N\'attendez pas de remerciements des gens' }
      ],
      verse: '\u0648\u064E\u0645\u064E\u0627 \u0623\u064F\u0645\u0650\u0631\u064F\u0648\u0627 \u0625\u0650\u0644\u0651\u064E\u0627 \u0644\u0650\u064A\u064E\u0639\u0652\u0628\u064F\u062F\u064F\u0648\u0627 \u0627\u0644\u0644\u0651\u064E\u0647\u064E \u0645\u064F\u062E\u0652\u0644\u0650\u0635\u0650\u064A\u0646\u064E \u0644\u064E\u0647\u064F \u0627\u0644\u062F\u0651\u0650\u064A\u0646\u064E',
      verseRef: { ar: '\u0627\u0644\u0628\u064A\u0646\u0629: 5', en: 'Al-Bayyinah 98:5', fr: 'Al-Bayyinah 98:5' }
    },
    // NEW spiritual remedy: Personal responsibility
    {
      emoji: '\u{1F4AA}', name: { ar: 'تحمل المسؤولية الشخصية', en: 'Taking personal responsibility', fr: 'Assumer la responsabilite personnelle' },
      desc: { ar: 'المسؤولية الشخصية هي أساس الإصلاح. لا تلم الشيطان ولا الظروف ولا الآخرين. ابدأ بنفسك. كل إنسان راعٍ ومسؤول عن رعيته.', en: 'Personal responsibility is the foundation of reform. Don\'t blame Satan, circumstances, or others. Start with yourself. Every person is a shepherd responsible for their flock.', fr: 'La responsabilite personnelle est le fondement de la reforme. N\'accusez pas Satan, les circonstances ou les autres. Commencez par vous-meme.' },
      steps: [
        { ar: 'عند كل خطأ اسأل: ما دوري في هذا؟', en: 'At every mistake ask: what is my role in this?', fr: 'A chaque erreur, demandez : quel est mon role ?' },
        { ar: 'اكتب محاسبة يومية قبل النوم', en: 'Write a daily self-review before sleep', fr: 'Ecrivez une auto-evaluation quotidienne avant de dormir' },
        { ar: 'توقف عن لوم الآخرين وابدأ بإصلاح نفسك', en: 'Stop blaming others and start reforming yourself', fr: 'Arretez de blamer les autres et commencez par vous reformer' }
      ],
      verse: '\u0625\u0650\u0646\u0651\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u064E \u0644\u064E\u0627 \u064A\u064F\u063A\u064E\u064A\u0651\u0650\u0631\u064F \u0645\u064E\u0627 \u0628\u0650\u0642\u064E\u0648\u0652\u0645\u064D \u062D\u064E\u062A\u0651\u064E\u0649\u0670 \u064A\u064F\u063A\u064E\u064A\u0651\u0650\u0631\u064F\u0648\u0627 \u0645\u064E\u0627 \u0628\u0650\u0623\u064E\u0646\u0641\u064F\u0633\u0650\u0647\u0650\u0645\u0652',
      verseRef: { ar: 'الرعد: 11', en: 'Ar-Ra\'d 13:11', fr: 'Ar-Ra\'d 13:11' }
    }
  ],
  political: [
    {
      emoji: '\u{1F91D}', name: { ar: 'الشورى والتشاور', en: 'Shura (Consultation)', fr: 'Choura (Consultation)' },
      desc: { ar: 'الشورى ليست ديكورا — إنها أساس الحكم في الإسلام. الحاكم الذي لا يتشاور مع أمته ليس حاكما شرعيا.', en: 'Shura is not decoration — it is the foundation of governance in Islam. A ruler who does not consult his nation is not a legitimate ruler.', fr: 'La choura n\'est pas une decoration — c\'est le fondement de la gouvernance en Islam.' },
      steps: [
        { ar: 'مارس الشورى في أسرتك أولا', en: 'Practice shura in your family first', fr: 'Pratiquez la choura dans votre famille d\'abord' },
        { ar: 'شارك في شؤون مجتمعك المحلي', en: 'Participate in your local community affairs', fr: 'Participez aux affaires de votre communaute locale' },
        { ar: 'علّم أطفالك أن يعبّروا عن رأيهم باحترام', en: 'Teach your children to express their opinion respectfully', fr: 'Enseignez a vos enfants a exprimer leur opinion avec respect' }
      ],
      verse: '\u0648\u064E\u0634\u064E\u0627\u0648\u0650\u0631\u0652\u0647\u064F\u0645\u0652 \u0641\u0650\u064A \u0627\u0644\u0652\u0623\u064E\u0645\u0652\u0631\u0650',
      verseRef: { ar: '\u0622\u0644 \u0639\u0645\u0631\u0627\u0646: 159', en: 'Al Imran 3:159', fr: 'Al Imran 3:159' }
    },
    {
      emoji: '\u{2696}', name: { ar: 'العدل والمساواة', en: 'Justice and equality', fr: 'Justice et egalite' },
      desc: { ar: 'العدل أساس الملك. لا فرق بين غني وفقير أمام القانون. الغزالي يؤكد أن الحكم بالعدل فريضة لا خيار.', en: 'Justice is the foundation of governance. No difference between rich and poor before the law. Al-Ghazali affirms that ruling with justice is an obligation, not a choice.', fr: 'La justice est le fondement de la gouvernance. Pas de difference entre riche et pauvre devant la loi.' },
      steps: [
        { ar: 'كن عادلا في تعاملك مع الجميع', en: 'Be just in your dealings with everyone', fr: 'Soyez juste dans vos relations avec tous' },
        { ar: 'لا تقبل الظلم حتى لو كان في صالحك', en: 'Don\'t accept injustice even if it benefits you', fr: 'N\'acceptez pas l\'injustice meme si elle vous profite' },
        { ar: 'ادعم المظلوم ولو بكلمة', en: 'Support the oppressed, even with a word', fr: 'Soutenez l\'opprime, meme par une parole' }
      ],
      verse: '\u0625\u0650\u0646\u0651\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u064E \u064A\u064E\u0623\u0652\u0645\u064F\u0631\u064F \u0628\u0650\u0627\u0644\u0652\u0639\u064E\u062F\u0652\u0644\u0650 \u0648\u064E\u0627\u0644\u0652\u0625\u0650\u062D\u0652\u0633\u064E\u0627\u0646\u0650',
      verseRef: { ar: '\u0627\u0644\u0646\u062D\u0644: 90', en: 'An-Nahl 16:90', fr: 'An-Nahl 16:90' }
    },
    {
      emoji: '\u{1F4E2}', name: { ar: 'الأمر بالمعروف والنهي عن المنكر', en: 'Enjoining good and forbidding evil', fr: 'Ordonner le bien et interdire le mal' },
      desc: { ar: 'السكوت على المنكر ليس حكمة — إنه جبن. كل مسلم مسؤول عن الأمر بالمعروف والنهي عن المنكر حسب استطاعته.', en: 'Silence on evil is not wisdom — it is cowardice. Every Muslim is responsible for enjoining good and forbidding evil according to their ability.', fr: 'Le silence face au mal n\'est pas la sagesse — c\'est la lachete. Chaque musulman est responsable d\'ordonner le bien et d\'interdire le mal selon sa capacite.' },
      steps: [
        { ar: 'تكلم بالحق بحكمة ولطف', en: 'Speak truth with wisdom and kindness', fr: 'Dites la verite avec sagesse et gentillesse' },
        { ar: 'لا تتجاهل الظلم أمامك', en: 'Don\'t ignore injustice before you', fr: 'N\'ignorez pas l\'injustice devant vous' },
        { ar: 'كن قدوة في الخير', en: 'Be a role model in goodness', fr: 'Soyez un modele dans le bien' }
      ],
      verse: '\u0648\u064E\u0644\u0652\u062A\u064E\u0643\u064F\u0646 \u0645\u0651\u0650\u0646\u0643\u064F\u0645\u0652 \u0623\u064F\u0645\u0651\u064E\u0629\u064C \u064A\u064E\u062F\u0652\u0639\u064F\u0648\u0646\u064E \u0625\u0650\u0644\u064E\u0649 \u0627\u0644\u0652\u062E\u064E\u064A\u0652\u0631\u0650',
      verseRef: { ar: '\u0622\u0644 \u0639\u0645\u0631\u0627\u0646: 104', en: 'Al Imran 3:104', fr: 'Al Imran 3:104' }
    },
    // NEW political remedy: Public accountability
    {
      emoji: '\u{1F50D}', name: { ar: 'المحاسبة الشعبية للحكام', en: 'Public accountability for rulers', fr: 'Responsabilite publique des dirigeants' },
      desc: { ar: 'الحاكم في الإسلام ليس فوق المحاسبة. عمر بن الخطاب قال: "إذا رأيتم فيّ اعوجاجا فقوّموني." محاسبة الحاكم على أفعاله واجب ديني ووطني.', en: 'The ruler in Islam is not above accountability. Umar ibn al-Khattab said: "If you see crookedness in me, straighten me." Holding rulers accountable is a religious and national duty.', fr: 'Le dirigeant en Islam n\'est pas au-dessus de la responsabilite. Omar ibn al-Khattab a dit : "Si vous voyez un ecart en moi, corrigez-moi." Tenir les dirigeants responsables est un devoir religieux et national.' },
      steps: [
        { ar: 'طالب بالشفافية في المؤسسات العامة', en: 'Demand transparency in public institutions', fr: 'Exigez la transparence dans les institutions publiques' },
        { ar: 'ادعم حرية التعبير المسؤولة', en: 'Support responsible freedom of expression', fr: 'Soutenez la liberte d\'expression responsable' },
        { ar: 'شارك في العمل المدني والرقابة الشعبية', en: 'Participate in civic work and public oversight', fr: 'Participez au travail civique et a la surveillance publique' }
      ],
      verse: '\u064A\u064E\u0627 \u0623\u064E\u064A\u0651\u064F\u0647\u064E\u0627 \u0627\u0644\u0651\u064E\u0630\u0650\u064A\u0646\u064E \u0622\u0645\u064E\u0646\u064F\u0648\u0627 \u0643\u064F\u0648\u0646\u064F\u0648\u0627 \u0642\u064E\u0648\u0651\u064E\u0627\u0645\u0650\u064A\u0646\u064E \u0628\u0650\u0627\u0644\u0652\u0642\u0650\u0633\u0652\u0637\u0650',
      verseRef: { ar: 'النساء: 135', en: 'An-Nisa 4:135', fr: 'An-Nisa 4:135' }
    }
  ],
  intellectual: [
    {
      emoji: '\u{1F513}', name: { ar: 'إحياء الاجتهاد', en: 'Revival of Ijtihad', fr: 'Renouveau de l\'Ijtihad' },
      desc: { ar: 'الاجتهاد هو محرك التقدم في الإسلام. الثوابت ثابتة لكن المتغيرات تحتاج عقولا مجتهدة تفهم الواقع وتستنبط الأحكام المناسبة.', en: 'Ijtihad is the engine of progress in Islam. Constants are fixed but variables need scholarly minds that understand reality and derive appropriate rulings.', fr: 'L\'ijtihad est le moteur du progres en Islam. Les constantes sont fixes mais les variables necessitent des esprits savants.' },
      steps: [
        { ar: 'تعلم التمييز بين الثوابت والمتغيرات', en: 'Learn to distinguish between constants and variables', fr: 'Apprenez a distinguer entre constantes et variables' },
        { ar: 'اقرأ لعلماء التجديد مثل الغزالي والقرضاوي', en: 'Read renewal scholars like al-Ghazali and al-Qaradawi', fr: 'Lisez les savants du renouveau comme al-Ghazali et al-Qaradawi' },
        { ar: 'لا تخف من السؤال والبحث', en: 'Don\'t fear questioning and research', fr: 'N\'ayez pas peur de questionner et de chercher' }
      ],
      verse: '\u0641\u064E\u0627\u0633\u0652\u0623\u064E\u0644\u064F\u0648\u0627 \u0623\u064E\u0647\u0652\u0644\u064E \u0627\u0644\u0630\u0651\u0650\u0643\u0652\u0631\u0650 \u0625\u0650\u0646 \u0643\u064F\u0646\u062A\u064F\u0645\u0652 \u0644\u064E\u0627 \u062A\u064E\u0639\u0652\u0644\u064E\u0645\u064F\u0648\u0646\u064E',
      verseRef: { ar: '\u0627\u0644\u0646\u062D\u0644: 43', en: 'An-Nahl 16:43', fr: 'An-Nahl 16:43' }
    },
    {
      emoji: '\u{1F52C}', name: { ar: 'دمج العلوم الدينية والدنيوية', en: 'Integrating religious and worldly knowledge', fr: 'Integration du savoir religieux et mondain' },
      desc: { ar: 'لا تعارض بين العلم والدين. المسلم الأول كان عالم دين وعالم دنيا في نفس الوقت. ابن سينا طبيب وفيلسوف. الخوارزمي رياضياتي وعالم.', en: 'There is no conflict between science and religion. Early Muslims were scholars of both religion and the world. Ibn Sina was a doctor and philosopher. Al-Khwarizmi a mathematician and scholar.', fr: 'Il n\'y a pas de conflit entre science et religion. Les premiers musulmans etaient des savants en religion et dans le monde.' },
      steps: [
        { ar: 'تعلم علما دنيويا واربطه بقيمك الإسلامية', en: 'Learn a worldly science and connect it to your Islamic values', fr: 'Apprenez une science mondaine et reliez-la a vos valeurs islamiques' },
        { ar: 'اقرأ عن العلماء المسلمين الأوائل', en: 'Read about early Muslim scientists', fr: 'Lisez sur les premiers scientifiques musulmans' },
        { ar: 'علّم أولادك أن كل علم نافع هو عبادة', en: 'Teach your children that every beneficial knowledge is worship', fr: 'Enseignez a vos enfants que toute connaissance benefique est un culte' }
      ],
      verse: '\u0627\u0642\u0652\u0631\u064E\u0623\u0652 \u0628\u0650\u0627\u0633\u0652\u0645\u0650 \u0631\u064E\u0628\u0651\u0650\u0643\u064E \u0627\u0644\u0651\u064E\u0630\u0650\u064A \u062E\u064E\u0644\u064E\u0642\u064E',
      verseRef: { ar: '\u0627\u0644\u0639\u0644\u0642: 1', en: 'Al-Alaq 96:1', fr: 'Al-Alaq 96:1' }
    },
    {
      emoji: '\u{1F4AD}', name: { ar: 'تشجيع التفكير النقدي', en: 'Encouraging critical thinking', fr: 'Encourager la pensee critique' },
      desc: { ar: 'القرآن مليء بالدعوة إلى التفكر والتدبر. الإسلام لا يخاف من السؤال بل يرحب به. العقل المفكر هو العقل الحي.', en: 'The Quran is full of calls to reflect and contemplate. Islam does not fear questions but welcomes them. A thinking mind is a living mind.', fr: 'Le Coran est plein d\'appels a la reflexion et la contemplation. L\'Islam ne craint pas les questions mais les accueille.' },
      steps: [
        { ar: 'اسأل "لماذا" بدل أن تقبل بلا تفكير', en: 'Ask "why" instead of accepting without thinking', fr: 'Demandez "pourquoi" au lieu d\'accepter sans reflechir' },
        { ar: 'اقرأ آراء مختلفة في المسألة الواحدة', en: 'Read different opinions on the same issue', fr: 'Lisez differentes opinions sur le meme sujet' },
        { ar: 'ناقش بأدب واحترام حتى من تختلف معه', en: 'Discuss with manners and respect even those you disagree with', fr: 'Discutez avec politesse et respect meme avec ceux avec qui vous etes en desaccord' }
      ],
      verse: '\u0623\u064E\u0641\u064E\u0644\u064E\u0627 \u064A\u064E\u062A\u064E\u062F\u064E\u0628\u0651\u064E\u0631\u064F\u0648\u0646\u064E \u0627\u0644\u0652\u0642\u064F\u0631\u0652\u0622\u0646\u064E',
      verseRef: { ar: '\u0645\u062D\u0645\u062F: 24', en: 'Muhammad 47:24', fr: 'Muhammad 47:24' }
    },
    // NEW intellectual remedy: Scholarly grounding for activism
    {
      emoji: '\u{1F4DA}', name: { ar: 'تأسيس الحماس على العلم', en: 'Grounding enthusiasm in scholarship', fr: 'Fonder l\'enthousiasme sur le savoir' },
      desc: { ar: 'الحماس بلا علم كالسيف بيد المجنون. الغزالي يدعو إلى بناء جيل من الشباب يجمع بين الحماس والعلم الصحيح. لا فتوى بلا تأهيل.', en: 'Enthusiasm without knowledge is like a sword in the hands of a madman. Al-Ghazali calls for building a generation that combines zeal with proper knowledge. No ruling without qualification.', fr: 'L\'enthousiasme sans connaissance est comme une epee entre les mains d\'un fou. Al-Ghazali appelle a construire une generation qui combine le zele et le savoir correct.' },
      steps: [
        { ar: 'قبل أن تدعو غيرك تعلم أولا', en: 'Before calling others, learn first', fr: 'Avant d\'appeler les autres, apprenez d\'abord' },
        { ar: 'لا تفتِ فيما لا تعلم', en: 'Don\'t issue rulings on what you don\'t know', fr: 'N\'emettez pas d\'avis sur ce que vous ne savez pas' },
        { ar: 'ادرس على يد علماء حقيقيين', en: 'Study under genuine scholars', fr: 'Etudiez aupres de vrais savants' }
      ],
      verse: '\u0648\u064E\u0644\u064E\u0627 \u062A\u064E\u0642\u0652\u0641\u064F \u0645\u064E\u0627 \u0644\u064E\u064A\u0652\u0633\u064E \u0644\u064E\u0643\u064E \u0628\u0650\u0647\u0650 \u0639\u0650\u0644\u0652\u0645\u064C',
      verseRef: { ar: 'الإسراء: 36', en: 'Al-Isra 17:36', fr: 'Al-Isra 17:36' }
    }
  ],
  social: [
    {
      emoji: '\u{1F91D}', name: { ar: 'التضامن المجتمعي', en: 'Community solidarity', fr: 'Solidarite communautaire' },
      desc: { ar: 'المجتمع المسلم كالبنيان يشد بعضه بعضا. كل فرد مسؤول عن أخيه. الغزالي يدعو إلى إعادة بناء الروابط الاجتماعية المتينة.', en: 'The Muslim community is like a building whose parts reinforce each other. Every individual is responsible for their fellow.', fr: 'La communaute musulmane est comme un batiment dont les parties se renforcent mutuellement.' },
      steps: [
        { ar: 'تعرف على جيرانك واسأل عن حالهم', en: 'Get to know your neighbors and ask about their wellbeing', fr: 'Apprenez a connaitre vos voisins et demandez de leurs nouvelles' },
        { ar: 'شارك في أعمال تطوعية', en: 'Participate in volunteer work', fr: 'Participez a des actions benevoles' },
        { ar: 'صل رحمك حتى من قطعك', en: 'Maintain family ties even with those who cut them', fr: 'Maintenez les liens familiaux meme avec ceux qui les coupent' }
      ],
      verse: '\u0648\u064E\u062A\u064E\u0639\u064E\u0627\u0648\u064E\u0646\u064F\u0648\u0627 \u0639\u064E\u0644\u064E\u0649 \u0627\u0644\u0652\u0628\u0650\u0631\u0651\u0650 \u0648\u064E\u0627\u0644\u062A\u0651\u064E\u0642\u0652\u0648\u064E\u0649\u0670',
      verseRef: { ar: '\u0627\u0644\u0645\u0627\u0626\u062F\u0629: 2', en: 'Al-Ma\'idah 5:2', fr: 'Al-Ma\'idah 5:2' }
    },
    {
      emoji: '\u{1F469}\u{200D}\u{1F393}', name: { ar: 'تعليم المرأة وتمكينها', en: 'Women\'s education and empowerment', fr: 'Education et autonomisation des femmes' },
      desc: { ar: 'المرأة نصف المجتمع وهي التي تربي النصف الآخر. تهميشها خسارة للأمة كلها. الإسلام كفل حقوقها في التعليم والعمل والملكية.', en: 'Women are half of society and they raise the other half. Marginalizing them is a loss for the entire Ummah.', fr: 'Les femmes sont la moitie de la societe et elles elevent l\'autre moitie.' },
      steps: [
        { ar: 'ادعم تعليم البنات في عائلتك', en: 'Support girls\' education in your family', fr: 'Soutenez l\'education des filles dans votre famille' },
        { ar: 'اقرأ عن نماذج النساء في التاريخ الإسلامي', en: 'Read about women role models in Islamic history', fr: 'Lisez sur les modeles feminins dans l\'histoire islamique' },
        { ar: 'عامل المرأة كشريكة لا كتابعة', en: 'Treat women as partners, not followers', fr: 'Traitez les femmes comme des partenaires, pas des suiveuses' }
      ],
      verse: '\u0648\u064E\u0644\u064E\u0647\u064F\u0646\u0651\u064E \u0645\u0650\u062B\u0652\u0644\u064F \u0627\u0644\u0651\u064E\u0630\u0650\u064A \u0639\u064E\u0644\u064E\u064A\u0652\u0647\u0650\u0646\u0651\u064E \u0628\u0650\u0627\u0644\u0652\u0645\u064E\u0639\u0652\u0631\u064F\u0648\u0641\u0650',
      verseRef: { ar: '\u0627\u0644\u0628\u0642\u0631\u0629: 228', en: 'Al-Baqarah 2:228', fr: 'Al-Baqarah 2:228' }
    },
    {
      emoji: '\u{1F3E0}', name: { ar: 'بناء هوية واثقة', en: 'Building a confident identity', fr: 'Construire une identite confiante' },
      desc: { ar: 'الهوية الإسلامية ليست انغلاقا — إنها انفتاح واثق. نأخذ من الآخرين ما ينفعنا ونعطيهم ما عندنا.', en: 'Islamic identity is not isolation — it is confident openness. We take what benefits from others and give what we have.', fr: 'L\'identite islamique n\'est pas l\'isolement — c\'est une ouverture confiante.' },
      steps: [
        { ar: 'تعلم تاريخ حضارتك بفخر', en: 'Learn your civilization\'s history with pride', fr: 'Apprenez l\'histoire de votre civilisation avec fierte' },
        { ar: 'ميّز بين الاستفادة والتقليد الأعمى', en: 'Distinguish between benefiting and blind imitation', fr: 'Distinguez entre beneficier et imitation aveugle' },
        { ar: 'كن سفيرا لقيمك في كل مكان', en: 'Be an ambassador for your values everywhere', fr: 'Soyez un ambassadeur de vos valeurs partout' }
      ],
      verse: '\u0643\u064F\u0646\u062A\u064F\u0645\u0652 \u062E\u064E\u064A\u0652\u0631\u064E \u0623\u064F\u0645\u0651\u064E\u0629\u064D \u0623\u064F\u062E\u0652\u0631\u0650\u062C\u064E\u062A\u0652 \u0644\u0650\u0644\u0646\u0651\u064E\u0627\u0633\u0650',
      verseRef: { ar: '\u0622\u0644 \u0639\u0645\u0631\u0627\u0646: 110', en: 'Al Imran 3:110', fr: 'Al Imran 3:110' }
    },
    // NEW social remedy: Reform from within
    {
      emoji: '\u{1F3D7}', name: { ar: 'الإصلاح من الداخل لا الهجرة', en: 'Reform from within, not emigration', fr: 'Reformer de l\'interieur, pas emigrer' },
      desc: { ar: 'بدل الهروب من المشكلات، واجهها وأصلحها. الأنبياء لم يهاجروا طلبا للراحة بل أُخرجوا قسرا. على كل مثقف أن يسهم في بناء مجتمعه.', en: 'Instead of fleeing problems, confront and fix them. Prophets did not emigrate for comfort but were forced out. Every intellectual must contribute to building their society.', fr: 'Au lieu de fuir les problemes, affrontez-les et corrigez-les. Les prophetes n\'ont pas emigre pour le confort mais ont ete forces de partir.' },
      steps: [
        { ar: 'ساهم في مشروع إصلاحي محلي واحد على الأقل', en: 'Contribute to at least one local reform project', fr: 'Contribuez a au moins un projet de reforme local' },
        { ar: 'إذا هاجرت أبقِ جسرا مع وطنك', en: 'If you emigrate, keep a bridge with your homeland', fr: 'Si vous emigrez, gardez un pont avec votre patrie' },
        { ar: 'ادعم المبادرات التعليمية والتنموية في بلدك', en: 'Support educational and development initiatives in your country', fr: 'Soutenez les initiatives educatives et de developpement dans votre pays' }
      ],
      verse: '\u0648\u064E\u0644\u064E\u0627 \u062A\u064F\u0641\u0652\u0633\u0650\u062F\u064F\u0648\u0627 \u0641\u0650\u064A \u0627\u0644\u0652\u0623\u064E\u0631\u0652\u0636\u0650 \u0628\u064E\u0639\u0652\u062F\u064E \u0625\u0650\u0635\u0652\u0644\u064E\u0627\u062D\u0650\u0647\u064E\u0627',
      verseRef: { ar: 'الأعراف: 56', en: 'Al-A\'raf 7:56', fr: 'Al-A\'raf 7:56' }
    }
  ],
  economic: [
    {
      emoji: '\u{1F4B2}', name: { ar: 'الزكاة والصدقة', en: 'Zakat and charity', fr: 'Zakat et charite' },
      desc: { ar: 'الزكاة ليست مجرد ضريبة — إنها نظام لإعادة توزيع الثروة يمنع تركزها في أيدي قليلة.', en: 'Zakat is not merely a tax — it is a wealth redistribution system that prevents concentration in few hands.', fr: 'La zakat n\'est pas simplement un impot — c\'est un systeme de redistribution des richesses.' },
      steps: [
        { ar: 'احسب زكاتك بدقة وأدّها في وقتها', en: 'Calculate your zakat accurately and pay it on time', fr: 'Calculez votre zakat avec precision et payez-la a temps' },
        { ar: 'تصدق فوق الزكاة ما استطعت', en: 'Give charity beyond zakat as much as you can', fr: 'Donnez en charite au-dela de la zakat autant que possible' },
        { ar: 'ابحث عن المستحقين الحقيقيين', en: 'Seek out the truly deserving', fr: 'Cherchez les vrais necessiteux' }
      ],
      verse: '\u062E\u064F\u0630\u0652 \u0645\u0650\u0646\u0652 \u0623\u064E\u0645\u0652\u0648\u064E\u0627\u0644\u0650\u0647\u0650\u0645\u0652 \u0635\u064E\u062F\u064E\u0642\u064E\u0629\u064B \u062A\u064F\u0637\u064E\u0647\u0651\u0650\u0631\u064F\u0647\u064F\u0645\u0652 \u0648\u064E\u062A\u064F\u0632\u064E\u0643\u0651\u0650\u064A\u0647\u0650\u0645 \u0628\u0650\u0647\u064E\u0627',
      verseRef: { ar: '\u0627\u0644\u062A\u0648\u0628\u0629: 103', en: 'At-Tawbah 9:103', fr: 'At-Tawbah 9:103' }
    },
    {
      emoji: '\u{2696}', name: { ar: 'الأجور العادلة ومنع الاستغلال', en: 'Fair wages and anti-exploitation', fr: 'Salaires equitables et anti-exploitation' },
      desc: { ar: 'أعطوا الأجير أجره قبل أن يجف عرقه. العامل له حق في أجر عادل يكفي حياة كريمة. استغلال حاجة الناس حرام.', en: 'Give the worker his wage before his sweat dries. The worker has the right to a fair wage that ensures a dignified life.', fr: 'Donnez au travailleur son salaire avant que sa sueur ne seche. Le travailleur a droit a un salaire equitable.' },
      steps: [
        { ar: 'إذا كنت صاحب عمل: ادفع أجورا عادلة', en: 'If you\'re an employer: pay fair wages', fr: 'Si vous etes employeur : payez des salaires equitables' },
        { ar: 'لا تستغل حاجة أحد لتقلل أجره', en: 'Don\'t exploit anyone\'s need to reduce their wage', fr: 'N\'exploitez pas le besoin de quiconque pour reduire son salaire' },
        { ar: 'ادعم حقوق العمال', en: 'Support workers\' rights', fr: 'Soutenez les droits des travailleurs' }
      ],
      verse: '\u0648\u064E\u0644\u064E\u0627 \u062A\u064E\u0628\u0652\u062E\u064E\u0633\u064F\u0648\u0627 \u0627\u0644\u0646\u0651\u064E\u0627\u0633\u064E \u0623\u064E\u0634\u0652\u064A\u064E\u0627\u0621\u064E\u0647\u064F\u0645\u0652',
      verseRef: { ar: '\u0627\u0644\u0623\u0639\u0631\u0627\u0641: 85', en: 'Al-A\'raf 7:85', fr: 'Al-A\'raf 7:85' }
    },
    {
      emoji: '\u{1F4AA}', name: { ar: 'إتقان العمل والاجتهاد', en: 'Work excellence and diligence', fr: 'Excellence au travail et diligence' },
      desc: { ar: 'إن الله يحب إذا عمل أحدكم عملا أن يتقنه. العمل عبادة. التواكل ليس توكلا — التوكل هو الأخذ بالأسباب مع الثقة بالله.', en: 'God loves that when one of you does work, they perfect it. Work is worship. Passive reliance is not trust — trust is taking action while relying on God.', fr: 'Dieu aime que quand l\'un de vous fait un travail, il le perfectionne. Le travail est un culte.' },
      steps: [
        { ar: 'أتقن عملك مهما كان صغيرا', en: 'Perfect your work no matter how small', fr: 'Perfectionnez votre travail aussi petit soit-il' },
        { ar: 'اعقلها وتوكل — خذ بالأسباب', en: 'Tie your camel and trust God — take action', fr: 'Attache ton chameau et fais confiance a Dieu — agis' },
        { ar: 'لا تستحِ من أي عمل شريف', en: 'Don\'t be ashamed of any honorable work', fr: 'N\'ayez pas honte d\'un travail honorable' }
      ],
      verse: '\u0648\u064E\u0642\u064F\u0644\u0650 \u0627\u0639\u0652\u0645\u064E\u0644\u064F\u0648\u0627 \u0641\u064E\u0633\u064E\u064A\u064E\u0631\u064E\u0649 \u0627\u0644\u0644\u0651\u064E\u0647\u064F \u0639\u064E\u0645\u064E\u0644\u064E\u0643\u064F\u0645\u0652',
      verseRef: { ar: '\u0627\u0644\u062A\u0648\u0628\u0629: 105', en: 'At-Tawbah 9:105', fr: 'At-Tawbah 9:105' }
    }
  ]
};

// ─── QUIZ DATA ───
const quizQuestions = [
  // Spiritual (4 questions)
  { cat: 'spiritual', q: {
    ar: 'هل تشعر بالخشوع في صلاتك عادة؟',
    en: 'Do you usually feel reverence (khushu) in your prayer?',
    fr: 'Ressentez-vous habituellement du recueillement (khushu) dans votre priere ?'
  }, opts: [
    { score: 0, text: { ar: 'نعم، غالبا', en: 'Yes, usually', fr: 'Oui, generalement' } },
    { score: 1, text: { ar: 'أحيانا', en: 'Sometimes', fr: 'Parfois' } },
    { score: 2, text: { ar: 'نادرا', en: 'Rarely', fr: 'Rarement' } },
    { score: 3, text: { ar: 'أبدا تقريبا', en: 'Almost never', fr: 'Presque jamais' } }
  ]},
  { cat: 'spiritual', q: {
    ar: 'هل تؤثر عبادتك (صلاة، صيام) على سلوكك اليومي؟',
    en: 'Does your worship (prayer, fasting) affect your daily behavior?',
    fr: 'Votre culte (priere, jeune) affecte-t-il votre comportement quotidien ?'
  }, opts: [
    { score: 0, text: { ar: 'نعم، بشكل واضح', en: 'Yes, clearly', fr: 'Oui, clairement' } },
    { score: 1, text: { ar: 'إلى حد ما', en: 'Somewhat', fr: 'Un peu' } },
    { score: 2, text: { ar: 'ليس كثيرا', en: 'Not much', fr: 'Pas beaucoup' } },
    { score: 3, text: { ar: 'لا أرى أي تأثير', en: 'I see no effect', fr: 'Je ne vois aucun effet' } }
  ]},
  { cat: 'spiritual', q: {
    ar: 'هل تراجع نيتك قبل القيام بعمل ما؟',
    en: 'Do you check your intention before doing something?',
    fr: 'Verifiez-vous votre intention avant de faire quelque chose ?'
  }, opts: [
    { score: 0, text: { ar: 'نعم دائما', en: 'Yes, always', fr: 'Oui, toujours' } },
    { score: 1, text: { ar: 'غالبا', en: 'Often', fr: 'Souvent' } },
    { score: 2, text: { ar: 'أحيانا', en: 'Sometimes', fr: 'Parfois' } },
    { score: 3, text: { ar: 'نادرا', en: 'Rarely', fr: 'Rarement' } }
  ]},
  { cat: 'spiritual', q: {
    ar: 'عندما تخطئ، هل تحاسب نفسك أم تلوم الظروف والشيطان؟',
    en: 'When you err, do you hold yourself accountable or blame circumstances and Satan?',
    fr: 'Quand vous faites une erreur, vous remettez-vous en question ou blamez-vous les circonstances et Satan ?'
  }, opts: [
    { score: 0, text: { ar: 'أحاسب نفسي دائما', en: 'I always hold myself accountable', fr: 'Je me remets toujours en question' } },
    { score: 1, text: { ar: 'غالبا أحاسب نفسي', en: 'I usually hold myself accountable', fr: 'Je me remets generalement en question' } },
    { score: 2, text: { ar: 'أميل للوم الظروف', en: 'I tend to blame circumstances', fr: 'J\'ai tendance a blamer les circonstances' } },
    { score: 3, text: { ar: 'دائما ألوم الشيطان والآخرين', en: 'I always blame Satan and others', fr: 'Je blame toujours Satan et les autres' } }
  ]},

  // Political (3 questions)
  { cat: 'political', q: {
    ar: 'هل تنطق بالحق عندما ترى ظلما في محيطك؟',
    en: 'Do you speak up when you see injustice around you?',
    fr: 'Parlez-vous quand vous voyez de l\'injustice autour de vous ?'
  }, opts: [
    { score: 0, text: { ar: 'نعم دائما', en: 'Yes, always', fr: 'Oui, toujours' } },
    { score: 1, text: { ar: 'أحيانا', en: 'Sometimes', fr: 'Parfois' } },
    { score: 2, text: { ar: 'نادرا بسبب الخوف', en: 'Rarely due to fear', fr: 'Rarement par peur' } },
    { score: 3, text: { ar: 'أبدا، أفضل السلامة', en: 'Never, I prefer safety', fr: 'Jamais, je prefere la securite' } }
  ]},
  { cat: 'political', q: {
    ar: 'هل تعتقد أن الشورى (التشاور) مهمة في مجتمعك؟',
    en: 'Do you believe consultation (shura) is important in your community?',
    fr: 'Croyez-vous que la consultation (choura) est importante dans votre communaute ?'
  }, opts: [
    { score: 0, text: { ar: 'نعم وأمارسها', en: 'Yes, and I practice it', fr: 'Oui, et je la pratique' } },
    { score: 1, text: { ar: 'نعم لكن لا أمارسها دائما', en: 'Yes but I don\'t always practice it', fr: 'Oui mais je ne la pratique pas toujours' } },
    { score: 2, text: { ar: 'ليست مهمة جدا', en: 'Not very important', fr: 'Pas tres importante' } },
    { score: 3, text: { ar: 'القرار للقائد وحده', en: 'The leader decides alone', fr: 'Le leader decide seul' } }
  ]},
  { cat: 'political', q: {
    ar: 'هل تميز بين الدين الحقيقي وتوظيف الدين لخدمة السلطة؟',
    en: 'Can you distinguish between genuine religion and religion used to serve power?',
    fr: 'Pouvez-vous distinguer entre la vraie religion et la religion utilisee pour servir le pouvoir ?'
  }, opts: [
    { score: 0, text: { ar: 'نعم بوضوح', en: 'Yes, clearly', fr: 'Oui, clairement' } },
    { score: 1, text: { ar: 'أحاول', en: 'I try', fr: 'J\'essaie' } },
    { score: 2, text: { ar: 'أحيانا يصعب التمييز', en: 'Sometimes it\'s hard to tell', fr: 'Parfois c\'est difficile' } },
    { score: 3, text: { ar: 'لا أفكر في الأمر', en: 'I don\'t think about it', fr: 'Je n\'y pense pas' } }
  ]},

  // Intellectual (3 questions)
  { cat: 'intellectual', q: {
    ar: 'هل تقرأ وتتعلم في مجالات متنوعة (دينية ودنيوية)؟',
    en: 'Do you read and learn in diverse fields (religious and worldly)?',
    fr: 'Lisez-vous et apprenez-vous dans des domaines divers (religieux et mondains) ?'
  }, opts: [
    { score: 0, text: { ar: 'نعم بانتظام', en: 'Yes, regularly', fr: 'Oui, regulierement' } },
    { score: 1, text: { ar: 'أحيانا', en: 'Sometimes', fr: 'Parfois' } },
    { score: 2, text: { ar: 'نادرا', en: 'Rarely', fr: 'Rarement' } },
    { score: 3, text: { ar: 'لا أقرأ تقريبا', en: 'I hardly read', fr: 'Je lis a peine' } }
  ]},
  { cat: 'intellectual', q: {
    ar: 'هل تتقبل الأفكار الجديدة وتناقشها بموضوعية؟',
    en: 'Do you accept new ideas and discuss them objectively?',
    fr: 'Acceptez-vous les nouvelles idees et les discutez-vous objectivement ?'
  }, opts: [
    { score: 0, text: { ar: 'نعم بانفتاح', en: 'Yes, with openness', fr: 'Oui, avec ouverture' } },
    { score: 1, text: { ar: 'أحيانا', en: 'Sometimes', fr: 'Parfois' } },
    { score: 2, text: { ar: 'أميل للرفض أولا', en: 'I tend to reject first', fr: 'J\'ai tendance a rejeter d\'abord' } },
    { score: 3, text: { ar: 'أرفض كل جديد', en: 'I reject anything new', fr: 'Je rejette tout ce qui est nouveau' } }
  ]},
  { cat: 'intellectual', q: {
    ar: 'هل تتحقق من صحة المعلومات الدينية قبل نشرها؟',
    en: 'Do you verify religious information before sharing it?',
    fr: 'Verifiez-vous les informations religieuses avant de les partager ?'
  }, opts: [
    { score: 0, text: { ar: 'دائما أتحقق', en: 'I always verify', fr: 'Je verifie toujours' } },
    { score: 1, text: { ar: 'غالبا', en: 'Usually', fr: 'Generalement' } },
    { score: 2, text: { ar: 'أحيانا', en: 'Sometimes', fr: 'Parfois' } },
    { score: 3, text: { ar: 'أنشر ما يصلني مباشرة', en: 'I share what I receive directly', fr: 'Je partage directement ce que je recois' } }
  ]},

  // Social (3 questions)
  { cat: 'social', q: {
    ar: 'هل تحافظ على التواصل مع أقاربك وجيرانك؟',
    en: 'Do you maintain contact with your relatives and neighbors?',
    fr: 'Maintenez-vous le contact avec vos proches et voisins ?'
  }, opts: [
    { score: 0, text: { ar: 'نعم بانتظام', en: 'Yes, regularly', fr: 'Oui, regulierement' } },
    { score: 1, text: { ar: 'أحيانا', en: 'Sometimes', fr: 'Parfois' } },
    { score: 2, text: { ar: 'نادرا', en: 'Rarely', fr: 'Rarement' } },
    { score: 3, text: { ar: 'لا أتواصل معهم', en: 'I don\'t contact them', fr: 'Je ne les contacte pas' } }
  ]},
  { cat: 'social', q: {
    ar: 'هل تعتقد أن تعليم المرأة وعملها حق شرعي؟',
    en: 'Do you believe that women\'s education and work is a legitimate right?',
    fr: 'Croyez-vous que l\'education et le travail des femmes sont un droit legitime ?'
  }, opts: [
    { score: 0, text: { ar: 'نعم بالتأكيد', en: 'Yes, absolutely', fr: 'Oui, absolument' } },
    { score: 1, text: { ar: 'نعم مع ضوابط', en: 'Yes, with guidelines', fr: 'Oui, avec des regles' } },
    { score: 2, text: { ar: 'لست متأكدا', en: 'I\'m not sure', fr: 'Je ne suis pas sur(e)' } },
    { score: 3, text: { ar: 'لا، مكانها البيت', en: 'No, her place is home', fr: 'Non, sa place est a la maison' } }
  ]},

  // Economic (2 questions)
  { cat: 'economic', q: {
    ar: 'هل تدفع الزكاة وتتصدق بانتظام؟',
    en: 'Do you pay zakat and give charity regularly?',
    fr: 'Payez-vous la zakat et faites-vous la charite regulierement ?'
  }, opts: [
    { score: 0, text: { ar: 'نعم بانتظام', en: 'Yes, regularly', fr: 'Oui, regulierement' } },
    { score: 1, text: { ar: 'أحيانا', en: 'Sometimes', fr: 'Parfois' } },
    { score: 2, text: { ar: 'نادرا', en: 'Rarely', fr: 'Rarement' } },
    { score: 3, text: { ar: 'لا أدفعها', en: 'I don\'t pay it', fr: 'Je ne la paie pas' } }
  ]},
  { cat: 'economic', q: {
    ar: 'هل تتحرى الحلال في كسبك ومعاملاتك المالية؟',
    en: 'Do you seek lawful (halal) earnings and financial dealings?',
    fr: 'Cherchez-vous des gains et des transactions financieres licites (halal) ?'
  }, opts: [
    { score: 0, text: { ar: 'نعم دائما', en: 'Yes, always', fr: 'Oui, toujours' } },
    { score: 1, text: { ar: 'غالبا', en: 'Often', fr: 'Souvent' } },
    { score: 2, text: { ar: 'أحيانا', en: 'Sometimes', fr: 'Parfois' } },
    { score: 3, text: { ar: 'لا أهتم كثيرا', en: 'I don\'t care much', fr: 'Je ne m\'en soucie pas beaucoup' } }
  ]}
];

// ─── DUAS DATA ───
const duas = [
  {
    ar: '\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u0647\u0652\u062F\u0650\u0646\u0650\u064A \u0648\u064E\u0633\u064E\u062F\u0651\u0650\u062F\u0652\u0646\u0650\u064A',
    trans: { ar: '', en: 'O God, guide me and make me steadfast', fr: 'O Dieu, guide-moi et affermis-moi' },
    ref: { ar: 'رواه مسلم', en: 'Reported by Muslim', fr: 'Rapporte par Muslim' }
  },
  {
    ar: '\u0631\u064E\u0628\u0651\u064E\u0646\u064E\u0627 \u0622\u062A\u0650\u0646\u064E\u0627 \u0641\u0650\u064A \u0627\u0644\u062F\u0651\u064F\u0646\u0652\u064A\u064E\u0627 \u062D\u064E\u0633\u064E\u0646\u064E\u0629\u064B \u0648\u064E\u0641\u0650\u064A \u0627\u0644\u0652\u0622\u062E\u0650\u0631\u064E\u0629\u0650 \u062D\u064E\u0633\u064E\u0646\u064E\u0629\u064B \u0648\u064E\u0642\u0650\u0646\u064E\u0627 \u0639\u064E\u0630\u064E\u0627\u0628\u064E \u0627\u0644\u0646\u0651\u064E\u0627\u0631\u0650',
    trans: { ar: '', en: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the Fire', fr: 'Notre Seigneur, donne-nous du bien dans ce monde et du bien dans l\'Au-dela, et protege-nous du Feu' },
    ref: { ar: 'البقرة: 201', en: 'Al-Baqarah 2:201', fr: 'Al-Baqarah 2:201' }
  },
  {
    ar: '\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0625\u0650\u0646\u0651\u0650\u064A \u0623\u064E\u0639\u064F\u0648\u0630\u064F \u0628\u0650\u0643\u064E \u0645\u0650\u0646\u064E \u0627\u0644\u0652\u0639\u064E\u062C\u0652\u0632\u0650 \u0648\u064E\u0627\u0644\u0652\u0643\u064E\u0633\u064E\u0644\u0650',
    trans: { ar: '', en: 'O God, I seek refuge in You from incapacity and laziness', fr: 'O Dieu, je cherche refuge aupres de Toi contre l\'incapacite et la paresse' },
    ref: { ar: 'رواه البخاري', en: 'Reported by Bukhari', fr: 'Rapporte par Bukhari' }
  },
  {
    ar: '\u0631\u064E\u0628\u0651\u0650 \u0627\u0634\u0652\u0631\u064E\u062D\u0652 \u0644\u0650\u064A \u0635\u064E\u062F\u0652\u0631\u0650\u064A \u0648\u064E\u064A\u064E\u0633\u0651\u0650\u0631\u0652 \u0644\u0650\u064A \u0623\u064E\u0645\u0652\u0631\u0650\u064A',
    trans: { ar: '', en: 'My Lord, expand my chest and ease my task', fr: 'Mon Seigneur, ouvre-moi ma poitrine et facilite-moi ma tache' },
    ref: { ar: 'طه: 25-26', en: 'Ta-Ha 20:25-26', fr: 'Ta-Ha 20:25-26' }
  },
  {
    ar: '\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0623\u064E\u0635\u0652\u0644\u0650\u062D\u0652 \u0644\u0650\u064A \u062F\u0650\u064A\u0646\u0650\u064A \u0627\u0644\u0651\u064E\u0630\u0650\u064A \u0647\u064F\u0648\u064E \u0639\u0650\u0635\u0652\u0645\u064E\u0629\u064F \u0623\u064E\u0645\u0652\u0631\u0650\u064A',
    trans: { ar: '', en: 'O God, set right my religion which is the safeguard of my affairs', fr: 'O Dieu, corrige ma religion qui est la sauvegarde de mes affaires' },
    ref: { ar: 'رواه مسلم', en: 'Reported by Muslim', fr: 'Rapporte par Muslim' }
  },
  // NEW duas
  {
    ar: '\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u0634\u0652\u0641\u0650\u0646\u0650\u064A \u0641\u064E\u0625\u0650\u0646\u0651\u064E\u0643\u064E \u0623\u064E\u0646\u062A\u064E \u0627\u0644\u0634\u0651\u064E\u0627\u0641\u0650\u064A \u0644\u064E\u0627 \u0634\u0650\u0641\u064E\u0627\u0621\u064E \u0625\u0650\u0644\u0651\u064E\u0627 \u0634\u0650\u0641\u064E\u0627\u0624\u064F\u0643\u064E',
    trans: { ar: '', en: 'O God, heal me, for You are the Healer. There is no healing except Your healing', fr: 'O Dieu, gueris-moi, car Tu es le Guerisseur. Il n\'y a de guerison que Ta guerison' },
    ref: { ar: 'رواه البخاري', en: 'Reported by Bukhari', fr: 'Rapporte par Bukhari' }
  },
  {
    ar: '\u0631\u064E\u0628\u0651\u064E\u0646\u064E\u0627 \u0623\u064E\u0641\u0652\u0631\u0650\u063A\u0652 \u0639\u064E\u0644\u064E\u064A\u0652\u0646\u064E\u0627 \u0635\u064E\u0628\u0652\u0631\u064B\u0627 \u0648\u064E\u062B\u064E\u0628\u0651\u0650\u062A\u0652 \u0623\u064E\u0642\u0652\u062F\u064E\u0627\u0645\u064E\u0646\u064E\u0627',
    trans: { ar: '', en: 'Our Lord, pour upon us patience and plant firmly our feet', fr: 'Notre Seigneur, verse sur nous la patience et affermis nos pas' },
    ref: { ar: 'البقرة: 250', en: 'Al-Baqarah 2:250', fr: 'Al-Baqarah 2:250' }
  },
  {
    ar: '\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0623\u064E\u0635\u0652\u0644\u0650\u062D\u0652 \u0623\u064F\u0645\u0651\u064E\u0629\u064E \u0645\u064F\u062D\u064E\u0645\u0651\u064E\u062F\u064D \u0635\u064E\u0644\u0651\u064E\u0649 \u0627\u0644\u0644\u0647\u064F \u0639\u064E\u0644\u064E\u064A\u0652\u0647\u0650 \u0648\u064E\u0633\u064E\u0644\u0651\u064E\u0645\u064E',
    trans: { ar: '', en: 'O God, reform the Ummah of Muhammad, peace be upon him', fr: 'O Dieu, reforme la Oumma de Muhammad, paix sur lui' },
    ref: { ar: 'دعاء مأثور', en: 'Traditional supplication', fr: 'Invocation traditionnelle' }
  }
];


// ══════════════════════════════════════════════
// INITIALIZATION
// ══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  applyLang(currentLang);
  initSplash();
  initTabs();
  initScrollTop();
  renderHome();
  renderAilments();
  renderRemedies();
  renderQuiz();
  renderAbout();
  renderDuaPanel();
  renderHelpPanel();
  initScrollReveal();
});

// ─── SPLASH ───
function initSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  const countEl = document.getElementById('splashCount');
  if (!countEl) return;
  let count = 5;
  const timer = setInterval(() => {
    count--;
    if (countEl) countEl.textContent = count;
    if (count <= 0) { clearInterval(timer); dismissSplash(); }
  }, 1000);
  splash._timer = timer;
}

function dismissSplash() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  if (!splash || splash.classList.contains('bye')) return;
  if (splash._timer) clearInterval(splash._timer);
  splash.classList.add('bye');
  playSound('open');
  setTimeout(() => splash.style.display = 'none', 700);
}

// ─── LANGUAGE ───
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('ummahClinicLang', lang);
  applyLang(lang);
  playSound('click');
  showToast(T.toastLang[lang]);
}

function applyLang(lang) {
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll('.lang-opt').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });

  { const _e=document.getElementById('tabHome'); if(_e) _e.textContent=T.tabHome[lang]; }
  { const _e=document.getElementById('tabAilments'); if(_e) _e.textContent=T.tabAilments[lang]; }
  { const _e=document.getElementById('tabRemedies'); if(_e) _e.textContent=T.tabRemedies[lang]; }
  { const _e=document.getElementById('tabQuiz'); if(_e) _e.textContent=T.tabQuiz[lang]; }
  { const _e=document.getElementById('tabAbout'); if(_e) _e.textContent=T.tabAbout[lang]; }

  const splashTitle = document.getElementById('splashTitle');
  if (!splashTitle) return;
  const splashHint = document.getElementById('splashHint');
  if (!splashHint) return;
  if (splashTitle) splashTitle.textContent = T.appTitle[lang];
  if (splashHint) splashHint.textContent = T.splashHint[lang];


  { const _e=document.getElementById('logoTitle'); if(_e) _e.textContent=T.appTitle[lang]; }
  { const _e=document.getElementById('duaPanelTitle'); if(_e) _e.textContent='\u{1F932} ' + T.duaTitle[lang]; }

  renderHome();
  renderAilments();
  renderRemedies();
  renderQuiz();
  renderAbout();
  renderDuaPanel();
  renderHelpPanel();
  initScrollReveal();
}

// ─── THEME ───
function cycleTheme() {
  const themes = ['clinic', 'night', 'healing'];
  const idx = themes.indexOf(currentTheme);
  currentTheme = themes[(idx + 1) % themes.length];
  applyTheme(currentTheme);
  localStorage.setItem('ummahClinicTheme', currentTheme);
  playSound('click');
  showToast(T.toastTheme[currentLang] + ' \u2014 ' + T.themeNames[currentTheme][currentLang]);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('themeIcon');
  if (!icon) return;
  if (icon) icon.textContent = T.themeIcons[theme] || '\u{1F3E5}';
  const colors = { clinic: '#009688', night: '#111d1b', healing: '#43A047' };
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = colors[theme] || '#009688';
}

// ─── TABS ───
function initTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + target).classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playSound('click');
      setTimeout(initScrollReveal, 100);
    });
  });
}

function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabName);
  });
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + tabName).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  playSound('click');
  setTimeout(initScrollReveal, 100);
  // Auto-render quiz when switching to quiz tab
  if (name === 'quiz' && document.getElementById('quizContainer') && !document.getElementById('quizContainer').innerHTML.trim()) {
    renderQuiz();
  }
}

// ─── SCROLL TO TOP ───
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  });
}

// ─── SCROLL REVEAL (IntersectionObserver) ───
function initScrollReveal() {
  const els = document.querySelectorAll('.ailment-card, .remedy-card, .stat-card, .about-card, .blind-driver-card, .daily-presc-card, .qnav-btn');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('sr-visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('sr-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => {
    if (!el.classList.contains('sr-visible')) {
      obs.observe(el);
    }
  });
}

// ─── DAILY PRESCRIPTION ───
function getDailyPrescription() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const idx = dayOfYear % ailmentsData.length;
  return ailmentsData[idx];
}

// ─── SHARE CARD ───
function shareCard(text) {
  if (navigator.share) {
    navigator.share({ text: text }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(T.shareCopied[currentLang]);
    }).catch(() => {});
  }
}

// ─── BLIND DRIVER SLIDER ───
function updateBlindSlider(val) {
  const lang = currentLang;
  const stateEl = document.getElementById('blindSliderState');
  if (!stateEl) return;
  const visualEl = document.getElementById('blindSliderVisual');
  if (!visualEl) return;
  if (!stateEl || !visualEl) return;
  val = parseInt(val);
  let stateText, opacity, hue;
  if (val <= 25) {
    stateText = T.blindDriverStateBlind[lang];
    opacity = 0.15; hue = 0;
  } else if (val <= 50) {
    stateText = T.blindDriverStateDim[lang];
    opacity = 0.4; hue = 30;
  } else if (val <= 75) {
    stateText = T.blindDriverStatePartial[lang];
    opacity = 0.7; hue = 90;
  } else {
    stateText = T.blindDriverStateSeeing[lang];
    opacity = 1; hue = 150;
  }
  stateEl.textContent = stateText;
  visualEl.style.opacity = opacity;
  visualEl.style.filter = 'hue-rotate(' + hue + 'deg)';
}

// ─── RENDER HOME ───
function renderHome() {
  const lang = currentLang;
  const panel = document.getElementById('panel-home');
  if (!panel) return;
  const totalAilments = ailmentsData.length;
  const totalRemedies = Object.values(remediesData).reduce((s,a) => s + a.length, 0);
  const daily = getDailyPrescription();

  panel.innerHTML = `
    <div class="home-hero">
      <div class="home-hero-icon">\u{1FA7A}</div>
      <div class="home-hero-title">${T.homeTitle[lang]}</div>
      <div class="home-hero-sub">${T.homeDesc[lang]}</div>
    </div>

    <div class="daily-presc-card">
      <div class="dp-header">
        <span class="dp-icon">\u{1F4CB}</span>
        <span class="dp-title">${T.dailyPrescTitle[lang]}</span>
      </div>
      <div class="dp-body">
        <div class="dp-ailment">
          <span class="dp-label dp-label-ailment">\u{1F9A0} ${T.dailyPrescAilment[lang]}</span>
          <span class="dp-text">${daily.emoji} ${daily.name[lang]}</span>
        </div>
        <div class="dp-remedy">
          <span class="dp-label dp-label-remedy">\u{1F48A} ${T.dailyPrescRemedy[lang]}</span>
          <span class="dp-text">${daily.remedy[lang]}</span>
        </div>
        <div class="dp-verse">${daily.verse}</div>
      </div>
    </div>

    <div class="blind-driver-card">
      <div class="bdc-header">
        <div class="bdc-icon">\u{1F698}</div>
        <div class="bdc-title">${T.blindDriverTitle[lang]}</div>
      </div>
      <div class="bdc-text">${T.blindDriverText[lang]}</div>
      <div class="bdc-analogy"><strong>\u{26A0}\u{FE0F}</strong> ${T.blindDriverAnalogy[lang]}</div>
      <div class="bdc-slider-wrap">
        <div class="bdc-slider-labels">
          <span class="bdc-sl-blind">\u{1F441}\u{FE0F}\u{200D}\u{1F5E8}\u{FE0F} ${T.blindDriverBlind[lang]}</span>
          <span class="bdc-sl-seeing">\u{2728} ${T.blindDriverSeeing[lang]}</span>
        </div>
        <input type="range" min="0" max="100" value="10" class="bdc-slider" id="blindSlider" oninput="updateBlindSlider(this.value)">
        <div class="bdc-slider-label">${T.blindDriverSliderLabel[lang]}</div>
        <div class="bdc-slider-visual" id="blindSliderVisual">\u{1F698}</div>
        <div class="bdc-slider-state" id="blindSliderState">${T.blindDriverStateBlind[lang]}</div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card"><div class="stat-num">${totalAilments}</div><div class="stat-label">\u{1F9A0} ${T.statAilments[lang]}</div></div>
      <div class="stat-card"><div class="stat-num">${totalRemedies}</div><div class="stat-label">\u{1F48A} ${T.statRemedies[lang]}</div></div>
      <div class="stat-card"><div class="stat-num">5</div><div class="stat-label">\u{1F4CB} ${T.statCategories[lang]}</div></div>
      <div class="stat-card"><div class="stat-num">${quizQuestions.length}</div><div class="stat-label">\u{1FA7A} ${T.quizQuestion[lang]}</div></div>
    </div>

    <div class="quick-nav">
      <a class="qnav-btn" href="javascript:void(0)" onclick="switchTab('ailments')">
        <span class="qnav-icon">\u{1F9A0}</span>
        <span class="qnav-text">${T.qnavAilments[lang]}</span>
      </a>
      <a class="qnav-btn" href="javascript:void(0)" onclick="switchTab('remedies')">
        <span class="qnav-icon">\u{1F48A}</span>
        <span class="qnav-text">${T.qnavRemedies[lang]}</span>
      </a>
      <a class="qnav-btn" href="javascript:void(0)" onclick="switchTab('quiz')">
        <span class="qnav-icon">\u{1FA7A}</span>
        <span class="qnav-text">${T.qnavQuiz[lang]}</span>
      </a>
      <a class="qnav-btn" href="javascript:void(0)" onclick="switchTab('about')">
        <span class="qnav-icon">\u{1F4D6}</span>
        <span class="qnav-text">${T.qnavAbout[lang]}</span>
      </a>
    </div>
  `;
}

// ─── RENDER AILMENTS ───
function renderAilments() {
  const lang = currentLang;
  const panel = document.getElementById('panel-ailments');
  let html = '';

  categories.forEach(cat => {
    const items = ailmentsData.filter(a => a.cat === cat.id);
    const rems = remediesData[cat.id] || [];
    html += `<div class="cat-section" id="ailcat-${cat.id}">
      <div class="cat-header" onclick="toggleCategory('ailcat-${cat.id}')">
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-title">${T[cat.nameKey][lang]}</span>
        <span class="cat-count">${items.length}</span>
        <span class="cat-chev">\u25BC</span>
      </div>
      <div class="cat-body"><div class="cat-cards">`;

    items.forEach((a, i) => {
      const uid = `ail-${cat.id}-${i}`;
      const shareText = `${a.name[lang]} \u2014 ${a.diagnosis[lang]}`;
      const remLink = rems.length > 0 ? `<a class="see-remedy-link" href="javascript:void(0)" onclick="event.stopPropagation();switchTab('remedies');setTimeout(function(){var el=document.getElementById('remcat-${cat.id}');if(el){el.classList.add('open');el.scrollIntoView({behavior:'smooth',block:'start'})}},200)">\u{1F48A} ${T.seeRemedy[lang]} \u2192</a>` : '';
      html += `<div class="ailment-card" id="${uid}">
        <div class="ac-head" onclick="toggleCard('${uid}')">
          <span class="ac-emoji">${a.emoji}</span>
          <span class="ac-title">${a.name[lang]}</span>
          <span class="ac-chev">\u25BC</span>
        </div>
        <div class="ac-body"><div class="ac-inner">
          <div class="ac-section">
            <div class="ac-section-title">\u{1F50D} ${T.whatItLooks[lang]}</div>
            <div class="ac-section-text">${a.daily[lang]}</div>
          </div>
          <div class="ac-section">
            <div class="ac-section-title diagnosis">\u{1FA7A} ${T.whyDangerous[lang]}</div>
            <div class="ac-section-text">${a.diagnosis[lang]}</div>
          </div>
          <div class="ac-section">
            <div class="ac-section-title remedy">\u{1F48A} ${T.prescribedRemedy[lang]}</div>
            <div class="ac-section-text">${a.remedy[lang]}</div>
          </div>
          <div class="ac-verse">
            <div class="ac-verse-ar">${a.verse}</div>
            <div class="ac-verse-ref">${a.verseRef[lang]}</div>
          </div>
          <div class="card-actions">
            ${remLink}
            <button class="share-btn" onclick="event.stopPropagation();shareCard('${shareText.replace(/'/g, "\\'")}')" title="${T.shareCard[lang]}">
              \u{1F4E4} ${T.shareCard[lang]}
            </button>
          </div>
        </div></div>
      </div>`;
    });

    html += `</div></div></div>`;
  });

  panel.innerHTML = html;
}

// ─── RENDER REMEDIES ───
function renderRemedies() {
  const lang = currentLang;
  const panel = document.getElementById('panel-remedies');
  let html = '';

  categories.forEach(cat => {
    const items = remediesData[cat.id] || [];
    html += `<div class="cat-section" id="remcat-${cat.id}">
      <div class="cat-header" onclick="toggleCategory('remcat-${cat.id}')">
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-title">${T[cat.remNameKey][lang]}</span>
        <span class="cat-count">${items.length}</span>
        <span class="cat-chev">\u25BC</span>
      </div>
      <div class="cat-body"><div class="cat-cards">`;

    items.forEach((r, i) => {
      const uid = `rem-${cat.id}-${i}`;
      const shareText = `${r.name[lang]} \u2014 ${r.desc[lang]}`;
      html += `<div class="remedy-card" id="${uid}">
        <div class="rc-head" onclick="toggleCard('${uid}')">
          <span class="rc-emoji">${r.emoji}</span>
          <span class="rc-title">${r.name[lang]}</span>
          <span class="rc-chev">\u25BC</span>
        </div>
        <div class="rc-body"><div class="rc-inner">
          <div class="rc-section">
            <div class="rc-section-title">\u{1F49A} ${T.howItHeals[lang]}</div>
            <div class="rc-section-text">${r.desc[lang]}</div>
          </div>
          <div class="rc-section">
            <div class="rc-section-title">\u{1F4CB} ${T.practicalSteps[lang]}</div>
            <ul class="rc-steps">
              ${r.steps.map((s, si) => `<li><span class="rc-step-num">${si + 1}</span>${s[lang]}</li>`).join('')}
            </ul>
          </div>
          <div class="rc-verse">
            <div class="rc-verse-ar">${r.verse}</div>
            <div class="rc-verse-ref">${r.verseRef[lang]}</div>
          </div>
          <div class="card-actions">
            <button class="share-btn" onclick="event.stopPropagation();shareCard('${shareText.replace(/'/g, "\\'")}')" title="${T.shareCard[lang]}">
              \u{1F4E4} ${T.shareCard[lang]}
            </button>
          </div>
        </div></div>
      </div>`;
    });

    html += `</div></div></div>`;
  });

  panel.innerHTML = html;
}

// ─── RENDER QUIZ ───
let quizCurrent = 0;
let quizAnswers = {};

function renderQuiz() {
  const lang = currentLang;
  const panel = document.getElementById('panel-quiz');
  if (!panel) return;

  const saved = JSON.parse(localStorage.getItem('ummahClinicQuiz') || 'null');
  if (saved && saved.completed) {
    quizAnswers = saved.answers || {};
    renderQuizResults();
    return;
  }
  if (saved && saved.answers) {
    quizAnswers = saved.answers;
    quizCurrent = saved.current || 0;
  }

  panel.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-intro" id="quizIntro">
        <div class="quiz-intro-icon">\u{1FA7A}</div>
        <div class="quiz-intro-title">${T.quizTitle[lang]}</div>
        <div class="quiz-intro-text">${T.quizDesc[lang]}</div>
        <button class="quiz-start-btn" onclick="startQuiz()">${T.quizStart[lang]}</button>
      </div>
      <div id="quizBody" style="display:none"></div>
    </div>
  `;

  if (saved && saved.answers && Object.keys(saved.answers).length > 0) {
    startQuiz();
  }
}

function startQuiz() {
  document.getElementById('quizIntro').style.display = 'none';
  document.getElementById('quizBody').style.display = 'block';
  renderQuizQuestion();
  playSound('open');
}

function renderQuizQuestion() {
  const lang = currentLang;
  const body = document.getElementById('quizBody');
  if (!body) return;
  const q = quizQuestions[quizCurrent];
  const total = quizQuestions.length;
  const progress = ((quizCurrent) / total) * 100;

  body.innerHTML = `
    <div class="quiz-progress">
      <div class="quiz-pbar"><div class="quiz-pfill" style="width:${progress}%"></div></div>
      <div class="quiz-ptext">${T.quizQuestion[lang]} ${quizCurrent + 1} ${T.quizOf[lang]} ${total}</div>
    </div>
    <div class="quiz-question-card">
      <div class="quiz-q-text">${q.q[lang]}</div>
      <div class="quiz-options">
        ${q.opts.map((opt, i) => `
          <div class="quiz-option ${quizAnswers[quizCurrent] === i ? 'selected' : ''}" onclick="selectQuizOption(${i})">
            <span class="quiz-option-dot"></span>
            <span>${opt.text[lang]}</span>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="quiz-nav">
      ${quizCurrent > 0 ? `<button class="quiz-nav-btn" onclick="quizPrev()">${T.quizPrev[lang]}</button>` : ''}
      ${quizCurrent < total - 1
        ? `<button class="quiz-nav-btn primary" onclick="quizNext()">${T.quizNext[lang]}</button>`
        : `<button class="quiz-nav-btn primary" onclick="submitQuiz()">${T.quizSubmit[lang]}</button>`
      }
    </div>
  `;
}

function selectQuizOption(idx) {
  quizAnswers[quizCurrent] = idx;
  localStorage.setItem('ummahClinicQuiz', JSON.stringify({ answers: quizAnswers, current: quizCurrent, completed: false }));
  renderQuizQuestion();
  playSound('click');
}

function quizNext() {
  if (quizAnswers[quizCurrent] === undefined) return;
  quizCurrent++;
  renderQuizQuestion();
  playSound('click');
}

function quizPrev() {
  if (quizCurrent > 0) quizCurrent--;
  renderQuizQuestion();
  playSound('click');
}

function submitQuiz() {
  if (quizAnswers[quizCurrent] === undefined) return;
  localStorage.setItem('ummahClinicQuiz', JSON.stringify({ answers: quizAnswers, completed: true }));
  showToast(T.toastQuizSaved[currentLang]);
  playSound('success');
  renderQuizResults();
}

function renderQuizResults() {
  const lang = currentLang;
  const panel = document.getElementById('panel-quiz');

  const scores = {};
  const maxScores = {};
  quizQuestions.forEach((q, i) => {
    if (!scores[q.cat]) { scores[q.cat] = 0; maxScores[q.cat] = 0; }
    maxScores[q.cat] += 3;
    if (quizAnswers[i] !== undefined) {
      scores[q.cat] += q.opts[quizAnswers[i]].score;
    }
  });

  let resultsHtml = '';
  categories.forEach(cat => {
    if (!scores[cat.id] && scores[cat.id] !== 0) return;
    const score = scores[cat.id];
    const max = maxScores[cat.id];
    const pct = Math.round((score / max) * 100);
    let level, levelClass, advice;
    if (pct >= 60) {
      level = T.quizHigh[lang]; levelClass = 'high';
      advice = {
        ar: 'هذا المجال يحتاج اهتماما عاجلا. راجع قسم الأدوية للعلاج.',
        en: 'This area needs urgent attention. Review the Remedies section for treatment.',
        fr: 'Ce domaine necessite une attention urgente. Consultez la section Remedes pour le traitement.'
      };
    } else if (pct >= 30) {
      level = T.quizMedium[lang]; levelClass = 'medium';
      advice = {
        ar: 'هذا المجال يحتاج بعض الانتباه والتحسين.',
        en: 'This area needs some attention and improvement.',
        fr: 'Ce domaine necessite un peu d\'attention et d\'amelioration.'
      };
    } else {
      level = T.quizLow[lang]; levelClass = 'low';
      advice = {
        ar: 'أنت في حالة جيدة في هذا المجال. استمر!',
        en: 'You are in good condition in this area. Keep it up!',
        fr: 'Vous etes en bonne condition dans ce domaine. Continuez !'
      };
    }

    resultsHtml += `
      <div class="quiz-result-cat">
        <div class="qrc-header">
          <span class="qrc-icon">${cat.icon}</span>
          <span class="qrc-name">${T[cat.nameKey][lang]}</span>
          <span class="qrc-score ${levelClass}">${level}</span>
        </div>
        <div class="qrc-bar"><div class="qrc-fill ${levelClass}" style="width:${pct}%"></div></div>
        <div class="qrc-pct">${pct}%</div>
        <div class="qrc-advice">${advice[lang]}</div>
      </div>
    `;
  });

  panel.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-results">
        <div class="quiz-results-icon">\u{1F4CA}</div>
        <div class="quiz-results-title">${T.quizResultTitle[lang]}</div>
        <div class="quiz-result-cats">${resultsHtml}</div>
        <button class="quiz-reset-btn" onclick="resetQuiz()">${T.quizReset[lang]}</button>
      </div>
    </div>
  `;
}

function resetQuiz() {
  quizAnswers = {};
  quizCurrent = 0;
  localStorage.removeItem('ummahClinicQuiz');
  showToast(T.toastQuizReset[currentLang]);
  playSound('click');
  renderQuiz();
}

// ─── RENDER ABOUT ───
function renderAbout() {
  const lang = currentLang;
  const panel = document.getElementById('panel-about');
  if (!panel) return;

  panel.innerHTML = `
    <div class="about-section">
      <div class="about-card">
        <div class="about-title">\u{1F4D6} ${T.aboutBookTitle[lang]}</div>
        <div class="about-text"><p>${T.aboutBook[lang]}</p></div>
      </div>
    </div>
    <div class="about-section">
      <div class="about-card">
        <div class="about-title">\u{1F9D4} ${T.aboutAuthorTitle[lang]}</div>
        <div class="about-text"><p>${T.aboutAuthor[lang]}</p></div>
      </div>
    </div>
    <div class="about-section">
      <div class="about-card">
        <div class="about-title">\u{1F4DA} ${T.aboutSourcesTitle[lang]}</div>
        <div class="about-text"><p>${T.aboutSources[lang]}</p></div>
      </div>
    </div>
    <div class="about-section">
      <div class="about-card">
        <div class="about-title">\u{26A0}\u{FE0F} ${T.aboutDisclaimerTitle[lang]}</div>
        <div class="disclaimer-box"><p>${T.aboutDisclaimer[lang]}</p></div>
      </div>
    </div>
  `;
}

// ─── RENDER DUA PANEL ───
function renderDuaPanel() {
  const lang = currentLang;
  const container = document.getElementById('duaPanelContent');
  if (!container) return;
  container.innerHTML = duas.map(d => `
    <div class="dua-item">
      <div class="dua-ar">${d.ar}</div>
      ${d.trans[lang] ? `<div class="dua-trans">${d.trans[lang]}</div>` : ''}
      <div class="dua-ref">${d.ref[lang]}</div>
    </div>
  `).join('');
}

// ─── RENDER HELP PANEL ───
function renderHelpPanel() {
  const lang = currentLang;
  const body = document.getElementById('helpBody');
  { const _e=document.getElementById('helpTitle'); if(_e) _e.textContent='\u2753 ' + T.helpTitle[lang]; }

  const content = {
    ar: `
      <h3>\u{26A0}\u{FE0F} ${T.helpDisclaimer[lang]}</h3>
      <p>${T.aboutDisclaimer[lang]}</p>
      <h3>\u{1F9ED} ${T.helpNav[lang]}</h3>
      <ul>
        <li>استخدم الأزرار السفلية للتنقل بين الأقسام</li>
        <li>اضغط على أي بطاقة لفتحها وقراءة التفاصيل</li>
        <li>استخدم زر الأدعية (\u{1F932}) للوصول السريع للأدعية</li>
      </ul>
      <h3>\u{1F3A8} ${T.helpThemes[lang]}</h3>
      <ul>
        <li>\u{1F3E5} عيادة — السمة الافتراضية</li>
        <li>\u{1F319} ليل — الوضع المظلم</li>
        <li>\u{1F33F} شفاء — سمة خضراء هادئة</li>
      </ul>
      <h3>\u{1F91D} ${T.helpContrib[lang]}</h3>
      <p>هذا التطبيق مفتوح المصدر. يمكنك المساهمة عبر workshop-diy.org</p>
    `,
    en: `
      <h3>\u{26A0}\u{FE0F} ${T.helpDisclaimer[lang]}</h3>
      <p>${T.aboutDisclaimer[lang]}</p>
      <h3>\u{1F9ED} ${T.helpNav[lang]}</h3>
      <ul>
        <li>Use the bottom tabs to navigate between sections</li>
        <li>Tap any card to expand and read details</li>
        <li>Use the Duas button (\u{1F932}) for quick access to supplications</li>
      </ul>
      <h3>\u{1F3A8} ${T.helpThemes[lang]}</h3>
      <ul>
        <li>\u{1F3E5} Clinic — Default theme</li>
        <li>\u{1F319} Night — Dark mode</li>
        <li>\u{1F33F} Healing — Calm green theme</li>
      </ul>
      <h3>\u{1F91D} ${T.helpContrib[lang]}</h3>
      <p>This app is open source. You can contribute via workshop-diy.org</p>
    `,
    fr: `
      <h3>\u{26A0}\u{FE0F} ${T.helpDisclaimer[lang]}</h3>
      <p>${T.aboutDisclaimer[lang]}</p>
      <h3>\u{1F9ED} ${T.helpNav[lang]}</h3>
      <ul>
        <li>Utilisez les onglets du bas pour naviguer entre les sections</li>
        <li>Appuyez sur une carte pour l'ouvrir et lire les details</li>
        <li>Utilisez le bouton Duas (\u{1F932}) pour un acces rapide aux invocations</li>
      </ul>
      <h3>\u{1F3A8} ${T.helpThemes[lang]}</h3>
      <ul>
        <li>\u{1F3E5} Clinique — Theme par defaut</li>
        <li>\u{1F319} Nuit — Mode sombre</li>
        <li>\u{1F33F} Guerison — Theme vert calme</li>
      </ul>
      <h3>\u{1F91D} ${T.helpContrib[lang]}</h3>
      <p>Cette application est open source. Vous pouvez contribuer via workshop-diy.org</p>
    `
  };

  body.innerHTML = content[lang];
}

// ─── TOGGLE FUNCTIONS ───
function toggleCategory(id) {
  const el = document.getElementById(id);
  el.classList.toggle('open');
  playSound('click');
}

function toggleCard(id) {
  const el = document.getElementById(id);
  el.classList.toggle('open');
  playSound('click');
}

function toggleHelp() {
  const panel = document.getElementById('helpPanel');
  if (!panel) return;
  panel.classList.toggle('hidden');
  const btn = document.getElementById('helpBtn');
  if (btn) btn.setAttribute('aria-expanded', !panel.classList.contains('hidden'));
  playSound('click');
}

function toggleDuaPanel() {
  const panel = document.getElementById('duaPanel');
  if (!panel) return;
  panel.classList.toggle('hidden');
  const btn = document.getElementById('duaBtn');
  if (btn) btn.setAttribute('aria-expanded', !panel.classList.contains('hidden'));
  playSound('click');
}

// ─── TOAST ───
function showToast(msg) {
  const toast = document.getElementById('toastIndicator');
  if (!toast) return;
  const text = document.getElementById('toastMessage');
  if (!text) return;
  text.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ─── SOUND EFFECTS (Web Audio API) ───
function playSound(type) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.value = 0.04;

    switch (type) {
      case 'click':
        osc.frequency.value = 600;
        osc.type = 'sine';
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.start(); osc.stop(audioCtx.currentTime + 0.08);
        break;
      case 'open':
        osc.frequency.value = 400;
        osc.type = 'sine';
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.start(); osc.stop(audioCtx.currentTime + 0.2);
        break;
      case 'success':
        osc.frequency.value = 523;
        osc.type = 'sine';
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
        setTimeout(() => {
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.connect(gain2); gain2.connect(audioCtx.destination);
          osc2.frequency.value = 659; osc2.type = 'sine';
          gain2.gain.value = 0.04;
          gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
          osc2.start(); osc2.stop(audioCtx.currentTime + 0.3);
        }, 150);
        break;
    }
  } catch (e) { /* Audio not supported */ }
}

/* TICKER — rich trilingual content */
function startTicker(){
  var el=document.getElementById('tickerText');
  if(!el)return;
  var tips={
    ar:['🩺 ٢٠ علة و٢٠ دواء','💊 وصفة يومية للشفاء','🫀 القلوب الفارغة من الله أصل كل علة','🧠 الجهل ليس عذراً بل ذنب','🤲 اللّهُمّ اشفِ أُمَّتَنا','💡 Powered by workshop-diy.org'],
    en:['🩺 20 ailments & 20 remedies','💊 Daily healing prescription','🫀 Hearts emptied of God: the root cause','🧠 Ignorance is not an excuse but a sin','🤲 O God, heal our Ummah','💡 Powered by workshop-diy.org'],
    fr:['🩺 20 maux et 20 remèdes','💊 Prescription quotidienne de guérison','🫀 Les cœurs vidés de Dieu: la cause profonde','🧠 L\'ignorance n\'est pas une excuse mais un péché','🤲 Ô Dieu, guéris notre Oumma','💡 Powered by workshop-diy.org']
  };
  var lang=document.documentElement.lang||'ar';
  var msgs=tips[lang]||tips.ar;
  var txt=msgs.join('  ✦  ');
  el.innerHTML='<span class="tc">'+txt+'  ✦  </span><span class="tc" aria-hidden="true">'+txt+'  ✦  </span>';
  el.style.animation='tickerMarquee '+Math.max(25,txt.length*0.12)+'s linear infinite';
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',startTicker)}else{startTicker()}
