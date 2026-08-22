# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> developer card opens the developer page
- Location: tests/e2e/smoke.spec.ts:258:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'مشاريع المطوّر' })
Expected: visible
Error: strict mode violation: getByRole('heading', { name: 'مشاريع المطوّر' }) resolved to 2 elements:
    1) <h2 class="mb-5 flex items-center gap-2 text-xl font-extrabold text-secondary">…</h2> aka getByRole('heading', { name: 'مشاريع المطوّر', exact: true })
    2) <h2 class="mb-1 text-xl font-extrabold text-secondary">استفسر عن مشاريع المطوّر</h2> aka getByRole('heading', { name: 'استفسر عن مشاريع المطوّر' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'مشاريع المطوّر' })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - link "+20 100 000 0000" [ref=e7] [cursor=pointer]:
        - /url: tel:+20 100 000 0000
      - link "info@example.com" [ref=e11] [cursor=pointer]:
        - /url: mailto:info@example.com
    - generic [ref=e16]:
      - link "facebook" [ref=e17] [cursor=pointer]:
        - /url: https://facebook.com/example
      - link "instagram" [ref=e20] [cursor=pointer]:
        - /url: https://instagram.com/example
      - link "linkedin" [ref=e23] [cursor=pointer]:
        - /url: https://linkedin.com/company/example
      - link "youtube" [ref=e26] [cursor=pointer]:
        - /url: https://youtube.com/@example
      - generic [ref=e29]: السبت – الخميس · 10ص – 8م
  - banner [ref=e30]:
    - generic [ref=e31]:
      - link "المنصة العقارية المنصة العقارية بوابتك الذكية لعقارات مصر" [ref=e32] [cursor=pointer]:
        - /url: /ar
        - img "المنصة العقارية" [ref=e33]
        - generic [ref=e34]:
          - generic [ref=e35]: المنصة العقارية
          - generic [ref=e36]: بوابتك الذكية لعقارات مصر
      - navigation [ref=e37]:
        - link "الرئيسية" [ref=e39] [cursor=pointer]:
          - /url: /ar
        - link "العقارات" [ref=e41] [cursor=pointer]:
          - /url: /ar/properties
        - link "عقارات تجارية" [ref=e43] [cursor=pointer]:
          - /url: /ar/properties/commercial
        - link "الكمبوندات" [ref=e45] [cursor=pointer]:
          - /url: /ar/compounds
        - link "المطوّرون" [ref=e47] [cursor=pointer]:
          - /url: /ar/developers
        - link "المناطق" [ref=e49] [cursor=pointer]:
          - /url: /ar/areas
        - link "المدونة" [ref=e51] [cursor=pointer]:
          - /url: /ar/blog
        - link "من نحن" [ref=e53] [cursor=pointer]:
          - /url: /ar/about
        - link "اتصل بنا" [ref=e55] [cursor=pointer]:
          - /url: /ar/contact
      - generic [ref=e56]:
        - button "EN" [ref=e57]
        - link "واتساب" [ref=e58] [cursor=pointer]:
          - /url: https://wa.me/201000000000
        - link "دخول" [ref=e61] [cursor=pointer]:
          - /url: /ar/login
        - link "احجز معاينة" [ref=e65] [cursor=pointer]:
          - /url: /ar/contact
  - main [ref=e66]:
    - generic [ref=e70]:
      - navigation [ref=e71]:
        - link "الرئيسية" [ref=e72] [cursor=pointer]:
          - /url: /ar
        - link "المطوّرون" [ref=e75] [cursor=pointer]:
          - /url: /ar/developers
      - heading "شركة المروج للتطوير" [level=1] [ref=e76]
      - paragraph [ref=e77]: القاهرة الجديدة
      - generic [ref=e79]:
        - generic [ref=e80]: ش
        - generic [ref=e82]:
          - generic [ref=e83]:
            - generic [ref=e84]: "2"
            - text: مشروع
          - generic [ref=e85]:
            - generic [ref=e86]: "4"
            - text: وحدة
          - generic [ref=e87]:
            - generic [ref=e88]: "2"
            - text: منطقة
    - generic [ref=e90]:
      - generic [ref=e92]:
        - generic [ref=e97]:
          - generic [ref=e98]: سنة التأسيس
          - generic [ref=e99]: "2005"
        - generic [ref=e105]:
          - generic [ref=e106]: المقر
          - generic [ref=e107]: القاهرة الجديدة
      - generic [ref=e109]:
        - heading "عن المطوّر" [level=2] [ref=e110]
        - generic [ref=e111]:
          - paragraph [ref=e112]: شركة تطوير عقاري بتشتغل على السكن المتوسط والفوق متوسط في شرق القاهرة والعاصمة الإدارية.
          - paragraph [ref=e113]: المشاريع بتتسلّم على مراحل معلنة في العقد، وأنظمة السداد بتتحدّد من الشركة نفسها مش من الوسيط.
      - generic [ref=e114]:
        - heading "مشاريع المطوّر" [level=2] [ref=e115]
        - generic [ref=e120]:
          - article [ref=e122]:
            - link "النخيل هايتس إطلاق جديد النخيل هايتس القاهرة الجديدة · شركة المروج للتطوير يبدأ من EGP 5,400,000 مقدم 5% تقسيط 8 سنوات تفاصيل الكمبوند" [ref=e123] [cursor=pointer]:
              - /url: /ar/compounds/nakheel-heights
              - generic [ref=e124]:
                - img "النخيل هايتس" [ref=e125]
                - generic [ref=e126]: إطلاق جديد
              - generic [ref=e127]:
                - heading "النخيل هايتس" [level=3] [ref=e128]
                - generic [ref=e129]: القاهرة الجديدة · شركة المروج للتطوير
                - generic [ref=e134]:
                  - generic [ref=e135]:
                    - generic [ref=e136]: يبدأ من
                    - generic [ref=e137]: EGP 5,400,000
                  - generic [ref=e139]:
                    - generic [ref=e140]: مقدم
                    - generic [ref=e141]: 5%
                  - generic [ref=e143]:
                    - generic [ref=e144]: تقسيط
                    - generic [ref=e145]: 8 سنوات
                - generic [ref=e146]: تفاصيل الكمبوند
          - article [ref=e150]:
            - link "سيلين ريزيدنس سيلين ريزيدنس العاصمة الإدارية · شركة المروج للتطوير يبدأ من EGP 4,300,000 مقدم 10% تقسيط 6 سنوات تفاصيل الكمبوند" [ref=e151] [cursor=pointer]:
              - /url: /ar/compounds/selene-residence
              - img "سيلين ريزيدنس" [ref=e153]
              - generic [ref=e154]:
                - heading "سيلين ريزيدنس" [level=3] [ref=e155]
                - generic [ref=e156]: العاصمة الإدارية · شركة المروج للتطوير
                - generic [ref=e161]:
                  - generic [ref=e162]:
                    - generic [ref=e163]: يبدأ من
                    - generic [ref=e164]: EGP 4,300,000
                  - generic [ref=e166]:
                    - generic [ref=e167]: مقدم
                    - generic [ref=e168]: 10%
                  - generic [ref=e170]:
                    - generic [ref=e171]: تقسيط
                    - generic [ref=e172]: 6 سنوات
                - generic [ref=e173]: تفاصيل الكمبوند
      - generic [ref=e176]:
        - generic [ref=e177]:
          - heading "وحدات متاحة" [level=2] [ref=e178]
          - link "شوف كل الوحدات" [ref=e182] [cursor=pointer]:
            - /url: /ar/properties?q=%D8%B4%D8%B1%D9%83%D8%A9%20%D8%A7%D9%84%D9%85%D8%B1%D9%88%D8%AC%20%D9%84%D9%84%D8%AA%D8%B7%D9%88%D9%8A%D8%B1
        - generic [ref=e185]:
          - article [ref=e187]:
            - button "احفظ" [ref=e189]
            - link "شقة 165م بجاردن خاصة في التجمع الخامس بيع عرض التفاصيل شقة 165م بجاردن خاصة في التجمع الخامس القاهرة الجديدة · شركة المروج للتطوير EGP 4,850,000 3 2 165 م²" [ref=e192] [cursor=pointer]:
              - /url: /ar/properties/apartment-165m-with-private-garden-in-fifth-settlement
              - generic [ref=e193]:
                - img "شقة 165م بجاردن خاصة في التجمع الخامس" [ref=e194]
                - generic [ref=e195]: بيع
                - generic [ref=e196]: عرض التفاصيل
              - generic [ref=e200]:
                - heading "شقة 165م بجاردن خاصة في التجمع الخامس" [level=3] [ref=e201]
                - generic [ref=e202]:
                  - generic [ref=e206]: القاهرة الجديدة
                  - generic [ref=e207]: ·
                  - generic [ref=e212]: شركة المروج للتطوير
                - generic [ref=e213]: EGP 4,850,000
                - generic [ref=e215]:
                  - generic [ref=e216]: "3"
                  - generic [ref=e221]: "2"
                  - generic [ref=e226]:
                    - generic [ref=e233]: "165"
                    - generic [ref=e234]: م²
            - link "استفسر واتساب" [ref=e235] [cursor=pointer]:
              - /url: https://wa.me/201000000000?text=%D9%85%D9%87%D8%AA%D9%85%20%D8%A8%D8%A7%D9%84%D8%B9%D9%82%D8%A7%D8%B1%3A%20XH-1001
          - article [ref=e237]:
            - button "احفظ" [ref=e239]
            - link "فيلا مستقلة 420م تشطيب كامل بيع عرض التفاصيل فيلا مستقلة 420م تشطيب كامل العاصمة الإدارية · شركة المروج للتطوير EGP 18,500,000 5 5 420 م²" [ref=e242] [cursor=pointer]:
              - /url: /ar/properties/standalone-villa-420m-fully-finished
              - generic [ref=e243]:
                - img "فيلا مستقلة 420م تشطيب كامل" [ref=e244]
                - generic [ref=e245]: بيع
                - generic [ref=e246]: عرض التفاصيل
              - generic [ref=e250]:
                - heading "فيلا مستقلة 420م تشطيب كامل" [level=3] [ref=e251]
                - generic [ref=e252]:
                  - generic [ref=e256]: العاصمة الإدارية
                  - generic [ref=e257]: ·
                  - generic [ref=e262]: شركة المروج للتطوير
                - generic [ref=e263]: EGP 18,500,000
                - generic [ref=e265]:
                  - generic [ref=e266]: "5"
                  - generic [ref=e271]: "5"
                  - generic [ref=e276]:
                    - generic [ref=e283]: "420"
                    - generic [ref=e284]: م²
            - link "استفسر واتساب" [ref=e285] [cursor=pointer]:
              - /url: https://wa.me/201000000000?text=%D9%85%D9%87%D8%AA%D9%85%20%D8%A8%D8%A7%D9%84%D8%B9%D9%82%D8%A7%D8%B1%3A%20XH-1002
          - article [ref=e287]:
            - button "احفظ" [ref=e289]
            - link "توين هاوس 280م استلام فوري بيع عرض التفاصيل توين هاوس 280م استلام فوري العاصمة الإدارية · شركة المروج للتطوير EGP 9,750,000 4 3 280 م²" [ref=e292] [cursor=pointer]:
              - /url: /ar/properties/twin-house-280m-ready-to-move
              - generic [ref=e293]:
                - img "توين هاوس 280م استلام فوري" [ref=e294]
                - generic [ref=e295]: بيع
                - generic [ref=e296]: عرض التفاصيل
              - generic [ref=e300]:
                - heading "توين هاوس 280م استلام فوري" [level=3] [ref=e301]
                - generic [ref=e302]:
                  - generic [ref=e306]: العاصمة الإدارية
                  - generic [ref=e307]: ·
                  - generic [ref=e312]: شركة المروج للتطوير
                - generic [ref=e313]: EGP 9,750,000
                - generic [ref=e315]:
                  - generic [ref=e316]: "4"
                  - generic [ref=e321]: "3"
                  - generic [ref=e326]:
                    - generic [ref=e333]: "280"
                    - generic [ref=e334]: م²
            - link "استفسر واتساب" [ref=e335] [cursor=pointer]:
              - /url: https://wa.me/201000000000?text=%D9%85%D9%87%D8%AA%D9%85%20%D8%A8%D8%A7%D9%84%D8%B9%D9%82%D8%A7%D8%B1%3A%20XH-1005
          - article [ref=e337]:
            - button "احفظ" [ref=e339]
            - link "شقة 190م بفيو لاندسكيب مفتوح بيع عرض التفاصيل شقة 190م بفيو لاندسكيب مفتوح القاهرة الجديدة · شركة المروج للتطوير EGP 5,600,000 3 3 190 م²" [ref=e342] [cursor=pointer]:
              - /url: /ar/properties/apartment-190m-with-open-landscape-view
              - generic [ref=e343]:
                - img "شقة 190م بفيو لاندسكيب مفتوح" [ref=e344]
                - generic [ref=e345]: بيع
                - generic [ref=e346]: عرض التفاصيل
              - generic [ref=e350]:
                - heading "شقة 190م بفيو لاندسكيب مفتوح" [level=3] [ref=e351]
                - generic [ref=e352]:
                  - generic [ref=e356]: القاهرة الجديدة
                  - generic [ref=e357]: ·
                  - generic [ref=e362]: شركة المروج للتطوير
                - generic [ref=e363]: EGP 5,600,000
                - generic [ref=e365]:
                  - generic [ref=e366]: "3"
                  - generic [ref=e371]: "3"
                  - generic [ref=e376]:
                    - generic [ref=e383]: "190"
                    - generic [ref=e384]: م²
            - link "استفسر واتساب" [ref=e385] [cursor=pointer]:
              - /url: https://wa.me/201000000000?text=%D9%85%D9%87%D8%AA%D9%85%20%D8%A8%D8%A7%D9%84%D8%B9%D9%82%D8%A7%D8%B1%3A%20XH-1009
      - generic [ref=e386]:
        - heading "استفسر عن مشاريع المطوّر" [level=2] [ref=e387]
        - paragraph [ref=e388]: قوللنا المنطقة والميزانية، وهنرشّح لك من مشاريعه اللي يناسبك.
        - generic [ref=e389]:
          - generic [ref=e390]:
            - generic [ref=e391]:
              - generic [ref=e392]: الاسم
              - textbox "الاسم" [ref=e393]
            - generic [ref=e394]:
              - generic [ref=e395]: الموبايل
              - textbox "الموبايل" [ref=e396]
            - generic [ref=e398]:
              - generic [ref=e399]: الإيميل (اختياري)
              - textbox "الإيميل (اختياري)" [ref=e400]
            - generic [ref=e402]:
              - generic [ref=e403]: رسالتك
              - textbox "رسالتك" [ref=e404]:
                - /placeholder: "مثال: عايز أعاين الوحدة نهاية الأسبوع."
          - button "ابعت الطلب" [ref=e405]
      - link "كل المطوّرين" [ref=e409] [cursor=pointer]:
        - /url: /ar/developers
  - contentinfo [ref=e412]:
    - generic [ref=e413]:
      - generic [ref=e414]:
        - generic [ref=e415]:
          - generic [ref=e416]: المنصة العقارية
          - paragraph [ref=e419]: بوابتك الذكية لعقارات مصر
          - generic [ref=e420]:
            - link "facebook" [ref=e421] [cursor=pointer]:
              - /url: https://facebook.com/example
            - link "instagram" [ref=e424] [cursor=pointer]:
              - /url: https://instagram.com/example
            - link "linkedin" [ref=e427] [cursor=pointer]:
              - /url: https://linkedin.com/company/example
            - link "youtube" [ref=e430] [cursor=pointer]:
              - /url: https://youtube.com/@example
        - generic [ref=e433]:
          - generic [ref=e434]: الموقع
          - link "العقارات" [ref=e435] [cursor=pointer]:
            - /url: /ar/properties
          - link "عقارات تجارية" [ref=e436] [cursor=pointer]:
            - /url: /ar/properties/commercial
          - link "الكمبوندات" [ref=e437] [cursor=pointer]:
            - /url: /ar/compounds
          - link "المطوّرون" [ref=e438] [cursor=pointer]:
            - /url: /ar/developers
          - link "المناطق" [ref=e439] [cursor=pointer]:
            - /url: /ar/areas
          - link "المدونة" [ref=e440] [cursor=pointer]:
            - /url: /ar/blog
          - link "من نحن" [ref=e441] [cursor=pointer]:
            - /url: /ar/about
          - link "اتصل بنا" [ref=e442] [cursor=pointer]:
            - /url: /ar/contact
        - generic [ref=e443]:
          - generic [ref=e444]: تواصل
          - link "+20 100 000 0000" [ref=e445] [cursor=pointer]:
            - /url: tel:+20 100 000 0000
          - link "info@example.com" [ref=e446] [cursor=pointer]:
            - /url: mailto:info@example.com
          - generic [ref=e447]: ٩٠ شمال، التجمع الخامس، القاهرة الجديدة — القاهرة، مصر
      - generic [ref=e448]:
        - generic [ref=e449]:
          - text: © 2026
          - link "Business Partner for Information Technology" [ref=e450] [cursor=pointer]:
            - /url: https://bp-eg.com
          - text: . All rights reserved.
        - generic [ref=e451]:
          - text: © 2026
          - link "شركة شريك الأعمال لتقنية المعلومات" [ref=e452] [cursor=pointer]:
            - /url: https://bp-eg.com
          - text: . جميع الحقوق محفوظة.
