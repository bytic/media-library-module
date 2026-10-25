import Cropper from 'cropperjs';

export default class MediaLibraryCropper {

    constructor(dropzone, file, done) {
        this.dropzone = dropzone;
        this.file = file;
        this.done = done;
    }

    init() {
        this._createImage();
        this._createCropper();

        this.editor = new MediaLibraryCropperEditor(this, this.image);
        this.editor.init();
    }

    destroy() {
        this.editor.destroy();
    }

    zoom(value) {
        this.cropper.zoom(value);
    }

    _onCancel() {
        this.dropzone.removeFile(this.file);
        this.destroy();
    }

    _onConfirm() {
        var canvas = this.cropper.getCroppedCanvas();

        if (!this.file.hasOwnProperty('customPostParams')) {
            this.file.customPostParams = {};
        }

        this.file.customPostParams.cropper = new URLSearchParams(this.cropper.getData()).toString();

        canvas.toBlob(this._recreateThumbnail.bind(this));
        this.done(this.file);
        this.destroy();
    }

    _createImage() {
        this.image = new Image();
        this.image.src = URL.createObjectURL(this.file);
    }

    _createCropper() {
        this.cropper = new Cropper(this.image, {
            dragMode: 'move',
            viewMode: 2,
            aspectRatio: parseFloat(this.dropzone.element.dataset.aspect_ratio) || NaN,
            minCropBoxWidth: parseInt(this.dropzone.element.dataset.min_width, 10) + 1,
            minCropBoxHeight: parseInt(this.dropzone.element.dataset.min_height, 10) + 1,
        });
    }

    _recreateThumbnail(blob) {
        this.dropzone.createThumbnail(
            blob,
            this.dropzone.options.thumbnailWidth,
            this.dropzone.options.thumbnailHeight,
            this.dropzone.options.thumbnailMethod,
            false,
            function (dataURL) {
                this.dropzone.emit('thumbnail', this.file, dataURL);
            }.bind(this)
        );
    }
}

class MediaLibraryCropperEditor {
    constructor(cropper, image) {
        this.cropper = cropper;
        this.image = image;
        this._keyHandler = this._onKeyDown.bind(this);
    }

    init() {
        this._createEditor();
        this._createImage();
        this._createToolbar();
        document.addEventListener('keydown', this._keyHandler);
    }

    destroy() {
        document.removeEventListener('keydown', this._keyHandler);
        if (this.editor && this.editor.parentNode) {
            document.body.removeChild(this.editor);
        }
    }

    _onKeyDown(e) {
        if (e.key === 'Escape') {
            this.cropper._onCancel();
        } else if (e.key === 'Enter') {
            this.cropper._onConfirm();
        }
    }

    _createImage() {
        this.editor.querySelector('.mlc-image-container').appendChild(this.image);
    }

    _createEditor() {
        var editor = document.createElement('div');
        editor.setAttribute('role', 'dialog');
        editor.setAttribute('aria-modal', 'true');
        editor.setAttribute('aria-label', 'Image Cropper');
        editor.style.cssText = [
            'position:fixed',
            'inset:0',
            'z-index:10000',
            'background:#111',
            'display:flex',
            'flex-direction:column',
        ].join(';');

        editor.innerHTML = `
            <div class="mlc-toolbar" style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                padding:10px 16px;
                background:rgba(0,0,0,0.85);
                border-bottom:1px solid rgba(255,255,255,0.1);
                flex-shrink:0;
                gap:8px;
                flex-wrap:wrap;
            ">
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="color:#fff;font-size:0.85rem;font-weight:600;letter-spacing:0.5px;opacity:0.8;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:4px;"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>
                        Crop Image
                    </span>
                </div>
                <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
                    <div class="mlc-zoom-group" style="display:flex;gap:4px;">
                        <button type="button" class="mlc-btn mlc-btn-secondary mlc-zoom-in" title="Zoom in (scroll up)" style="
                            padding:6px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.2);
                            background:rgba(255,255,255,0.1);color:#fff;cursor:pointer;font-size:0.8rem;
                            display:flex;align-items:center;gap:5px;white-space:nowrap;
                        ">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                            Zoom In
                        </button>
                        <button type="button" class="mlc-btn mlc-btn-secondary mlc-zoom-out" title="Zoom out (scroll down)" style="
                            padding:6px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.2);
                            background:rgba(255,255,255,0.1);color:#fff;cursor:pointer;font-size:0.8rem;
                            display:flex;align-items:center;gap:5px;white-space:nowrap;
                        ">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                            Zoom Out
                        </button>
                    </div>
                    <div style="width:1px;height:28px;background:rgba(255,255,255,0.15);"></div>
                    <button type="button" class="mlc-btn mlc-btn-cancel" title="Cancel (Esc)" style="
                        padding:6px 16px;border-radius:6px;border:1px solid rgba(239,68,68,0.5);
                        background:rgba(239,68,68,0.15);color:#f87171;cursor:pointer;font-size:0.85rem;
                        display:flex;align-items:center;gap:5px;white-space:nowrap;
                    ">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Cancel
                    </button>
                    <button type="button" class="mlc-btn mlc-btn-confirm" title="Confirm crop (Enter)" style="
                        padding:6px 20px;border-radius:6px;border:none;
                        background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;cursor:pointer;font-size:0.85rem;font-weight:600;
                        display:flex;align-items:center;gap:5px;white-space:nowrap;box-shadow:0 2px 8px rgba(59,130,246,0.4);
                    ">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        Apply Crop
                    </button>
                </div>
            </div>
            <div class="mlc-image-container" style="flex:1;overflow:hidden;display:flex;align-items:center;justify-content:center;"></div>
            <div class="mlc-hint" style="
                text-align:center;padding:6px;font-size:0.72rem;color:rgba(255,255,255,0.4);
                background:rgba(0,0,0,0.6);flex-shrink:0;
            ">
                Drag to reposition &bull; Scroll to zoom &bull; <kbd style="background:rgba(255,255,255,0.15);padding:1px 5px;border-radius:3px;color:rgba(255,255,255,0.6);">Enter</kbd> to apply &bull; <kbd style="background:rgba(255,255,255,0.15);padding:1px 5px;border-radius:3px;color:rgba(255,255,255,0.6);">Esc</kbd> to cancel
            </div>
        `;

        document.body.appendChild(editor);
        this.editor = editor;

        this.editor.querySelector('.mlc-zoom-in').addEventListener('click', () => this.cropper.zoom(0.1));
        this.editor.querySelector('.mlc-zoom-out').addEventListener('click', () => this.cropper.zoom(-0.1));
        this.editor.querySelector('.mlc-btn-confirm').addEventListener('click', this.cropper._onConfirm.bind(this.cropper));
        this.editor.querySelector('.mlc-btn-cancel').addEventListener('click', this.cropper._onCancel.bind(this.cropper));
    }

    _createToolbar() {
        // Toolbar is already created inline in _createEditor
    }
}
