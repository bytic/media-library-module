# media-library-module

[![Latest Version on Packagist](https://img.shields.io/packagist/v/bytic/media-library-module.svg?style=flat-square)](https://packagist.org/packages/bytic/media-library-module)
[![Latest Stable Version](https://poser.pugx.org/bytic/media-library-module/v/stable)](https://packagist.org/packages/bytic/media-library-module)
[![Latest Unstable Version](https://poser.pugx.org/bytic/media-library-module/v/unstable)](https://packagist.org/packages/bytic/media-library-module)

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)
[![Build Status](https://img.shields.io/travis/ByTIC/media-library-module/master.svg?style=flat-square)](https://travis-ci.org/ByTIC/media-library-module)
[![SensioLabsInsight](https://img.shields.io/sensiolabs/i/d50ab89b-8e58-47b5-a01b-fc9fa90088b5.svg?style=flat-square)](https://insight.sensiolabs.com/projects/d50ab89b-8e58-47b5-a01b-fc9fa90088b5)
[![Quality Score](https://img.shields.io/scrutinizer/g/bytic/media-library-module.svg?style=flat-square)](https://scrutinizer-ci.com/g/bytic/media-library-module)
[![StyleCI](https://styleci.io/repos/96218443/shield?branch=master)](https://styleci.io/repos/96218443)
[![Total Downloads](https://img.shields.io/packagist/dt/bytic/media-library-module.svg?style=flat-square)](https://packagist.org/packages/bytic/media-library-module)

A media module for bytic library

## Uploads and cropping

The gallery upload dialog accepts images by drag and drop or file picker. Select
**Crop & upload all** to review each image in turn; canceling a crop leaves that
image in the queue. The original file and source-pixel crop coordinates are sent
using the existing `file`, `media_type`, and `cropper` fields. The crop editor
requires a browser with native `<dialog>` support; without it, uploads are not
silently sent without cropping.

Existing applications can continue to provide a `media-library` Webpack entry
using `resources/assets/js/manager.js` and `resources/assets/scss/manager.scss`.
Otherwise the module serves its prebuilt standalone assets automatically. The
gallery actions still use the host application's jQuery and Bootstrap modal.

Composer supports the existing MediaLibrary 0.8/0.9 ranges and 1.x. Each
dependency version has its own PHP and extension requirements; MediaLibrary 1.x
requires PHP 8.3 or later.

## Development

Run `npm ci` and `npm run build` after changing frontend assets, and commit the
generated files in `resources/assets/dist`. The build requires Node.js 20 or
later. Run `npm test` for crop geometry tests and `npm run test:browser` for the
upload flow (install Chromium with `npx playwright install chromium`, or set
`CHROME_PATH` to an existing Chrome executable). The browser test also needs
Composer dependencies installed. Run PHP tests with `vendor/bin/phpunit`.
