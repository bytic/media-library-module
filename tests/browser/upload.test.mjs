import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

test('reviewing images serially preserves the original and sends crop coordinates', async () => {
    const html = execFileSync('php', ['tests/browser/fixture.php'], { encoding: 'utf8' });
    const script = await readFile('resources/assets/dist/manager.js', 'utf8');
    const css = await readFile('resources/assets/dist/manager.css', 'utf8');
    const browser = await chromium.launch({
        headless: true,
        ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    });

    const page = await browser.newPage();
    const uploads = [];
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    try {
        await page.route('http://media.test/**', async (route) => {
            if (route.request().url().endsWith('/upload')) {
                uploads.push(route.request().postDataBuffer().toString());
                await route.fulfill({ status: 200, body: '' });
            } else {
                await route.fulfill({ contentType: 'text/html', body: html });
            }
        });
        await page.goto('http://media.test/');
        await page.addStyleTag({ content: css + '.modal { display: block; }' });
        await page.addScriptTag({ content: script });
        const png = await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 300;
            canvas.getContext('2d').fillRect(0, 0, 400, 300);
            return canvas.toDataURL('image/png').split(',')[1];
        });
        const buffer = Buffer.from(png, 'base64');
        await page.locator('input.dz-hidden-input').setInputFiles([
            { name: 'one.png', mimeType: 'image/png', buffer },
            { name: 'two.png', mimeType: 'image/png', buffer },
        ]);
        await page.getByRole('button', { name: 'Crop & upload all' }).click();
        await page.getByRole('button', { name: 'Apply crop & upload' }).waitFor({ state: 'visible' });
        await page.waitForFunction(() => !document.querySelector('[data-tool="apply"]').disabled);
        await page.getByRole('button', { name: 'Apply crop & upload' }).click();
        await page.getByText('two.png', { exact: true }).last().waitFor();
        await page.waitForFunction(() => !document.querySelector('[data-tool="apply"]').disabled);
        await page.getByRole('button', { name: 'Cancel', exact: true }).click();
        await page.waitForFunction(() => document.querySelector('.ml-upload-status').textContent.includes('1 uploaded'));
        assert.equal(uploads.length, 1);
        assert.match(uploads[0], /name="media_type"\r\n\r\nimages/);
        assert.match(uploads[0], /name="cropper"\r\n\r\nx=\d+&y=\d+&width=\d+&height=\d+/);
        assert.match(uploads[0], /filename="one.png"/);
        assert.deepEqual(errors, []);
        assert.match(await page.locator('.ml-upload-status').textContent(), /1 ready to crop/);
    } finally {
        await browser.close();
    }
});

test('rejects images below the minimum dimensions without opening the crop editor', async () => {
    const html = execFileSync('php', ['tests/browser/fixture.php'], { encoding: 'utf8' });
    const script = await readFile('resources/assets/dist/manager.js', 'utf8');
    const browser = await chromium.launch({
        headless: true,
        ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    });
    const page = await browser.newPage();
    try {
        await page.setContent(html);
        await page.addStyleTag({ content: '.modal { display: block; }' });
        await page.addScriptTag({ content: script });
        const png = await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 20;
            canvas.height = 20;
            return canvas.toDataURL('image/png').split(',')[1];
        });
        await page.locator('input.dz-hidden-input').setInputFiles({
            name: 'small.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64'),
        });
        await page.getByText('Choose an image at least 100 × 100 px.').waitFor();
        assert.equal(await page.getByRole('button', { name: 'Crop & upload all' }).isDisabled(), true);
        assert.equal(await page.locator('.ml-crop-dialog').count(), 0);
    } finally {
        await browser.close();
    }
});
