# SauceDemo Login Automation

Automation test halaman login https://www.saucedemo.com/ menggunakan:
**Selenium WebDriver**, **Mocha**, **Page Object Model**, serta visual regression dengan **PixelMatch** dan **PNGJS**.

## Prasyarat

- Node.js 18+
- Google Chrome terpasang (ChromeDriver diunduh otomatis oleh Selenium Manager)

## Struktur

```
config/config.js      -> URL, viewport, pengaturan visual regression
pages/                -> Page Object (BasePage, LoginPage, InventoryPage)
tests/login.spec.js   -> Test case TC01-TC07
utils/driver.js       -> Setup Chrome (headless/headed dengan rendering sama)
utils/visual.js       -> Visual regression (PNGJS + PixelMatch)
visual/baseline/      -> Screenshot acuan (di-commit ke repo)
visual/actual|diff/   -> Hasil run (tidak di-commit)
```

## Test Case

| ID   | Tipe     | Skenario                        |
| ---- | -------- | ------------------------------- |
| TC01 | Positive | Login berhasil (standard_user)  |
| TC02 | Negative | Password salah                  |
| TC03 | Negative | Username tidak terdaftar        |
| TC04 | Negative | User terkunci (locked_out_user) |
| TC05 | Negative | Username kosong                 |
| TC06 | Negative | Password kosong                 |
| TC07 | Negative | Username & password kosong      |

## Cara Menjalankan

```bash
npm install

npm run test:update   # run pertama: membuat/memperbarui baseline
npm test              # headless, bandingkan dengan baseline
npm run test:headed   # browser tampil, hasil harus sama
```

Jika test visual gagal, lihat file hasil perbandingan di `visual/diff/<nama>.png`
(piksel merah = bagian yang berbeda).
