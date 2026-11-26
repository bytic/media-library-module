import Cropper, { DEFAULT_TEMPLATE } from 'cropperjs';
import { cropData, initialCrop } from './_crop-data.mjs';

const template = DEFAULT_TEMPLATE
    .replace('rotatable scalable skewable translatable', 'scalable translatable')
    .replace('action="select" plain', 'action="move" plain')
    .replace('initial-coverage="0.5" movable resizable', 'precise movable resizable');

export default function editCrop(file, host, { aspectRatio, minWidth, minHeight }) {
    return new Promise((resolve) => {
        const dialog = document.createElement('dialog');
        dialog.className = 'ml-crop-dialog';
        dialog.setAttribute('aria-label', 'Crop image');
        dialog.innerHTML = `
            <header class="ml-crop-header">
                <span class="ml-eyebrow">Image editor</span>
                <h2>Crop image</h2>
                <p class="ml-crop-filename"></p>
            </header>
            <div class="ml-crop-stage" tabindex="0" aria-label="Crop workspace"></div>
            <div class="ml-crop-tools">
                <div role="group" aria-label="Crop tools">
                    <button type="button" class="ml-button" data-tool="out" aria-label="Zoom out" disabled>−</button>
                    <button type="button" class="ml-button" data-tool="in" aria-label="Zoom in" disabled>+</button>
                    <button type="button" class="ml-button" data-tool="reset" disabled>Reset</button>
                </div>
                <span class="ml-crop-size"></span>
            </div>
            <p class="ml-crop-hint">Drag to adjust. In the workspace, use arrow keys to move, Shift + arrows to resize, and + or − to zoom.</p>
            <p class="ml-crop-message" role="status">Loading image…</p>
            <footer class="ml-crop-footer">
                <button type="button" class="ml-button" data-tool="cancel" autofocus>Cancel</button>
                <button type="button" class="ml-button ml-button-primary" data-tool="apply" disabled>Apply crop &amp; upload</button>
            </footer>`;

        const stage = dialog.querySelector('.ml-crop-stage');
        const message = dialog.querySelector('.ml-crop-message');
        const size = dialog.querySelector('.ml-crop-size');
        const apply = dialog.querySelector('[data-tool="apply"]');
        dialog.querySelector('.ml-crop-filename').textContent = file.name;
        const original = new Image();
        const url = URL.createObjectURL(file);
        original.src = url;
        stage.append(original);
        host.append(dialog);

        let cropper, image, selection, canvas, frame, current;
        let ready = false;
        let closed = false;

        function finish(result) {
            if (closed) return;
            closed = true;
            cancelAnimationFrame(frame);
            cropper?.destroy();
            dialog.close();
            dialog.remove();
            URL.revokeObjectURL(url);
            resolve(result);
        }

        function update() {
            current = cropData(selection.getBoundingClientRect(), image.getBoundingClientRect(),
                original.naturalWidth, original.naturalHeight);
            size.textContent = current ? `${current.width} × ${current.height} px` : '';
            const error = !current ? 'Keep the selection inside the image.'
                : current.width < minWidth || current.height < minHeight
                    ? `Choose a crop at least ${minWidth} × ${minHeight} px.` : '';
            if (message.textContent !== error) message.textContent = error;
            apply.disabled = Boolean(error);
        }

        function scheduleUpdate() {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(update);
        }

        function reset() {
            image.$resetTransform().$center('contain');
            const imageRect = image.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            let region = initialCrop(imageRect, canvasRect, aspectRatio, 0.8);
            if (region[2] / imageRect.width * original.naturalWidth < minWidth
                || region[3] / imageRect.height * original.naturalHeight < minHeight) {
                region = initialCrop(imageRect, canvasRect, aspectRatio, 1);
            }
            selection.$change(...region);
            update();
        }

        function zoom(amount) {
            // Zoom about the selection center, not the center of the image.
            const rect = image.getBoundingClientRect();
            const box = selection.getBoundingClientRect();
            image.$zoom(amount, box.left + box.width / 2 - rect.left, box.top + box.height / 2 - rect.top);
        }

        dialog.addEventListener('cancel', (event) => {
            event.preventDefault();
            finish(null);
        });
        dialog.addEventListener('keydown', (event) => {
            // Prevent the underlying Bootstrap modal from also responding to Escape.
            if (event.key === 'Escape') {
                event.stopPropagation();
                return;
            }
            if (event.target !== stage || !ready) return;
            const movement = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
            if (!movement && !['+', '=', '-'].includes(event.key)) return;
            event.preventDefault();
            if (!movement) {
                zoom(event.key === '-' ? -0.1 : 0.1);
            } else if (event.shiftKey) {
                const [x, y] = movement;
                const width = selection.width + (aspectRatio ? (x || y) : x) * 4;
                const height = aspectRatio ? width / aspectRatio : selection.height + y * 4;
                if (width > 0 && height > 0) {
                    selection.$change(selection.x + (selection.width - width) / 2,
                        selection.y + (selection.height - height) / 2, width, height);
                }
            } else {
                selection.$move(movement[0] * 4, movement[1] * 4);
            }
        });
        dialog.addEventListener('click', async (event) => {
            const tool = event.target.closest('[data-tool]')?.dataset.tool;
            if (tool === 'cancel') finish(null);
            if (!ready || closed) return;
            if (tool === 'in' || tool === 'out') zoom(tool === 'in' ? 0.1 : -0.1);
            if (tool === 'reset') reset();
            if (tool === 'apply') {
                update();
                if (apply.disabled) return;
                const data = current;
                const preview = document.createElement('canvas');
                const scale = Math.min(1, 320 / Math.max(data.width, data.height));
                preview.width = Math.max(1, Math.round(data.width * scale));
                preview.height = Math.max(1, Math.round(data.height * scale));
                preview.getContext('2d').drawImage(original, data.x, data.y, data.width, data.height,
                    0, 0, preview.width, preview.height);
                finish({ data, preview: preview.toDataURL() });
            }
        });

        dialog.showModal();
        cropper = new Cropper(original, { container: stage, template });
        image = cropper.getCropperImage();
        selection = cropper.getCropperSelection();
        canvas = cropper.getCropperCanvas();
        image.$ready().then(() => {
            if (closed) return;
            if (aspectRatio) selection.aspectRatio = aspectRatio;
            reset();
            image.addEventListener('transform', scheduleUpdate);
            selection.addEventListener('change', scheduleUpdate);
            dialog.querySelectorAll('.ml-crop-tools button').forEach((button) => { button.disabled = false; });
            ready = true;
        }).catch(() => {
            if (!closed) message.textContent = 'This image could not be opened. Cancel and select another image.';
        });
    });
}
