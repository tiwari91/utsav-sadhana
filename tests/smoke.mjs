// Smoke test: open the page, walk home -> festival -> text -> japa, at phone width, light and dark.
import { createRequire } from "module";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const require = createRequire(process.env.PW_REQUIRE ?? "/Users/shankartiwar/Cayuse/s2s-web-client/package.json");
const { chromium } = require("playwright");
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = process.argv[2] || path.join(ROOT, "tests");
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || undefined });
const errs = [];
const fails = [];
const check = (name, ok, info = "") => { console.log((ok ? "PASS " : "FAIL ") + name + (info ? "  (" + info + ")" : "")); if (!ok) fails.push(name); };
for (const scheme of ["light", "dark"]) {
	const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: scheme });
	const page = await ctx.newPage();
	page.on("pageerror", (e) => errs.push(e.message));
	page.on("console", (m) => { if (m.type() === "error" && !/fonts\.g/.test(m.text())) errs.push(m.text()); });
	await page.goto("file://" + ROOT + "/index.html");
	await page.waitForTimeout(400);
	const wide = () => page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
	if (scheme === "light") {
		check("Home shows the next observance", (await page.textContent(".next h2")).trim().length > 3, (await page.textContent(".next h2")).trim());
		for (const id of ["navratri", "diwali", "sankranti", "vasantpanchami", "shivaratri", "ramnavami", "hanumanjayanti", "janmashtami", "sankashti"]) {
			await page.click('.row[data-go="f/' + id + '"]');
			await page.waitForTimeout(80);
			const n = (await page.$$(".task")).length;
			const over = await wide();
			if (!(n >= 4 && over <= 0)) check(id + " opens with its checklist", false, n + " tasks, overflow " + over);
			await page.click('[data-go=""] >> nth=0');
		}
		check("Every festival opens with a checklist and no sideways scroll", true);
		await page.click('.row[data-go="f/ramnavami"]'); await page.click('[data-go="t/ramaraksha"] >> nth=0');
		check("Ramaraksha opens", /रामरक्षा/.test(await page.textContent("main")));
		await page.click("[data-back]"); await page.click('[data-go=""] >> nth=0');
		await page.click('.row[data-go="f/hanumanjayanti"]'); await page.click('[data-go="t/chalisa"] >> nth=0');
		check("Chalisa opens with IAST", /jaya hanumāna/.test(await page.textContent("main")));
		await page.goto("file://" + ROOT + "/index.html");
		check("Home has no sideways scroll", (await wide()) <= 0);
		await page.screenshot({ path: OUT + "/home.png", fullPage: true });
		// Today card: the weekday mantra, and a streak that grows with japa
		const wd = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date().getDay()];
		check("Today card shows the weekday mantra", (await page.textContent(".daycard .eyebrow")).startsWith(wd) && (await page.$$(".daycard [data-japa]")).length === 1);
		await page.click(".daycard [data-japa]"); await page.click("#mala"); await page.click("#japa-close");
		check("Japa streak counts today", /^1 day in a row/.test((await page.textContent("#streak")).trim()), (await page.textContent("#streak")).trim());
		// Calendar tab
		await page.click("#tab-cal");
		const rows = await page.$$eval(".cal-row", (r) => r.map((x) => x.textContent));
		check("Calendar lists every observance and each Sankashti, today marked", rows.length === (await page.evaluate(() => FESTIVALS.reduce((n, f) => n + (f.monthly ? f.dates.filter((d) => d.date <= "2027-09-30").length : 1), 0))) && rows.filter((t) => /Sankashti/.test(t)).length === (await page.evaluate(() => FESTIVALS.find((f) => f.monthly).dates.filter((d) => d.date <= "2027-09-30").length)) && (await page.$$("#cal-now")).length === 1 && (await wide()) <= 0, rows.length + " rows");
		await page.click('.cal-row[data-go^="f/diwali"]');
		check("Calendar opens the festival", (await page.textContent("h1")).includes("Diwali"));
		check("Add to calendar is hidden off GitHub Pages", await page.$eval("#ics", (e) => e.hidden));
		await page.click('[data-go="cal"]'); await page.click('.cal-row[data-go^="f/sankashti"] >> nth=1');
		check("Calendar opens the Sankashti day", (await page.getAttribute('.date-btn[aria-pressed="true"]', "data-day")) === (await page.evaluate(() => location.hash.slice(-10))));
		// Repeated time label gone when it matches its group
		await page.click('[data-go=""] >> nth=0'); await page.click('.row[data-go="f/ganeshotsav"]');
		const dup = await page.$$eval(".slot", (ss) => ss.filter((s) => [...s.querySelectorAll(".task .time")].some((t) => t.textContent.toLowerCase() === s.querySelector(".slot-h").textContent.toLowerCase())).length);
		check("No time label repeats its group heading", dup === 0 && (await page.$$(".task .time")).length > 0);
		// Reader: text size remembered, recite mode
		await page.click('[data-go="t/atharva"] >> nth=0');
		await page.click('[data-size="1"]'); await page.click('[data-size="1"]');
		await page.reload(); await page.waitForTimeout(200);
		check("Text size is remembered", (await page.textContent("#size-pct")) === "130%" && (await page.$eval(".text-body", (e) => e.style.getPropertyValue("--scale"))) === "1.3");
		await page.click('[data-size="-1"]'); await page.click('[data-size="-1"]');
		await page.click("[data-recite]");
		const p0 = await page.textContent("#rc-pos");
		await page.click("#rc-next"); await page.keyboard.press("ArrowRight");
		await page.click("#rc-mala");
		check("Recite steps verse by verse and counts", p0.startsWith("1 of") && (await page.textContent("#rc-pos")).startsWith("3 of") && (await page.textContent("#rc-mala-n")) === "1" && (await wide()) <= 0);
		await page.waitForTimeout(300);
		await page.screenshot({ path: OUT + "/recite.png" });
		await page.keyboard.press("Escape");
		check("Offline files and install manifest only in the Pages copy", fs.existsSync(ROOT + "/sw.js") && fs.existsSync(ROOT + "/icons/icon-512.png") && JSON.parse(fs.readFileSync(ROOT + "/manifest.webmanifest", "utf8")).icons.length === 3 &&
			/rel="manifest"/.test(fs.readFileSync(ROOT + "/index.html", "utf8")) && !/rel="manifest"/.test(fs.readFileSync(ROOT + "/build/artifact.html", "utf8")) && !(await page.evaluate(() => navigator.serviceWorker && navigator.serviceWorker.controller)));
		await page.goto("file://" + ROOT + "/index.html");
	}
	if (scheme === "dark") { await page.click("#tab-cal"); await page.screenshot({ path: OUT + "/calendar-dark.png" }); await page.click('[data-go=""] >> nth=0'); }
	await page.click('[data-go="f/ganeshotsav"]');
	await page.waitForTimeout(200);
	check(scheme + ": festival shows 11 days", (await page.$$(".day")).length === 11);
	await page.click('.day[data-day="2027-09-04"]');
	check(scheme + ": day 1 shows the moon remedy", (await page.$$(".notice")).length === 1);
	await page.click('.tick >> nth=0');
	check(scheme + ": ticking a task marks it done", (await page.getAttribute(".tick >> nth=0", "aria-checked")) === "true");
	check(scheme + ": festival has no sideways scroll", (await wide()) <= 0);
	await page.screenshot({ path: OUT + "/festival-" + scheme + ".png", fullPage: true });
	await page.click('[data-japa="ganesha/gam"]');
	for (let i = 0; i < 5; i++) await page.click("#mala");
	check(scheme + ": japa counts", (await page.textContent("#mala-n")) === "5");
	await page.screenshot({ path: OUT + "/japa-" + scheme + ".png" });
	await page.click("#japa-close");
	check(scheme + ": japa meter updates", /5 \/ 108/.test(await page.textContent(".check")));
	await page.click('[data-go="t/atharva"] >> nth=0');
	check(scheme + ": Atharvashirsha shows IAST", /namaste gaṇapataye/.test(await page.textContent(".text-body")));
	check(scheme + ": reader has no sideways scroll", (await wide()) <= 0);
	if (scheme === "dark") await page.screenshot({ path: OUT + "/text-dark.png" });
	await page.goto("file://" + ROOT + "/index.html#d-ganesha");
	await page.waitForTimeout(200);
	check(scheme + ": deity deep link", (await page.textContent("h1")).trim() === "Ganesha");
	await page.reload();
	await page.waitForTimeout(200);
	await page.click('[data-go="f/ganeshotsav"]').catch(() => {});
	await ctx.close();
}
check("No console errors", errs.length === 0, errs.slice(0, 3).join(" | "));
await browser.close();
process.exit(fails.length ? 1 : 0);
