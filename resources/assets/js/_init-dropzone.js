import { Dropzone } from 'dropzone';
import editCrop from './_init-cropper';

export default function createDropzone(element) {
    // Accept either the original jQuery wrapper or a DOM form.
    const form = element?.nodeType ? element : element?.[0];
    if (!form || form.dropzone) return form?.dropzone;

    const previews = form.querySelector('.dropzone-previews');
    const previewNode = form.querySelector('.dropzone-file-template');
    if (!previews || !previewNode) return;
    const preview = previewNode.cloneNode(true);
    preview.removeAttribute('id');
    preview.removeAttribute('style');
    preview.hidden = false;
    previewNode.remove();

    const minWidth = Number(form.dataset.min_width) || 0;
    const minHeight = Number(form.dataset.min_height) || 0;
    const aspectRatio = Number(form.dataset.aspect_ratio);
    const modal = form.querySelector('.modal[role="dialog"]') || form;
    const controls = {
        start: form.querySelector('.dropzone-actions .start'),
        cancel: form.querySelector('.dropzone-actions .cancel'),
        status: form.querySelector('.ml-upload-status'),
        progress: form.querySelector('.total-progress'),
        bar: form.querySelector('.total-progress .progress-bar'),
        percent: form.querySelector('.upload-percent'),
    };
    const maxBytes = Number(form.dataset.max_bytes);
    let reviewing = false;

    const zone = new Dropzone(form, {
        acceptedFiles: form.dataset.accepted_files || 'image/*',
        maxFilesize: maxBytes > 0 ? maxBytes / 1048576 : 256,
        previewTemplate: preview.outerHTML,
        previewsContainer: previews,
        clickable: [...form.querySelectorAll('.fileinput-button, button.dz-upload-area')],
        hiddenInputContainer: form,
        parallelUploads: 3,
        autoQueue: false,
        createImageThumbnails: false,
        accept(file, done) {
            const image = new Image();
            const source = URL.createObjectURL(file);
            file.mlPreviewUrl = source;
            image.src = source;
            image.decode().then(() => {
                if (!this.files.includes(file)) return;
                if (image.naturalWidth < minWidth || image.naturalHeight < minHeight) {
                    done(`Choose an image at least ${minWidth} × ${minHeight} px.`);
                } else {
                    done();
                    this.emit('thumbnail', file, source);
                }
            }, () => {
                if (this.files.includes(file)) done('This file could not be opened as an image.');
            }).finally(() => update());
        },
    });

    const isReady = (file) => file.status === Dropzone.ADDED && file.accepted === true;
    const labels = {
        [Dropzone.ADDED]: 'Checking…',
        [Dropzone.QUEUED]: 'Queued',
        [Dropzone.UPLOADING]: 'Uploading…',
        [Dropzone.SUCCESS]: 'Uploaded',
        [Dropzone.ERROR]: 'Failed',
        [Dropzone.CANCELED]: 'Canceled',
    };

    function update() {
        const ready = zone.files.filter(isReady).length;
        const active = zone.getActiveFiles().length;
        const uploaded = zone.files.filter((file) => file.status === Dropzone.SUCCESS).length;
        const failed = zone.files.filter((file) => file.status === Dropzone.ERROR).length;
        if (controls.start) controls.start.disabled = !ready || reviewing;
        if (controls.cancel) controls.cancel.disabled = reviewing || zone.files.length === uploaded;
        if (controls.progress) {
            controls.progress.hidden = !active;
            controls.progress.style.opacity = active ? '1' : '0';
        }
        if (controls.status) {
            const summary = [
                ready && `${ready} ready to crop`,
                active && `${active} uploading or queued`,
                uploaded && `${uploaded} uploaded`,
                failed && `${failed} failed`,
            ].filter(Boolean).join(' · ');
            const status = reviewing ? 'Reviewing crops…' : summary || (zone.files.length ? 'Checking images…' : 'No images selected.');
            if (controls.status.textContent !== status) controls.status.textContent = status;
        }
        for (const file of zone.files) {
            const card = file.previewElement;
            const start = card?.querySelector('.start');
            const state = card?.querySelector('.ml-file-status');
            if (start) {
                start.disabled = reviewing || !isReady(file);
                start.hidden = file.status !== Dropzone.ADDED;
            }
            if (state) state.textContent = isReady(file) ? 'Ready to crop' : labels[file.status] || '';
        }
    }

    function setProgress(progress) {
        if (controls.bar) {
            controls.bar.style.width = `${progress}%`;
            controls.bar.setAttribute('aria-valuenow', String(Math.round(progress)));
        }
        if (controls.percent) controls.percent.textContent = `${Math.round(progress)}%`;
    }

    async function start(files) {
        if (reviewing) return;
        reviewing = true;
        update();
        const focused = document.activeElement;
        let errorMessage = '';
        try {
            if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) {
                throw new Error('Your browser does not support the crop editor. Please use a current browser.');
            }
            for (const file of files) {
                if (!zone.files.includes(file) || !isReady(file)) continue;
                const crop = await editCrop(file, modal, {
                    minWidth, minHeight, aspectRatio: Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : null,
                });
                if (!zone.files.includes(file)) continue;
                if (!crop) continue;
                if (crop.data) {
                    file.customPostParams = {
                        ...file.customPostParams,
                        cropper: new URLSearchParams(crop.data).toString(),
                    };
                    zone.emit('thumbnail', file, crop.preview);
                }
                if (!zone.getActiveFiles().length) setProgress(0);
                zone.enqueueFile(file);
            }
        } catch (error) {
            console.error('[MediaLibrary] Could not open the crop editor', error);
            errorMessage = error.message || 'Could not open the crop editor.';
        } finally {
            reviewing = false;
            update();
            if (errorMessage && controls.status) controls.status.textContent = errorMessage;
            if (modal.contains(document.activeElement) || document.activeElement === document.body) {
                (focused?.isConnected && !focused.disabled && !focused.hidden ? focused
                    : modal.querySelector('.ml-done, .fileinput-button'))?.focus();
            }
        }
    }

    form.addEventListener('submit', (event) => event.preventDefault());
    controls.start?.addEventListener('click', () => start(zone.files.filter(isReady)));
    controls.cancel?.addEventListener('click', () => {
        for (const file of [...zone.files]) {
            if (file.status !== Dropzone.SUCCESS) zone.removeFile(file);
        }
    });

    zone.on('addedfile', (file) => {
        file.previewElement?.querySelector('.start')?.addEventListener('click', () => start([file]));
        update();
    });
    zone.on('removedfile', (file) => {
        if (file.mlPreviewUrl) URL.revokeObjectURL(file.mlPreviewUrl);
        update();
    });
    zone.on('totaluploadprogress', setProgress);
    zone.on('processing', update);
    zone.on('sending', (file, xhr, formData) => {
        for (const [name, value] of Object.entries(file.customPostParams || {})) formData.append(name, value);
    });
    zone.on('success', () => {
        form.dataset.mlUploaded = 'true';
        update();
    });
    zone.on('error', (file) => {
        const message = file.previewElement?.querySelector('.dz-error-message');
        if (message) {
            message.hidden = false;
            message.style.display = '';
        }
        update();
    });
    zone.on('complete', update);
    update();
    return zone;
}
