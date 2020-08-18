import Cropper from 'cropperjs';

export default class MediaLibraryCropper {

    constructor(dropzone, file, done) {
        this.dropzone = dropzone;
        this.file = file;
        this.done = done;
    }

    init() {
        this._createEditor();
        this._createButton();
        this._createImage();
        this._createCropper();
    }

    _createEditor() {
        // Create the image editor overlay
        var editor = document.createElement('div');
        editor.style.position = 'fixed';
        editor.style.left = 0;
        editor.style.right = 0;
        editor.style.top = 0;
        editor.style.bottom = 0;
        editor.style.zIndex = 9999;
        editor.style.backgroundColor = '#000';
        document.body.appendChild(editor);
        this.editor = editor;
    }

    _createButton() {
        // Create confirm button at the top left of the viewport
        var buttonConfirm = document.createElement('button');
        buttonConfirm.style.position = 'absolute';
        buttonConfirm.style.left = '50%';
        buttonConfirm.style.top = '10px';
        buttonConfirm.style.zIndex = 9999;
        buttonConfirm.className = 'btn btn-primary';
        buttonConfirm.textContent = 'Confirm';
        this.editor.appendChild(buttonConfirm);

        buttonConfirm.addEventListener('click', this._onConfirm.bind(this));
    }

    _onConfirm() {
        // Get the canvas with image data from Cropper.js
        var canvas = this.cropper.getCroppedCanvas();

        if (!this.file.hasOwnProperty('customPostParams')) {
            this.file.customPostParams = {};
        }

        this.file.customPostParams.cropper = $.param(this.cropper.getData());

        // Turn the canvas into a Blob (file object without a name)
        canvas.toBlob(this._recreateThumbnail.bind(this));

        // Return the file to Dropzone
        this.done(this.file);

        // Remove the editor from the view
        document.body.removeChild(this.editor);
    }

    _createImage() {
        // Create an image node for Cropper.js
        this.image = new Image();
        this.image.src = URL.createObjectURL(this.file);
        this.editor.appendChild(this.image);
    }

    _createCropper() {
        // Create Cropper.js
        var cropper = new Cropper(this.image, {
            dragMode: 'move',
            viewMode: 2,
            aspectRatio: this.dropzone.element.dataset.aspect_ratio,
            minCropBoxWidth: parseInt(this.dropzone.element.dataset.min_width) + 1,
            minCropBoxHeight: parseInt(this.dropzone.element.dataset.min_height) + 1,

            ready: function (event) {
                // Zoom the image to its natural size
                cropper.zoomTo(1);
            },

            zoom: function (event) {
                // Keep the image in its natural size
                if (event.detail.oldRatio === 1) {
                    event.preventDefault();
                }
            }
        });

        this.cropper = cropper;
    }

    _recreateThumbnail(blob) {
        // Create a new Dropzone file thumbnail
        this.dropzone.createThumbnail(
            blob,
            this.dropzone.options.thumbnailWidth,
            this.dropzone.options.thumbnailHeight,
            this.dropzone.options.thumbnailMethod,
            false,
            function (dataURL) {
                // Update the Dropzone file thumbnail
                this.dropzone.emit('thumbnail', this.file, dataURL);
            }.bind(this)
        );
    }
}