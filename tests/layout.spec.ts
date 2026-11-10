import { test, expect } from '@playwright/test';
// Optional original-version comparison: run the original checkout on port 5174.
test('all screen content and geometry match the original version', async ({ page, browser }) => {
  test.skip(!process.env.COMPARE_ORIGINAL, 'Original checkout comparison is opt-in.');
  const original = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const routes = ['signin', 'signup', 'dashboard', 'employees', 'employees-empty', 'employee-details', 'team-activity', 'add-employee', 'activity-review', 'add-challenge', 'reports'];
  const differences: string[] = [];
  const snapshot = () => [...document.querySelectorAll('.md-root, .ms-root, .md-root *, .ms-root *')].filter(el => !['STYLE', 'SCRIPT', 'path', 'svg', 'polyline'].includes(el.tagName)).map(el => {
    const r = el.getBoundingClientRect();
    return { classes: [...el.classList].filter(c => c.startsWith('md-') || c.startsWith('ms-')).join(' '), tag: el.tagName, text: [...el.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').replace(/\s+/g, ' ').trim(), box: [r.x, r.y, r.width, r.height] };
  }).filter(el => el.classes);
  for (const width of [1440, 768, 390]) {
  await Promise.all([page.setViewportSize({ width, height: 1100 }), original.setViewportSize({ width, height: 1100 })]);
  for (const route of routes) {
    await original.goto(`http://127.0.0.1:5174/#/${route}`);
    await page.goto(`/#/${route}`);
    await Promise.all([original.evaluate(() => document.fonts.ready), page.evaluate(() => document.fonts.ready)]);
    const before = await original.evaluate(snapshot), after = await page.evaluate(snapshot);
    expect(after.map(({ classes, tag, text }) => ({ classes, tag, text })), route).toEqual(before.map(({ classes, tag, text }) => ({ classes, tag, text })));
    before.forEach((element, index) => { const changed = element.box.some((value, i) => Math.abs(value - after[index].box[i]) > 1); if (changed) differences.push(`${width}px ${route} .${element.classes}: ${element.box.map(Math.round)} -> ${after[index].box.map(Math.round)}`); });
  }
  }
  await original.close();
  expect(differences).toEqual([]);
});
