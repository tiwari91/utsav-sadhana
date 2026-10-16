// Build Utsav Sadhana: read the source texts verbatim, embed them with src/content.js and the
// Devanagari-to-IAST function into src/template.html.
//   node tools/build.mjs   -> build/artifact.html (for claude.ai) and index.html (standalone)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "sources");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const lines = (p) => read(p).split("\n");

// Group source lines into blocks: a short "॥ name ॥" line is a heading; a verse closes at its
// number (॥ 7॥) or at the next heading. Blank lines are layout only.
function blocks(src) {
	const out = [];
	let cur = [];
	const flush = () => { if (cur.length) out.push({ lines: cur }); cur = []; };
	for (const raw of src) {
		const l = raw.trim();
		if (!l) continue;
		const head = l.match(/^॥\s*([^॥०-९]{2,24}?)\s*॥$/);
		if (head && !/इति/.test(l)) { flush(); out.push({ head: head[1] }); continue; }
		cur.push(l);
		if (/॥\s*([०-९]+|धृ)\s*॥\s*$/.test(l) || /^॥\s*इति/.test(l)) flush();
	}
	flush();
	return out;
}
function between(arr, startRe, endRe) {
	const a = arr.findIndex((l) => startRe.test(l));
	const b = arr.findIndex((l, i) => i >= a && endRe.test(l));
	if (a < 0 || b < 0) throw new Error("markers not found: " + startRe + " / " + endRe);
	return arr.slice(a, b + 1);
}

const ath = lines("sources/atharva.deva.txt");
const sk = lines("sources/ganesha8.deva.txt");
const skMean = between(sk, /^Salutations to Lord Ganesha/, /due to the grace of Ganesha/).filter((l) => l.trim()).join("\n");
const names = lines("sources/mahAgaNapatyekaviMshatinAmAvalI.deva.txt").filter((l) => /^ॐ/.test(l.trim())).map((l) => l.trim().replace(/\s*।\s*[०-९]*\s*$/, ""));
if (names.length !== 21) throw new Error("expected 21 names, got " + names.length);

const TEXTS = {
	atharva: {
		title: "Ganapati Atharvashirsha", short: "Atharvashirsha", deva: "श्रीगणपत्यथर्वशीर्ष", lang: "sa",
		about: "The Upanishad of Ganapati, with its opening and closing shanti mantras. Recite slowly; the phalashruti (verses 11–14) describes the fruits.",
		blocks: blocks(between(ath, /॥ शान्ति पाठ ॥/, /॥ इति श्रीगणपत्यथर्वशीर्षं समाप्तम् ॥/)),
		src: "sanskritdocuments.org, atharva", url: "https://sanskritdocuments.org/doc_ganesha/atharva.html",
	},
	sankata: {
		title: "Sankatanashana Ganesha Stotram", short: "Sankatanashana stotram", deva: "संकटनाशनं गणेशस्तोत्रम्", lang: "sa",
		about: "Narada's hymn of twelve names, recited to clear difficulties, and on every Sankashti.",
		blocks: blocks(between(sk, /^श्रीगणेशाय नमः/, /^॥ इति श्रीनारदपुराणे/)),
		mean: skMean,
		src: "sanskritdocuments.org, ganesha8", url: "https://sanskritdocuments.org/doc_ganesha/ganesha8.html",
		credit: "Translation as given in the source. It notes that 'bhaktāvāsaṃ' (verse 1) varies between prints.",
	},
	aarti: {
		title: "Sukhakarta Dukhaharta", short: "the aarti", deva: "सुखकर्ता दुखहर्ता", lang: "mr",
		about: "Samarth Ramdas's Marathi aarti, sung first at every Ganesha aarti in Maharashtra. The refrain (धृ) follows each stanza.",
		blocks: blocks(lines("sources/sukhakarta.txt").filter((l) => !l.startsWith("#"))),
		mean: "1. Bringer of joy, remover of sorrow, whose grace leaves no trace of obstacles and fills us with love. Beautiful in every limb, smeared with sindoor, a pearl necklace shining at his throat.\nRefrain: Victory, victory to the auspicious one; the mere sight of you fulfils the mind's wishes.\n2. A jewelled ornament for you, son of Gauri; sandal paste, kumkum and saffron; a diamond-studded crown that suits you well; anklets jingling at your feet.\n3. Big-bellied, in yellow silk, with the king of serpents as a belt; straight trunk, curved face, three eyes. Rama's servant waits for you at home: come to us in trouble, protect us at the end, you whom the gods worship.",
		src: "Wikipedia, Sukhakarta Dukhaharta", url: "https://en.wikipedia.org/wiki/Sukhakarta_Dukhaharta",
		credit: "Checked against Marathi Wikipedia, which reads पूर्ती for पुरती in the refrain. Meaning is our summary.",
	},
	names21: {
		title: "21 names for the durva offering", short: "the 21 names", deva: "महागणपत्येकविंशतिनामावलिः", lang: "sa",
		about: "Offer one blade of durva (or a pair) with each name. Twenty-one is Ganesha's number: 21 durva, 21 modak.",
		names,
		src: "sanskritdocuments.org, Mahaganapati Ekavimshati Namavali", url: "https://sanskritdocuments.org/doc_ganesha/mahAgaNapatyekaviMshatinAmAvalI.html",
	},
};
for (const [k, t] of Object.entries(TEXTS)) if (!t.names && !t.blocks.some((b) => b.lines)) throw new Error("empty text " + k);

const stotra = fs.readFileSync(path.join(process.env.HOME, "stotra-reader/src/template.html"), "utf8");
const tl = stotra.slice(stotra.indexOf("// <translit>"), stotra.indexOf("// </translit>") + "// </translit>".length);
if (tl.length < 500) throw new Error("translit not found");

const page = read("src/template.html")
	.replace("/*CONTENT*/", () => read("src/content.js"))
	.replace("/*TEXTS*/", () => JSON.stringify(TEXTS))
	.replace("/*TRANSLIT*/", () => tl);
fs.mkdirSync(path.join(ROOT, "build"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "build/artifact.html"), page);
fs.writeFileSync(path.join(ROOT, "index.html"), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' + page + "</body></html>\n");
const count = Object.fromEntries(Object.entries(TEXTS).map(([k, t]) => [k, t.names ? t.names.length + " names" : t.blocks.filter((b) => b.lines).length + " verses"]));
console.log("built", (page.length / 1024).toFixed(0) + " KB", count);
