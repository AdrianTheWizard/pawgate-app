import { _electron as electron } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const electronBin = path.join(__dirname, 'node_modules/electron/dist/electron.exe');

const app = await electron.launch({
  executablePath: electronBin,
  args: ['--inspect=5858', __dirname],
  timeout: 30000,
});

await new Promise(r => setTimeout(r, 8000));

const page = await app.firstWindow();
console.log('URL:', page.url());

const bodyClasses = await page.evaluate(() => document.body.className);
console.log('body classes:', bodyClasses);

const sidebarDisplay = await page.evaluate(() => {
  const el = document.getElementById('desktop-sidebar');
  if (!el) return 'SIDEBAR NOT FOUND IN DOM';
  return 'computed=' + window.getComputedStyle(el).display + ' inline=' + el.style.display;
});
console.log('sidebar:', sidebarDisplay);

const detection = await page.evaluate(() => ({
  urlParam: new URLSearchParams(window.location.search).get('electron'),
  hasUpdater: !!window.pawgateUpdater,
  electronInUA: navigator.userAgent.includes('Electron'),
}));
console.log('detection:', detection);

const shotPath = path.join(__dirname, 'test-screenshot.png');
await page.screenshot({ path: shotPath, fullPage: false });
console.log('screenshot:', shotPath);

await app.close();
