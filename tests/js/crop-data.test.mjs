import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cropData, initialCrop } from '../../resources/assets/js/_crop-data.mjs';

test('maps displayed crop to original pixels after zoom and pan', () => {
    const image = { left: 10, top: 20, width: 400, height: 200 };
    const selection = { left: 110, top: 70, right: 310, bottom: 170, width: 200, height: 100 };
    assert.deepEqual(cropData(selection, image, 1200, 600), {
        x: 300, y: 150, width: 600, height: 300, rotate: 0, scaleX: 1, scaleY: 1,
    });
});

test('rejects empty or out-of-image selections', () => {
    const image = { left: 0, top: 0, width: 100, height: 100 };
    assert.equal(cropData({ left: -3, top: 0, right: 10, bottom: 10, width: 13, height: 10 }, image, 100, 100), null);
    assert.equal(cropData({ width: 0, height: 0 }, image, 100, 100), null);
});

test('initial crop fits image and viewport at requested aspect ratio', () => {
    const image = { left: 10, top: 20, width: 400, height: 200 };
    const canvas = { left: 0, top: 0, width: 300, height: 200 };
    const region = initialCrop(image, canvas, 1, 0.8);
    assert.deepEqual(region, [130, 40, 160, 160]);
});

test('full coverage uses the largest crop for landscape, portrait, and free ratios', () => {
    const canvas = { left: 0, top: 0, width: 400, height: 400 };
    const landscape = { left: 0, top: 100, width: 400, height: 200 };
    const portrait = { left: 100, top: 0, width: 200, height: 400 };
    assert.deepEqual(initialCrop(landscape, canvas, 1, 1), [100, 100, 200, 200]);
    assert.deepEqual(initialCrop(portrait, canvas, 2, 1), [100, 150, 200, 100]);
    assert.deepEqual(initialCrop(landscape, canvas, null, 1), [0, 100, 400, 200]);
});
