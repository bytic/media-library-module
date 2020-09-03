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

        this.editor = new MediaLibraryCropperEditor(this,this.image);
        this.editor.init();
    }

    destroy()
    {
        this.editor.destroy();
    }

    zoom(value)
    {
        this.cropper.zoom(value)
    }

    _onCancel() {

        // Remove the file
        this.dropzone.removeFile(this.file);

        this.destroy();
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

        this.destroy();
    }

    _createImage() {
        // Create an image node for Cropper.js
        this.image = new Image();
        this.image.src = URL.createObjectURL(this.file);
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
                // cropper.zoomTo(1);
            },

            // zoom: function (event) {
            //     // Keep the image in its natural size
            //     if (event.detail.oldRatio === 1) {
            //         event.preventDefault();
            //     }
            // }
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

class MediaLibraryCropperEditor {
    constructor(cropper, image) {
        this.cropper = cropper;
        this.image = image;
    }

    init() {
        this._createEditor();
        this._createImage();
        this._createButtonToolbar();
    }

    destroy() {
        // Remove the editor from the view
        document.body.removeChild(this.editor);
    }

    _createImage()
    {
        this.editor.appendChild(this.image);
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

    _createButtonToolbar() {
        // Create confirm button at the top left of the viewport
        var buttonToolbar = document.createElement('div');
        buttonToolbar.className = 'btn-toolbar';
        buttonToolbar.style.display = 'flex';
        buttonToolbar.style.justifyContent = 'center';
        buttonToolbar.appendChild(this._createButtonGroupZoom());
        buttonToolbar.appendChild(this._createButtonGroupConfirm());
        buttonToolbar.appendChild(this._createButtonGroupCancel());

        var buttonToolbarContainer = document.createElement('div');
        buttonToolbarContainer.style.position = 'absolute';
        buttonToolbarContainer.style.left = '0%';
        buttonToolbarContainer.style.top = '0';
        buttonToolbarContainer.style.padding = '15px 0';
        buttonToolbarContainer.style.width = '100%';
        buttonToolbarContainer.style.backgroundColor = 'rgba(0,0,0,.5)';
        buttonToolbarContainer.style.zIndex = 9999;
        buttonToolbarContainer.className = 'w-100 d-flex justify-content-center';

        buttonToolbarContainer.appendChild(buttonToolbar);

        this.editor.appendChild(buttonToolbarContainer);
    }

    _createButtonGroupConfirm() {
        var buttonGroup = document.createElement('div');
        buttonGroup.className = 'btn-group btn-group-lg mr-2';
        buttonGroup.style.marginLeft = '20px';

        buttonGroup.appendChild(this._createButtonConfirm());

        return buttonGroup;
    }

    _createButtonConfirm() {
        // Create confirm button at the top left of the viewport
        var btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.textContent = 'Salveaza';

        btn.addEventListener('click', this.cropper._onConfirm.bind(this.cropper));

        return btn;
    }

    _createButtonGroupCancel() {
        var buttonGroup = document.createElement('div');
        buttonGroup.className = 'btn-group btn-group-lg mr-2';
        buttonGroup.style.marginLeft = '20px';

        buttonGroup.appendChild(this._createButtonCancel());

        return buttonGroup;
    }

    _createButtonCancel() {
        // Create confirm button at the top left of the viewport
        var btn = document.createElement('button');
        btn.className = 'btn btn-danger';
        btn.textContent = 'Renunta';

        btn.addEventListener('click', this.cropper._onCancel.bind(this.cropper));

        return btn;
    }

    _createButtonGroupZoom() {
        var buttonGroup = document.createElement('div');
        buttonGroup.className = 'btn-group mr-2';
        buttonGroup.style.marginTop = '5px';
        buttonGroup.appendChild(this._createButtonZoom(0.1));
        buttonGroup.appendChild(this._createButtonZoom(-0.1));
        return buttonGroup;
    }

    _createButtonZoom(value) {
        // Create confirm button at the top left of the viewport
        var btn = document.createElement('button');
        btn.className = 'btn btn-secondary';

        var icon = document.createElement('i');
        if (value > 0) {
            icon.className = "fas fa-search-plus"
            btn.textContent = ' Zoom In';
        } else {
            icon.className = "fas fa-search-minus"
            btn.textContent = ' Zoom Out';
        }
        btn.prepend(icon);

        btn.addEventListener('click', function () {
            this.cropper.zoom(value);
        }.bind(this));

        return btn;
    }
}