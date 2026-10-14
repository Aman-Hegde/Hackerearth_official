// After `npm run build`, run with a local Playwright installation:
// node tests/eventCarousel.browser.cjs
// Uses a local static server and mocked read-only API responses; never writes event data.
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '../dist');
const event = {
  id: '70c800000000000000000010', title: 'PROJECT DOOMSDAY: SAVE THE TIMELINE',
  tagline: 'Three rounds. One mission.',
  description: 'Project Doomsday brought together participants for a three-round technical challenge testing knowledge, logical thinking, pattern printing, and data structure and algorithm skills.',
  rounds: ['MCQ Challenge', 'Pattern Printing', 'DSA Challenge'],
  eventDateTime: '2026-10-10T03:30:00.000Z', status: 'past', active: false,
  imageUrls: Array.from({ length: 8 }, (_, i) => `/events/project-doomsday/doomsday-0${i + 1}.webp`),
  posterUrl: '/events/project-doomsday/doomsday-02.webp',
};
const upcoming = { ...event, id: 'upcoming', title: 'Upcoming workshop', imageUrls: [event.posterUrl],
  status: 'open', active: true, registrationOpen: true, eventDateTime: '2027-10-10T03:30:00.000Z',
  registrationDeadline: '2027-10-09T03:30:00.000Z', venue: 'Campus', registrationCount: 0, maxRegistrations: 50 };

(async () => {
  const server = http.createServer((req, res) => {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    const filename = path.resolve(root, '.' + (pathname === '/events' || pathname === '/' ? '/index.html' : pathname));
    if (!filename.startsWith(root + path.sep) || !fs.existsSync(filename) || !fs.statSync(filename).isFile()) {
      res.writeHead(404).end(); return;
    }
    const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
    res.setHeader('Content-Type', types[path.extname(filename)] || 'application/octet-stream');
    fs.createReadStream(filename).pipe(res);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const base = `http://127.0.0.1:${server.address().port}`;
    const widths = process.argv.slice(2).map(Number);
    const viewports = [{ width: 1440, height: 1000 }, { width: 820, height: 1180 }, { width: 390, height: 844 }, { width: 320, height: 740 }];
    for (const viewport of viewports.filter((size) => !widths.length || widths.includes(size.width))) {
      const page = await browser.newPage({ viewport });
      await page.route('**/*', (route) => {
        const url = new URL(route.request().url());
        if (url.pathname.startsWith('/api/')) return route.fulfill({ status: url.pathname === '/api/auth/me' ? 401 : 200,
          json: url.pathname === '/api/events' ? { success: true, past: [event], upcoming: [upcoming] } : { success: false } });
        return url.origin === base ? route.continue() : route.abort();
      });
      await page.goto(base + '/events');
      const carousel = page.locator('.event-carousel--cinematic');
      await carousel.scrollIntoViewIfNeeded();
      await carousel.getByRole('button', { name: 'Pause slideshow' }).click();
      await page.waitForTimeout(500);
      const metrics = await carousel.evaluate((el) => {
        const box = el.getBoundingClientRect();
        const section = el.closest('section').getBoundingClientRect();
        const overflow = [...el.querySelectorAll('h3,p,li,button,time')].some((item) => {
          const r = item.getBoundingClientRect();
          return r.left < box.left - 1 || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1;
        });
        const image = el.querySelector('img');
        return { width: box.width, height: box.height, sectionWidth: section.width, overflow,
          pageOverflow: document.documentElement.scrollWidth > innerWidth,
          objectFit: getComputedStyle(image).objectFit, transition: getComputedStyle(image).transitionDuration,
          loaded: image.complete && image.naturalWidth > 0 };
      });
      assert.ok(Math.abs(metrics.width - metrics.sectionWidth) < 4, JSON.stringify(metrics));
      assert.equal(metrics.overflow, false); assert.equal(metrics.pageOverflow, false);
      assert.equal(metrics.loaded, true); assert.equal(metrics.objectFit, 'cover');
      assert.equal(metrics.transition, '0.4s');
      if (viewport.width >= 1024) assert.ok(metrics.height >= viewport.height * 0.8 && metrics.height <= viewport.height * 0.9);
      else assert.ok(metrics.height >= viewport.height * 0.6);
      assert.equal(await carousel.getByRole('button', { name: /register/i }).count(), 0);
      assert.equal(await page.getByRole('region', { name: 'Upcoming workshop photographs' }).getByRole('button').count(), 0);
      assert.equal(await page.getByRole('button', { name: 'REGISTER NOW' }).isEnabled(), true);
      const screenshot = path.join(os.tmpdir(), `doomsday-${viewport.width}.png`);
      await carousel.screenshot({ path: screenshot });

      await page.clock.install({ time: new Date('2026-10-14T00:00:00Z') });
      await page.clock.pauseAt(new Date('2026-10-14T00:01:00Z'));
      const visible = () => carousel.locator('img[aria-hidden="false"]').getAttribute('src');
      const original = await visible();
      await page.clock.fastForward(5000); assert.equal(await visible(), original);
      await carousel.getByRole('button', { name: 'Play slideshow' }).click();
      await page.clock.fastForward(2499); assert.equal(await visible(), original);
      await page.clock.fastForward(1); assert.notEqual(await visible(), original);
      await page.clock.fastForward(2000);
      await carousel.getByRole('button', { name: 'Next photograph' }).click();
      const manual = await visible();
      await page.clock.fastForward(2499); assert.equal(await visible(), manual);
      await page.clock.fastForward(1); assert.notEqual(await visible(), manual);
      await carousel.getByRole('button', { name: 'Previous photograph' }).click();
      assert.equal(await visible(), manual);
      await carousel.getByRole('button', { name: 'Pause slideshow' }).click();
      await page.clock.fastForward(10000); assert.equal(await visible(), manual);
      // Let the browser's rendering clock dispatch the actual media-query change event.
      await page.clock.resume();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await carousel.getByRole('button', { name: /slideshow/ }).waitFor({ state: 'hidden' });
      assert.equal(await carousel.getByRole('button', { name: /slideshow/ }).count(), 0);
      await carousel.getByRole('button', { name: 'Next photograph' }).click();
      const reduced = await visible();
      await page.clock.fastForward(10000); assert.equal(await visible(), reduced);
      console.log(JSON.stringify({ viewport, ...metrics, screenshot, controlsAndTiming: 'passed' }));
      await page.close();
    }
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
