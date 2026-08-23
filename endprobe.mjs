import { chromium } from "playwright";
const LINK = process.env.LINK;
const NEWPASS = "Flow-Test-Pass-9182";
const errors = [];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
p.on("pageerror", (e) => errors.push(String(e)));

await p.goto(LINK, { waitUntil: "networkidle" });
console.log("صفحة تحديد الكلمة:", (await p.locator("h1, h2").first().innerText()).trim());
const pw = p.locator('input[type="password"]');
console.log("عدد حقول الكلمة  :", await pw.count());
await pw.nth(0).fill(NEWPASS);
await pw.nth(1).fill(NEWPASS);
await p.locator("button[type=submit]").first().click();
await p.waitForTimeout(3000);
console.log("بعد الحفظ        :", p.url().replace("http://127.0.0.1:8899", ""));

// دخول
await p.fill('input[type="email"]', "guest.flow@example.test");
await p.locator('input[type="password"]').first().fill(NEWPASS);
await p.locator("button[type=submit]").first().click();
await p.waitForTimeout(3000);
console.log("بعد الدخول       :", p.url().replace("http://127.0.0.1:8899", ""));

await p.goto("http://127.0.0.1:8899/ar/account/my-properties", { waitUntil: "networkidle" });
const t = await p.locator("body").innerText();
console.log("«وحداتي» فتحت    :", p.url().includes("my-properties") ? "✅" : "❌ اترمى بره");
console.log("الوحدة ظاهرة     :", t.includes("شقة اختبار التدفّق") ? "✅" : "❌");
console.log("حالتها           :", (t.match(/تحت المراجعة|في انتظار|pending/) || ["—"])[0]);
console.log("أخطاء            :", errors.length, errors.slice(0, 2));
await b.close();
