const { By } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const config = require('../config/config');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.usernameInput = By.css('[data-test="username"]');
    this.passwordInput = By.css('[data-test="password"]');
    this.loginButton = By.css('[data-test="login-button"]');
    this.errorMessage = By.css('[data-test="error"]');
  }

  async open() {
    await this.driver.get(config.baseUrl);
    await this.waitVisible(this.loginButton);
  }

  async login(username, password) {
    await this.type(this.usernameInput, username);
    await this.type(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage() {
    return this.getText(this.errorMessage);
  }

  async isErrorDisplayed() {
    return this.isDisplayed(this.errorMessage);
  }

  async isLoginButtonDisplayed() {
    return this.isDisplayed(this.loginButton);
  }
}

module.exports = LoginPage;
