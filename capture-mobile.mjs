import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // iPhone 14 Pro viewport (390x844)
  console.log('Creating iPhone 14 Pro viewport (390x844)...');
  const context1 = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  
  const page1 = await context1.newPage();
  
  console.log('Navigating to localhost:3000...');
  await page1.goto('http://localhost:3000', { waitUntil: 'load', timeout: 30000 });
  await page1.waitForTimeout(8000);
  
  // Dismiss performance notice if present
  try {
    const gotItBtn = page1.locator('button:has-text("Got it")');
    if (await gotItBtn.isVisible({ timeout: 2000 })) {
      await gotItBtn.click();
      await page1.waitForTimeout(1000);
    }
  } catch (e) {
    console.log('No "Got it" button found');
  }
  
  console.log('Taking iPhone 14 Pro screenshots...');
  await page1.screenshot({ path: '/tmp/mobile-iphone14pro-01-initial.png' });
  
  // Scroll down
  await page1.evaluate(() => window.scrollBy(0, 500));
  await page1.waitForTimeout(2000);
  await page1.screenshot({ path: '/tmp/mobile-iphone14pro-02-scrolled.png' });
  
  // Try to open hamburger menu
  try {
    const hamburger = page1.locator('button[aria-label="Menu"], .hamburger-btn, button:has-text("☰")').first();
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await page1.waitForTimeout(2000);
      await page1.screenshot({ path: '/tmp/mobile-iphone14pro-03-menu-open.png' });
    }
  } catch (e) {
    console.log('Could not find/click hamburger menu');
  }
  
  await context1.close();
  
  // iPhone SE viewport (375x667)
  console.log('Creating iPhone SE viewport (375x667)...');
  const context2 = await browser.newContext({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  
  const page2 = await context2.newPage();
  await page2.goto('http://localhost:3000', { waitUntil: 'load', timeout: 30000 });
  await page2.waitForTimeout(8000);
  
  // Dismiss modal
  try {
    const gotItBtn = page2.locator('button:has-text("Got it")');
    if (await gotItBtn.isVisible({ timeout: 2000 })) {
      await gotItBtn.click();
      await page2.waitForTimeout(1000);
    }
  } catch (e) {}
  
  console.log('Taking iPhone SE screenshot...');
  await page2.screenshot({ path: '/tmp/mobile-iphonese-01-initial.png' });
  
  await context2.close();
  await browser.close();
  
  console.log('Done! Screenshots saved to /tmp/mobile-*.png');
})();
