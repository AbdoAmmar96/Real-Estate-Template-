import { test, expect } from '@playwright/test';

/**
 * Smoke coverage for the public site + admin entry point.
 * Route list source of truth: `php artisan route:list --except-vendor`.
 */

const PUBLIC_PAGES = [
    { path: '/ar', name: 'home (ar)' },
    { path: '/en', name: 'home (en)' },
    { path: '/ar/properties', name: 'properties' },
    { path: '/ar/compounds', name: 'compounds' },
    { path: '/ar/about', name: 'about' },
    { path: '/ar/contact', name: 'contact' },
    { path: '/ar/blog', name: 'blog' },
];

for (const page of PUBLIC_PAGES) {
    test(`${page.name} renders without console or network errors`, async ({ page: p }) => {
        const consoleErrors: string[] = [];
        const failedRequests: string[] = [];

        p.on('console', (msg) => {
            if (msg.type() === 'error') consoleErrors.push(msg.text());
        });
        p.on('response', (res) => {
            if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
        });

        const response = await p.goto(page.path, { waitUntil: 'networkidle' });

        expect(response?.status(), `HTTP status for ${page.path}`).toBe(200);
        // Inertia mounts into #app — an empty root means the React bundle died.
        await expect(p.locator('#app')).not.toBeEmpty();
        expect(consoleErrors, `console errors on ${page.path}`).toEqual([]);
        expect(failedRequests, `failed requests on ${page.path}`).toEqual([]);
    });
}

test('root redirects to a locale', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/(ar|en)$/);
});

test('arabic pages are RTL', async ({ page }) => {
    await page.goto('/ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
});

test('english pages are LTR', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('admin is gated behind login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
});

test('theme tokens reach the browser from the database', async ({ page }) => {
    await page.goto('/ar');
    // Token names come from the `theme` settings group with `_` → `-` (app.blade.php:25).
    const primary = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
    );
    // Proves the Theme Engine injected DB settings rather than falling back to build-time CSS.
    expect(primary).toMatch(/^#[0-9a-fA-F]{3,8}$/);
});
