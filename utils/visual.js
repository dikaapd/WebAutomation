const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const config = require('../config/config');

const DIRS = {
  baseline: path.join(__dirname, '..', 'visual', 'baseline'),
  actual: path.join(__dirname, '..', 'visual', 'actual'),
  diff: path.join(__dirname, '..', 'visual', 'diff'),
};

async function prepareForScreenshot(driver, mask) {
  await driver.executeScript(`
    if (document.activeElement) document.activeElement.blur();
    const style = document.createElement('style');
    style.innerHTML = '*{animation:none!important;transition:none!important;caret-color:transparent!important}';
    document.head.appendChild(style);
    (arguments[0] || []).forEach(sel =>
      document.querySelectorAll(sel).forEach(el => (el.style.visibility = 'hidden'))
    );
  `, mask);
}

/**
 * Ambil screenshot lalu bandingkan dengan baseline memakai PixelMatch.
 * - Baseline belum ada / UPDATE_SNAPSHOTS=true -> baseline dibuat/diperbarui.
 * - Selisih > maxDiffRatio -> throw Error (test gagal) + file diff disimpan.
 */
async function compareScreenshot(driver, name, options = {}) {
  const {
    threshold = config.visual.threshold,
    maxDiffRatio = config.visual.maxDiffRatio,
    mask = [],
  } = options;

  Object.values(DIRS).forEach((d) => fs.mkdirSync(d, { recursive: true }));

  await prepareForScreenshot(driver, mask);
  const actualBuffer = Buffer.from(await driver.takeScreenshot(), 'base64');

  const baselinePath = path.join(DIRS.baseline, `${name}.png`);
  const actualPath = path.join(DIRS.actual, `${name}.png`);
  const diffPath = path.join(DIRS.diff, `${name}.png`);

  fs.writeFileSync(actualPath, actualBuffer);

  if (config.visual.update || !fs.existsSync(baselinePath)) {
    fs.writeFileSync(baselinePath, actualBuffer);
    console.log(`      [visual] baseline disimpan: ${name}.png`);
    return { created: true, diffPixels: 0, ratio: 0 };
  }

  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const actual = PNG.sync.read(actualBuffer);

  if (baseline.width !== actual.width || baseline.height !== actual.height) {
    throw new Error(
      `[visual] Ukuran gambar berbeda untuk "${name}": baseline ${baseline.width}x${baseline.height}, actual ${actual.width}x${actual.height}`
    );
  }

  const { width, height } = baseline;
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(baseline.data, actual.data, diff.data, width, height, { threshold });
  const ratio = diffPixels / (width * height);

  if (ratio > maxDiffRatio) {
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    throw new Error(
      `[visual] "${name}" berbeda ${diffPixels} piksel (${(ratio * 100).toFixed(2)}%), batas ${(maxDiffRatio * 100).toFixed(2)}%. Lihat: ${diffPath}`
    );
  }

  if (fs.existsSync(diffPath)) fs.unlinkSync(diffPath);
  return { created: false, diffPixels, ratio };
}

module.exports = { compareScreenshot };