```

# Test source

```ts
  167 | /**
  168 |  * مساحة العميل. الحالات اللي بتغيّر بيانات متغطّاة في tests/Feature/RolePermissionsTest.php —
  169 |  * هنا بنتأكد بس إن الشاشات بترندر والحراسة شغّالة في المتصفح الحقيقي.
  170 |  */
  171 | for (const path of ['/ar/login', '/ar/register']) {
  172 |     test(`${path} renders without console errors`, async ({ page }) => {
  173 |         const consoleErrors: string[] = [];
  174 |         page.on('console', (msg) => {
  175 |             if (msg.type() === 'error') consoleErrors.push(msg.text());
  176 |         });
  177 | 
  178 |         const response = await page.goto(path, { waitUntil: 'networkidle' });
  179 | 
  180 |         expect(response?.status()).toBe(200);
  181 |         await expect(page.locator('form')).toBeVisible();
  182 |         expect(consoleErrors).toEqual([]);
  183 |     });
  184 | }
  185 | 
  186 | test('guest is sent to the site login, not the admin one', async ({ page }) => {
  187 |     await page.goto('/ar/account');
  188 |     await expect(page).toHaveURL(/\/ar\/login$/);
  189 | });
  190 | 
  191 | test('guest is sent to the admin login for the dashboard', async ({ page }) => {
  192 |     await page.goto('/admin/properties');
  193 |     await expect(page).toHaveURL(/\/admin\/login$/);
  194 | });
  195 | 
  196 | /**
  197 |  * أنماط خلفية الهيرو. النمط بيتغيّر من الداشبورد (theme.hero_variant)، ولو الفيديو
  198 |  * مش شغّال السبب شبه دايمًا إن النمط مش "video" — مش إن الملف مكسور.
  199 |  * التست ده بيثبّت اللي كل نمط بيعمله فعلًا.
  200 |  */
  201 | test('hero video actually plays when the variant is video', async ({ page }) => {
  202 |     await page.goto('/ar', { waitUntil: 'networkidle' });
  203 | 
  204 |     // النمط بيتقرا من الإعدادات مش من وجود العنصر — وإلا التست يتخطّى نفسه
  205 |     // بالظبط لما الفيديو يختفي، وهي الحالة اللي المفروض يمسكها
  206 |     const variant = await page.evaluate(
  207 |         () => JSON.parse(document.getElementById('app')!.dataset.page!).props.settings.theme.hero_variant
  208 |     );
  209 |     test.skip(variant !== 'video', `نمط الهيرو = ${variant}، فالفيديو مش مفروض يشتغل`);
  210 | 
  211 |     const video = page.locator('section video').first();
  212 |     await expect(video).toHaveCount(1);
  213 | 
  214 |     // مش بنكتفي بوجود العنصر: لازم يتحمّل ويمشي فعلًا
  215 |     await expect
  216 |         .poll(async () => video.evaluate((el: HTMLVideoElement) => el.readyState), { timeout: 15_000 })
  217 |         .toBeGreaterThanOrEqual(3);
  218 | 
  219 |     const state = await video.evaluate((el: HTMLVideoElement) => ({
  220 |         paused: el.paused,
  221 |         error: el.error?.message ?? null,
  222 |         width: el.videoWidth,
  223 |     }));
  224 | 
  225 |     expect(state.error).toBeNull();
  226 |     expect(state.paused).toBe(false);
  227 |     expect(state.width).toBeGreaterThan(0);
  228 | });
  229 | 
  230 | test('the hero background image comes from settings, not a hardcoded path', async ({ page }) => {
  231 |     await page.goto('/ar', { waitUntil: 'networkidle' });
  232 | 
  233 |     const src = await page.locator('section img').first().getAttribute('src');
  234 |     const settings = await page.evaluate(
  235 |         () => JSON.parse(document.getElementById('app')!.dataset.page!).props.settings.branding
  236 |     );
  237 | 
  238 |     expect(settings.hero_bg_image).toBeTruthy();
  239 |     expect(src).toBe(settings.hero_bg_image);
  240 | });
  241 | 
  242 | /** أقسام المطوّرين والمناطق والعقارات التجارية */
  243 | for (const path of ['/ar/developers', '/ar/areas', '/ar/properties/commercial', '/ar/properties/residential']) {
  244 |     test(`${path} renders without console errors`, async ({ page }) => {
  245 |         const consoleErrors: string[] = [];
  246 |         page.on('console', (msg) => {
  247 |             if (msg.type() === 'error') consoleErrors.push(msg.text());
  248 |         });
  249 | 
  250 |         const response = await page.goto(path, { waitUntil: 'networkidle' });
  251 | 
  252 |         expect(response?.status()).toBe(200);
  253 |         await expect(page.locator('h1')).not.toBeEmpty();
  254 |         expect(consoleErrors).toEqual([]);
  255 |     });
  256 | }
  257 | 
  258 | test('developer card opens the developer page', async ({ page }) => {
  259 |     await page.goto('/ar/developers', { waitUntil: 'networkidle' });
  260 | 
  261 |     const card = page.locator('a[href*="/ar/developers/"]').first();
  262 |     const href = await card.getAttribute('href');
  263 |     expect(href).toMatch(/^\/ar\/developers\/.+/);
  264 | 
  265 |     await card.click();
  266 |     await page.waitForURL(`**${href}`, { timeout: 20_000 });
> 267 |     await expect(page.getByRole('heading', { name: 'مشاريع المطوّر' })).toBeVisible();
      |                                                                         ^ Error: expect(locator).toBeVisible() failed
  268 | });
  269 | 
  270 | test('area card opens the area page', async ({ page }) => {
  271 |     await page.goto('/ar/areas', { waitUntil: 'networkidle' });
  272 | 
  273 |     const card = page.locator('a[href*="/ar/areas/"]').first();
  274 |     const href = await card.getAttribute('href');
  275 |     expect(href).toMatch(/^\/ar\/areas\/.+/);
  276 | 
  277 |     await card.click();
  278 |     await page.waitForURL(`**${href}`, { timeout: 20_000 });
  279 |     await expect(page.getByRole('heading', { name: 'مشاريع في المنطقة' })).toBeVisible();
  280 | });
  281 | 
  282 | test('the commercial section only lists commercial types', async ({ page }) => {
  283 |     // /properties/commercial لازم يوصل للقسم مش لصفحة وحدة اسمها commercial
  284 |     const response = await page.goto('/ar/properties/commercial', { waitUntil: 'networkidle' });
  285 |     expect(response?.status()).toBe(200);
  286 | 
  287 |     const types = await page.evaluate(() => {
  288 |         const el = document.getElementById('app');
  289 |         const page = JSON.parse(el?.getAttribute('data-page') || '{}');
  290 |         return (page.props?.properties ?? []).map((p: { category: string }) => p.category);
  291 |     });
  292 | 
  293 |     expect(types.length).toBeGreaterThan(0);
  294 |     expect([...new Set(types)]).toEqual(['commercial']);
  295 | });
  296 | 
```