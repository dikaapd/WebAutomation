module.exports = {
  baseUrl: 'https://www.saucedemo.com/',
  headed: process.env.HEADED === 'true',

  // Viewport tetap, dipaksa lewat CDP agar headless & headed identik
  viewport: { width: 1280, height: 720 },

  visual: {
    update: process.env.UPDATE_SNAPSHOTS === 'true',
    threshold: 0.1,      // sensitivitas warna per piksel di PixelMatch (0-1)
    maxDiffRatio: 0.01,  // batas maksimal rasio piksel berbeda (1%)
  },
};
