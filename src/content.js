/* Hand-written content for Utsav Sadhana. Long texts (Atharvashirsha, Sankatanashana stotram,
   Sukhakarta aarti, the 21 names) are not here: tools/build.mjs reads them verbatim from sources/
   and adds them as TEXTS. IAST is generated in the page from the Devanagari.

   A festival is data: add one to FESTIVALS (with its deity's mantras in DEITIES) and the app
   shows it. Dates are for Pune, from Drik Panchang (checked 16 Oct 2026). */

const DEITIES = [
	{
		id: "ganesha", name: "Ganesha", deva: "श्रीगणेश", day: "Wednesday, and every Chaturthi",
		about: "Remover of obstacles, worshipped first before any undertaking.",
		mantras: [
			{ id: "gam", name: "Mula mantra", deva: "ॐ गं गणपतये नमः", mean: "Om, salutations to Ganapati. 'Gam' is his seed syllable; the Atharvashirsha (verse 7) builds this mantra letter by letter.", count: 108, src: "Ganapati Atharvashirsha 7" },
			{ id: "vakratunda", name: "Vakratunda shloka", deva: "वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥", mean: "O curved-trunked one of great body, bright as a crore suns: make all my work free of obstacles, always.", count: 11, src: "Ganesha Pratah-smaranam (sanskritdocuments.org)" },
			{ id: "gayatri", name: "Ganesha Gayatri", deva: "एकदंताय विद्महे । वक्रतुण्डाय धीमहि ॥\nतन्नो दंतिः प्रचोदयात् ॥", mean: "We know the single-tusked one; we meditate on the curved-trunked one. May the tusked one inspire us.", count: 108, src: "Ganapati Atharvashirsha 8" },
			{ id: "shuklambara", name: "Dhyana shloka", deva: "शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् ।\nप्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ॥", mean: "Meditate on the all-pervading one clad in white, moon-coloured, four-armed, with a gracious face, so that every obstacle is calmed. Said before any puja or study.", count: 3, src: "Opening of the Ganesha Dvadashanama stotram" },
			{ id: "abhipsita", name: "Before any work", deva: "अभीप्सितार्थसिद्ध्यर्थं पूजितो यः सुरासुरैः ।\nसर्वविघ्नहरस्तस्मै गणाधिपतये नमः ॥", mean: "Salutations to the lord of the ganas, remover of all obstacles, whom gods and asuras worship to gain what they seek.", count: 3, src: "Ganesha Pratah-smaranam (sanskritdocuments.org)" },
		],
	},
	{
		id: "shiva", name: "Shiva", deva: "शिव", day: "Monday, Pradosh, Maha Shivaratri",
		about: "The auspicious one; destroyer of ignorance, lord of yogis.",
		mantras: [
			{ id: "panchakshari", name: "Panchakshari", deva: "ॐ नमः शिवाय", mean: "Om, salutations to Shiva. The five-syllable mantra of the Yajurveda's Shri Rudram.", count: 108, src: "Krishna Yajurveda, Shri Rudram (Namakam 8)" },
			{ id: "mrityunjaya", name: "Mahamrityunjaya", deva: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥", mean: "We worship the three-eyed one, fragrant, who makes us flourish. As a ripe cucumber falls free of its vine, may he free us from death, not from immortality. Chanted for health and protection.", count: 108, src: "Rigveda 7.59.12" },
		],
	},
	{
		id: "vishnu", name: "Vishnu", deva: "विष्णु", day: "Thursday, Ekadashi",
		about: "The preserver, who takes avatars to restore dharma.",
		mantras: [
			{ id: "ashtakshari", name: "Ashtakshari", deva: "ॐ नमो नारायणाय", mean: "Om, salutations to Narayana. The eight-syllable mantra.", count: 108, src: "Narayana Upanishad" },
			{ id: "dvadashakshari", name: "Dvadashakshari", deva: "ॐ नमो भगवते वासुदेवाय", mean: "Om, salutations to Bhagavan Vasudeva. The twelve-syllable mantra of the Bhagavata.", count: 108, src: "Bhagavata Purana" },
		],
	},
	{
		id: "krishna", name: "Krishna", deva: "श्रीकृष्ण", day: "Janmashtami, Ekadashi",
		about: "Vishnu's avatar; teacher of the Gita.",
		mantras: [
			{ id: "mahamantra", name: "Maha-mantra", deva: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे ।\nहरे राम हरे राम राम राम हरे हरे ॥", mean: "Calling on Hari, Krishna and Rama. Sixteen names, chanted on a mala.", count: 108, src: "Kali-santarana Upanishad" },
			{ id: "pranata", name: "Pranata-klesha-nashaya", deva: "कृष्णाय वासुदेवाय हरये परमात्मने ।\nप्रणतक्लेशनाशाय गोविन्दाय नमो नमः ॥", mean: "Salutations again and again to Krishna, son of Vasudeva, Hari, the supreme Self, Govinda, who ends the troubles of those who bow to him.", count: 11, src: "Bhagavata Purana" },
		],
	},
	{
		id: "rama", name: "Rama", deva: "श्रीराम", day: "Ram Navami",
		about: "Vishnu's avatar; the ideal king of the Ramayana.",
		mantras: [
			{ id: "trayodashakshari", name: "Taraka mantra", deva: "श्रीराम जय राम जय जय राम", mean: "Victory to Shri Rama. Samarth Ramdas's thirteen-syllable japa.", count: 108, src: "Samarth Ramdas tradition" },
			{ id: "ramarameti", name: "Rama nama", deva: "श्रीराम राम रामेति रमे रामे मनोरमे ।\nसहस्रनाम तत्तुल्यं रामनाम वरानने ॥", mean: "Shiva to Parvati: chanting 'Rama, Rama' is equal to the thousand names of Vishnu.", count: 3, src: "Vishnu Sahasranama, phalashruti" },
		],
	},
	{
		id: "hanuman", name: "Hanuman", deva: "हनुमान", day: "Tuesday, Saturday, Hanuman Jayanti",
		about: "Rama's devotee; strength, courage and service.",
		mantras: [
			{ id: "manojavam", name: "Manojavam", deva: "मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम् ।\nवातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये ॥", mean: "I take refuge in Rama's messenger: swift as the mind, fast as the wind, master of the senses, wisest of the wise, son of the wind, chief of the vanaras.", count: 11, src: "Ramaraksha stotram" },
			{ id: "ham", name: "Nama mantra", deva: "ॐ हं हनुमते नमः", mean: "Om, salutations to Hanuman.", count: 108, src: "Traditional" },
		],
	},
	{
		id: "durga", name: "Durga", deva: "दुर्गा", day: "Navratri, Tuesday, Friday",
		about: "The Divine Mother who destroys evil.",
		mantras: [
			{ id: "sarvamangala", name: "Sarva-mangala", deva: "सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके ।\nशरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥", mean: "Auspiciousness of all that is auspicious, gracious one who fulfils every aim, refuge, three-eyed Gauri, Narayani: salutations to you.", count: 11, src: "Devi Mahatmya 11.10" },
			{ id: "dum", name: "Nama mantra", deva: "ॐ दुं दुर्गायै नमः", mean: "Om, salutations to Durga.", count: 108, src: "Traditional" },
		],
	},
	{
		id: "lakshmi", name: "Lakshmi", deva: "महालक्ष्मी", day: "Friday, Diwali (Lakshmi Puja)",
		about: "Goddess of prosperity and well-being.",
		mantras: [
			{ id: "mahalakshmi", name: "Nama mantra", deva: "ॐ श्रीं महालक्ष्म्यै नमः", mean: "Om, salutations to Mahalakshmi. 'Shrim' is her seed syllable.", count: 108, src: "Traditional" },
			{ id: "lgayatri", name: "Lakshmi Gayatri", deva: "ॐ महालक्ष्म्यै च विद्महे विष्णुपत्न्यै च धीमहि ।\nतन्नो लक्ष्मीः प्रचोदयात् ॥", mean: "We know Mahalakshmi; we meditate on Vishnu's consort. May Lakshmi inspire us.", count: 108, src: "Traditional" },
		],
	},
	{
		id: "saraswati", name: "Saraswati", deva: "सरस्वती", day: "Vasant Panchami, before study",
		about: "Goddess of learning, speech and music.",
		mantras: [
			{ id: "saraswati-namas", name: "Before study", deva: "सरस्वति नमस्तुभ्यं वरदे कामरूपिणि ।\nविद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा ॥", mean: "Salutations to you, Saraswati, giver of boons. I begin my study; may it always succeed.", count: 3, src: "Traditional" },
			{ id: "aim", name: "Nama mantra", deva: "ॐ ऐं सरस्वत्यै नमः", mean: "Om, salutations to Saraswati. 'Aim' is her seed syllable.", count: 108, src: "Traditional" },
		],
	},
	{
		id: "surya", name: "Surya", deva: "सूर्य", day: "Sunday, Makar Sankranti, Chhath",
		about: "The sun, giver of light and health.",
		mantras: [
			{ id: "gayatri-savitri", name: "Gayatri mantra", deva: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि ।\nधियो यो नः प्रचोदयात् ॥", mean: "We meditate on the radiant light of the divine Savitr; may it inspire our minds.", count: 108, src: "Rigveda 3.62.10" },
			{ id: "suryaya", name: "Arghya mantra", deva: "ॐ सूर्याय नमः", mean: "Om, salutations to Surya. Said while offering water to the rising sun.", count: 12, src: "Traditional (first of the 12 Surya namaskara names is ॐ मित्राय नमः)" },
		],
	},
];

/* Days of a festival: "date" is the calendar day in Pune; "core" practices repeat each day. */
const FESTIVALS = [
	{
		id: "ganeshotsav", deity: "ganesha", status: "ready",
		name: "Ganeshotsav", deva: "गणेशोत्सव", sub: "Bhadrapada Shukla Chaturthi to Anant Chaturdashi",
		year: 2027, start: "2027-09-04", end: "2027-09-14",
		facts: [
			["Ganesh Chaturthi", "Saturday 4 September 2027"],
			["Madhyahna puja muhurat", "11:19 AM to 12:25 PM (best time for sthapana)"],
			["Chaturthi tithi", "2:18 PM, 3 Sep to 12:25 PM, 4 Sep"],
			["Do not look at the moon", "3 Sep, 2:18 PM to 8:31 PM, and 4 Sep, 9:44 AM to 9:13 PM"],
			["Anant Chaturdashi (visarjan)", "Tuesday 14 September 2027"],
		],
		factsSrc: "Drik Panchang, Pune, checked 16 Oct 2026",
		intro: "For ten days Ganapati is a guest in the home. The sadhana is simple and steady: welcome him at the right muhurat, worship him every morning and evening with durva, red flowers and modak, recite the Atharvashirsha, keep a daily japa, and send him off with the promise to come back next year.",
		durations: [
			{ days: 1.5, label: "1½ days", note: "Visarjan on 5 Sep, after the afternoon uttarpuja" },
			{ days: 5, label: "5 days", note: "Visarjan on 8 Sep, often with Gauri" },
			{ days: 7, label: "7 days", note: "Visarjan on 10 Sep" },
			{ days: 11, label: "Till Anant Chaturdashi", note: "Visarjan on 14 Sep, as Pune's mandals do" },
		],
		core: [
			{ id: "dhyana", time: "Morning", title: "Bath, lamp and dhyana", detail: "Light the lamp. Recite the dhyana shloka and Vakratunda shloka three times each.", mantra: "ganesha/shuklambara" },
			{ id: "puja", time: "Morning", title: "Panchopachara puja", detail: "Gandha (sandal paste), pushpa (red flowers, hibiscus), dhupa, dipa, naivedya. Offer 21 durva with the 21 names.", text: "names21" },
			{ id: "atharva", time: "Morning", title: "Atharvashirsha path", detail: "Recite once, slowly. On Chaturthi many families recite it 21 times.", text: "atharva" },
			{ id: "japa", time: "Any time", title: "Japa: ॐ गं गणपतये नमः", detail: "Your daily mala target, seated facing east or north.", mantra: "ganesha/gam", japa: true },
			{ id: "sankata", time: "Midday", title: "Sankatanashana stotram", detail: "The twelve names, from Narada. Recite once; three times if facing a difficulty.", text: "sankata" },
			{ id: "naivedya", time: "Midday", title: "Naivedya of modak", detail: "Ukadiche modak, laddu or jaggery with coconut. Share it as prasad." },
			{ id: "aarti", time: "Evening", title: "Aarti: Sukhakarta Dukhaharta", detail: "Morning and evening, with the whole household.", text: "aarti" },
			{ id: "reflect", time: "Night", title: "Quiet minute", detail: "Ganesha Gayatri 11 times, then one obstacle you will work on tomorrow.", mantra: "ganesha/gayatri" },
		],
		/* Ashtavinayak contemplation for days 2–9, in the traditional yatra order from Morgaon. */
		days: [
			{ date: "2027-09-04", tithi: "Chaturthi", title: "Sthapana", focus: "Install the murti in the madhyahna muhurat (11:19 AM–12:25 PM). Prana pratishtha and shodashopachara puja, 21 modak, 21 durva. Do not look at the moon tonight.", special: ["shodasha", "moon"] },
			{ date: "2027-09-05", tithi: "Rishi Panchami", title: "Mayureshwar, Morgaon", focus: "Honour the seven rishis. 1½-day Ganpati visarjan today after the uttarpuja. Contemplate Mayureshwar of Morgaon, first of the Ashtavinayak." },
			{ date: "2027-09-06", tithi: "Shashthi", title: "Siddhivinayak, Siddhatek", focus: "The only Ashtavinayak with the trunk turned right. Ask for success in one task you have been putting off." },
			{ date: "2027-09-07", tithi: "Saptami", title: "Ballaleshwar, Pali", focus: "Named after the boy devotee Ballal. A day for a child in the house to do the aarti." },
			{ date: "2027-09-08", tithi: "Ashtami", title: "Varadavinayak, Mahad", focus: "The giver of boons. 5-day visarjan today in many homes. If you keep Gauri, check your panchang for avahan, puja and visarjan (Anuradha, Jyeshtha and Mula nakshatras)." },
			{ date: "2027-09-09", tithi: "Navami", title: "Chintamani, Theur", focus: "The wish-fulfilling jewel that calms a restless mind. Add one extra mala of japa today." },
			{ date: "2027-09-10", tithi: "Dashami", title: "Girijatmaj, Lenyadri", focus: "Parvati's son, in a Buddhist-era cave. 7-day visarjan today." },
			{ date: "2027-09-11", tithi: "Ekadashi", title: "Vighneshwar, Ozar", focus: "Who defeated the demon Vighnasura. Name one obstacle and offer it." },
			{ date: "2027-09-12", tithi: "Dvadashi", title: "Mahaganapati, Ranjangaon", focus: "The form Shiva worshipped before defeating Tripurasura. Last of the eight." },
			{ date: "2027-09-13", tithi: "Trayodashi", title: "Gratitude", focus: "Recite the Atharvashirsha three times. Prepare for visarjan: modak, flowers, coconut." },
			{ date: "2027-09-14", tithi: "Anant Chaturdashi", title: "Uttarpuja and visarjan", focus: "Uttarpuja, aarti, ask forgiveness for any lapse, then visarjan. Say: Ganpati Bappa Morya, pudhchya varshi lavkar ya. It is also Anant Vrat for Vishnu.", special: ["shodasha", "visarjan"] },
		],
		samagri: [
			["Murti", "Clay (shadu) murti; it dissolves cleanly at visarjan"],
			["Seat", "Chowki or pat with a red or yellow cloth, rice heap (akshata)"],
			["Durva", "21 blades a day (three-tipped), tied in pairs or offered one by one"],
			["Flowers", "Red hibiscus (jaswand), marigold, a garland"],
			["Shami and mandar leaves", "If available; both are dear to Ganesha"],
			["Puja items", "Haldi, kumkum, sindoor, sandal paste, akshata, janeu, kapoor, agarbatti, ghee lamp"],
			["Naivedya", "21 ukadiche modak on the first day; fruits, coconut, jaggery"],
			["For abhisheka", "Panchamrit: milk, curd, ghee, honey, sugar; clean water"],
			["Tulsi", "By custom tulsi is kept away from Ganesha. Some traditions offer it on Chaturthi only."],
		],
		shodasha: ["Dhyana and avahana (invite)", "Asana (seat)", "Padya (water for the feet)", "Arghya (water for the hands)", "Achamana (water to sip)", "Snana (bath, panchamrit)", "Vastra (cloth)", "Yajnopavita (sacred thread)", "Gandha (sandal paste)", "Pushpa (flowers, durva)", "Dhupa (incense)", "Dipa (lamp)", "Naivedya (food offering)", "Tambula and dakshina", "Pradakshina and namaskara", "Mantra-pushpanjali"],
		moon: {
			why: "Seeing the moon on Bhadrapada Shukla Chaturthi brings mithya dosha, a false accusation. Krishna saw it and was accused of stealing the Syamantaka jewel.",
			deva: "सिंहः प्रसेनमवधीत्सिंहो जाम्बवता हतः ।\nसुकुमारक मारोदीस्तव ह्येष स्यमन्तकः ॥",
			mean: "The lion killed Prasena; Jambavan killed the lion. Do not cry, little one: this Syamantaka is yours. If you see the moon by mistake, recite this three times.",
			src: "Syamantaka story, Vishnu Purana and Bhagavata; verse as printed in vrata books",
		},
	},
	{
		id: "sankashti", deity: "ganesha", status: "ready", monthly: true,
		name: "Sankashti Chaturthi", deva: "संकष्टी चतुर्थी", sub: "Every Krishna Paksha Chaturthi",
		intro: "A monthly fast for Ganesha. Eat light or fast through the day, worship Ganesha in the evening, offer arghya to the moon when it rises, then break the fast. A Tuesday Sankashti is Angaraki, the most auspicious.",
		dates: [
			{ date: "2026-10-29", name: "Vakratunda", moon: "8:58 PM", note: "Same day as Karwa Chauth" },
			{ date: "2026-11-27", name: "Ganadhipa", moon: "9:53 PM" },
			{ date: "2026-12-26", name: "Akhuratha", moon: "8:49 PM" },
		],
		datesSrc: "Drik Panchang, Pune, checked 16 Oct 2026. Moonrise varies by city; check yours.",
		core: [
			{ id: "s-sankalpa", time: "Morning", title: "Sankalpa and fast", detail: "Take the vow to fast until moonrise: fruit, milk, sabudana, or water only." },
			{ id: "s-japa", time: "Any time", title: "Japa: ॐ गं गणपतये नमः", detail: "At least one mala.", mantra: "ganesha/gam", japa: true },
			{ id: "s-puja", time: "Evening", title: "Puja with durva and modak", detail: "21 durva with the 21 names, red flowers, modak.", text: "names21" },
			{ id: "s-sankata", time: "Evening", title: "Sankatanashana stotram", detail: "The stotram this day is named for.", text: "sankata" },
			{ id: "s-moon", time: "Moonrise", title: "Arghya to the moon", detail: "Water, milk, akshata and flowers offered to the rising moon. Then break the fast." },
			{ id: "s-aarti", time: "Night", title: "Aarti", detail: "Sukhakarta Dukhaharta.", text: "aarti" },
		],
	},
	{ id: "navratri", deity: "durga", status: "soon", name: "Navratri", deva: "नवरात्रि", sub: "Nine nights of the Goddess" },
	{ id: "diwali", deity: "lakshmi", status: "soon", name: "Diwali Lakshmi Puja", deva: "लक्ष्मीपूजन", sub: "Amavasya of Kartika" },
	{ id: "shivaratri", deity: "shiva", status: "soon", name: "Maha Shivaratri", deva: "महाशिवरात्रि", sub: "The great night of Shiva" },
	{ id: "ramnavami", deity: "rama", status: "soon", name: "Ram Navami", deva: "रामनवमी", sub: "Rama's birth" },
	{ id: "hanumanjayanti", deity: "hanuman", status: "soon", name: "Hanuman Jayanti", deva: "हनुमान जयंती", sub: "Chaitra Purnima" },
	{ id: "janmashtami", deity: "krishna", status: "soon", name: "Janmashtami", deva: "जन्माष्टमी", sub: "Krishna's birth at midnight" },
	{ id: "vasantpanchami", deity: "saraswati", status: "soon", name: "Vasant Panchami", deva: "वसंत पंचमी", sub: "Saraswati Puja" },
	{ id: "sankranti", deity: "surya", status: "soon", name: "Makar Sankranti", deva: "मकर संक्रांति", sub: "The sun turns north" },
];
