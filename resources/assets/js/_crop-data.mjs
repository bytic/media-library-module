export function cropData(selection, image, width, height) {
    if (!image.width || !image.height || !selection.width || !selection.height) return null;

    // Cropper 2 reports display coordinates; the PHP endpoint expects source pixels.
    const x = (selection.left - image.left) * width / image.width;
    const y = (selection.top - image.top) * height / image.height;
    const right = (selection.right - image.left) * width / image.width;
    const bottom = (selection.bottom - image.top) * height / image.height;
    const leftPixel = Math.round(x);
    const topPixel = Math.round(y);
    const rightPixel = Math.round(right);
    const bottomPixel = Math.round(bottom);
    if (leftPixel < 0 || topPixel < 0 || rightPixel > width || bottomPixel > height
        || rightPixel <= leftPixel || bottomPixel <= topPixel) return null;

    return {
        x: leftPixel, y: topPixel, width: rightPixel - leftPixel, height: bottomPixel - topPixel,
        rotate: 0, scaleX: 1, scaleY: 1,
    };
}

export function initialCrop(image, canvas, aspectRatio, coverage) {
    const width = Math.min(image.width, canvas.width);
    const height = Math.min(image.height, canvas.height);
    const fitWidth = aspectRatio ? Math.min(width, height * aspectRatio) : width;
    const fitHeight = aspectRatio ? fitWidth / aspectRatio : height;
    return [
        image.left - canvas.left + (image.width - fitWidth * coverage) / 2,
        image.top - canvas.top + (image.height - fitHeight * coverage) / 2,
        fitWidth * coverage,
        fitHeight * coverage,
    ];
}
