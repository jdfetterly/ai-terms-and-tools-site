const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:9002', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'current-state.png', fullPage: true });
    console.log('Screenshot saved as current-state.png');
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
})(); 