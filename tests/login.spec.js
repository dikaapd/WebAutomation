const assert = require('assert/strict');
const { createDriver } = require('../utils/driver');
const { compareScreenshot } = require('../utils/visual');
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');

const PASSWORD = 'secret_sauce';
const LOGIN_URL = 'https://www.saucedemo.com/';

describe('Login SauceDemo', function () {
  let driver;
  let loginPage;

  beforeEach(async function () {
    driver = await createDriver();
    loginPage = new LoginPage(driver);
    await loginPage.open();
  });

  afterEach(async function () {
    if (driver) await driver.quit();
  });

  // ================= POSITIVE =================
  it('TC01 - Login berhasil dengan kredensial valid', async function () {
    const inventoryPage = new InventoryPage(driver);

    await loginPage.login('standard_user', PASSWORD);
    await inventoryPage.waitUntilLoaded();

    // Assertion
    assert.match(await inventoryPage.getCurrentUrl(), /inventory\.html/);
    assert.equal(await inventoryPage.getTitle(), 'Products');
    assert.equal(await inventoryPage.isInventoryListDisplayed(), true);
    assert.equal(await inventoryPage.isCartDisplayed(), true);

    // Visual regression
    await inventoryPage.waitForImagesLoaded();
    await compareScreenshot(driver, 'tc01-login-success');
  });

  // ================= NEGATIVE =================
  const negativeCases = [
    {
      id: 'TC02',
      name: 'Login gagal dengan password salah',
      username: 'standard_user',
      password: 'password_salah',
      error: 'Epic sadface: Username and password do not match any user in this service',
      screenshot: 'tc02-wrong-password',
    },
    {
      id: 'TC03',
      name: 'Login gagal dengan username tidak terdaftar',
      username: 'user_tidak_ada',
      password: PASSWORD,
      error: 'Epic sadface: Username and password do not match any user in this service',
      screenshot: 'tc03-invalid-username',
    },
    {
      id: 'TC04',
      name: 'Login gagal dengan user terkunci (locked_out_user)',
      username: 'locked_out_user',
      password: PASSWORD,
      error: 'Epic sadface: Sorry, this user has been locked out.',
      screenshot: 'tc04-locked-out-user',
    },
    {
      id: 'TC05',
      name: 'Login gagal dengan username kosong',
      username: '',
      password: PASSWORD,
      error: 'Epic sadface: Username is required',
      screenshot: 'tc05-empty-username',
    },
    {
      id: 'TC06',
      name: 'Login gagal dengan password kosong',
      username: 'standard_user',
      password: '',
      error: 'Epic sadface: Password is required',
      screenshot: 'tc06-empty-password',
    },
    {
      id: 'TC07',
      name: 'Login gagal dengan username dan password kosong',
      username: '',
      password: '',
      error: 'Epic sadface: Username is required',
      screenshot: 'tc07-empty-credentials',
    },
  ];

  negativeCases.forEach((tc) => {
    it(`${tc.id} - ${tc.name}`, async function () {
      await loginPage.login(tc.username, tc.password);

      // Assertion
      assert.equal(await loginPage.isErrorDisplayed(), true);
      assert.equal(await loginPage.getErrorMessage(), tc.error);
      assert.equal(await loginPage.getCurrentUrl(), LOGIN_URL);
      assert.equal(await loginPage.isLoginButtonDisplayed(), true);

      // Visual regression
      await compareScreenshot(driver, tc.screenshot);
    });
  });
});
