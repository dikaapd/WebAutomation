const { By, until } = require('selenium-webdriver');
const BasePage = require('./BasePage');

class InventoryPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.title = By.css('[data-test="title"]');
    this.inventoryList = By.css('[data-test="inventory-list"]');
    this.cartIcon = By.css('[data-test="shopping-cart-link"]');
  }

  async waitUntilLoaded() {
    await this.driver.wait(until.urlContains('inventory.html'), this.timeout);
    await this.waitVisible(this.title);
  }

  async getTitle() {
    return this.getText(this.title);
  }

  async isInventoryListDisplayed() {
    return this.isDisplayed(this.inventoryList);
  }

  async isCartDisplayed() {
    return this.isDisplayed(this.cartIcon);
  }

  // Pastikan semua gambar produk selesai dimuat sebelum screenshot
  async waitForImagesLoaded() {
    await this.driver.wait(
      () =>
        this.driver.executeScript(
          'return Array.from(document.images).every(i => i.complete && i.naturalWidth > 0);'
        ),
      this.timeout
    );
  }
}

module.exports = InventoryPage;
