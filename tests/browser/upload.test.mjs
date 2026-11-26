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

test('editor starts with the largest crop and keeps selections within image and minimum bounds', async () => {
    const html = execFileSync('php', ['tests/browser/fixture.php'], { encoding: 'utf8' });
    const script = await readFile('resources/assets/dist/manager.js', 'utf8');
    const css = await readFile('resources/assets/dist/manager.css', 'utf8');
    const browser = await chromium.launch({
        headless: true,
        ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    });
    const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
    try {
        await page.setContent(html);
        await page.addStyleTag({ content: '.modal-dialog-scrollable .modal-content { max-height: calc(100vh - 3.5rem); }'
            + css + 'body { margin: 0; } .modal { position: fixed; inset: 0; display: block; }' });
        await page.addScriptTag({ content: script });
        const layout = await page.evaluate(() => {
            const modal = document.querySelector('.modal-dialog').getBoundingClientRect();
            const shell = document.querySelector('.ml-upload-shell').getBoundingClientRect();
            const header = document.querySelector('.ml-upload-header').getBoundingClientRect();
            const close = document.querySelector('.ml-close').getBoundingClientRect();
            return { width: modal.width, height: modal.height, shellHeight: shell.height, rightGap: header.right - close.right };
        });

        assert.equal(layout.width, 900);
        assert.equal(layout.height, 700);
        assert.equal(layout.shellHeight, 700);
        assert.ok(layout.rightGap < 40);

        const png = await page.evaluate(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 300;
            return canvas.toDataURL('image/png').split(',')[1];
        });
        await page.locator('input.dz-hidden-input').setInputFiles({
            name: 'image.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64'),
        });
        await page.getByRole('button', { name: 'Crop & upload all' }).click();
        await page.waitForFunction(() => document.querySelector('[data-tool="apply"]')?.disabled === false);
        const state = () => page.evaluate(() => {
            const dialog = document.querySelector('.ml-crop-dialog').getBoundingClientRect();
            const image = document.querySelector('cropper-image').getBoundingClientRect();
            const selection = document.querySelector('cropper-selection').getBoundingClientRect();
            return {
                dialogWidth: dialog.width, dialogHeight: dialog.height,
                width: selection.width / image.width * 400,
                height: selection.height / image.height * 300,
                left: selection.left - image.left, top: selection.top - image.top,
                right: image.right - selection.right, bottom: image.bottom - selection.bottom,
            };
        });
        const initial = await state();
        assert.equal(initial.dialogWidth, 900);
        assert.equal(initial.dialogHeight, 700);
        assert.ok(Math.abs(initial.width - 300) < 0.1 && Math.abs(initial.height - 300) < 0.1);
        assert.ok(Math.abs(initial.top) < 0.1 && Math.abs(initial.bottom) < 0.1);

        await page.evaluate(() => {
            const selection = document.querySelector('cropper-selection');
            selection.$move(10000, 0);
            selection.$change(selection.x, selection.y, 1, 1);
            document.querySelector('cropper-image').$zoom(-0.9);
        });
        const blocked = await state();
        assert.ok(Math.abs(blocked.width - initial.width) < 0.1);
        assert.ok(Math.abs(blocked.left - initial.left) < 0.1);
        assert.ok(Math.abs(blocked.top - initial.top) < 0.1);

        await page.evaluate(() => {
            const selection = document.querySelector('cropper-selection');
            selection.$change(selection.x + selection.width / 3, selection.y + selection.height / 3,
                selection.width / 3, selection.height / 3);
            document.querySelector('cropper-image').$zoom(1);
        });
        const minimum = await state();
        assert.ok(Math.abs(minimum.width - 100) < 0.1 && Math.abs(minimum.height - 100) < 0.1);
        assert.ok(minimum.left >= -0.1 && minimum.top >= -0.1);
        assert.ok(minimum.right >= -0.1 && minimum.bottom >= -0.1);
        assert.equal(await page.getByRole('button', { name: 'Apply crop & upload' }).isEnabled(), true);
        await page.locator('.ml-crop-stage').focus();
        await page.keyboard.press('Shift+ArrowLeft');
        await page.evaluate(() => document.querySelector('cropper-image').$move(10000, 0));
        const afterInput = await state();
        assert.ok(Math.abs(afterInput.width - 100) < 0.1);
        assert.ok(Math.abs(afterInput.left - minimum.left) < 0.1);

        await page.setViewportSize({ width: 700, height: 500 });
        await page.waitForFunction(() => document.querySelector('.ml-crop-dialog').getBoundingClientRect().width === 700);
        await page.waitForFunction(() => {
            const image = document.querySelector('cropper-image').getBoundingClientRect();
            const selection = document.querySelector('cropper-selection').getBoundingClientRect();
            return Math.abs(selection.height / image.height * 300 - 300) < 0.1;
        });
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
