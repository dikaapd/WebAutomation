const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('../config/config');

async function createDriver() {
  const options = new chrome.Options();

  if (!config.headed) {
    options.addArguments('--headless=new');
  }

  // Samakan rendering antara headless & headed
  options.addArguments(
    '--window-size=1400,900',
    '--force-device-scale-factor=1',
    '--hide-scrollbars',
    '--disable-gpu',
    '--font-render-hinting=none',
    '--disable-lcd-text',
    '--disable-infobars'
  );

  // Matikan popup password manager / "change your password" milik Chrome
  options.setUserPreferences({
    credentials_enable_service: false,
    'profile.password_manager_enabled': false,
    'profile.password_manager_leak_detection': false,
  });

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  // Paksa ukuran viewport persis sama di semua mode
  await driver.sendDevToolsCommand('Emulation.setDeviceMetricsOverride', {
    width: config.viewport.width,
    height: config.viewport.height,
    deviceScaleFactor: 1,
    mobile: false,
  });

  return driver;
}

module.exports = { createDriver };
