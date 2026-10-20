const { until } = require('selenium-webdriver');

class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.timeout = 10000;
  }

  async waitVisible(locator) {
    const el = await this.driver.wait(until.elementLocated(locator), this.timeout);
    await this.driver.wait(until.elementIsVisible(el), this.timeout);
    return el;
  }

  async click(locator) {
    const el = await this.waitVisible(locator);
    await el.click();
  }

  async type(locator, text) {
    const el = await this.waitVisible(locator);
    await el.clear();
    if (text) await el.sendKeys(text);
  }

  async getText(locator) {
    const el = await this.waitVisible(locator);
    return el.getText();
  }

  async isDisplayed(locator) {
    try {
      const el = await this.driver.wait(until.elementLocated(locator), 3000);
      return await el.isDisplayed();
    } catch (e) {
      return false;
    }
  }

  async getCurrentUrl() {
    return this.driver.getCurrentUrl();
  }
}

module.exports = BasePage;
