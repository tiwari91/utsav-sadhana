// Smoke test: open the page, walk home -> festival -> text -> japa, at phone width, light and dark.
import { createRequire } from "module";
import path from "path";
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
		check("Home shows the next observance", /Sankashti|Ganeshotsav/.test(await page.textContent(".next")), (await page.textContent(".next h2")).trim());
		check("Home has no sideways scroll", (await wide()) <= 0);
		await page.screenshot({ path: OUT + "/home.png", fullPage: true });
	}
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
