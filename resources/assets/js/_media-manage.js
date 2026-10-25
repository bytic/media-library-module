import createDropzone from './_init-dropzone';

$ = window.$;

class MediaLibrary {
    constructor(element) {
        this.panel = $(element);
        this.uploadModal = this.panel.find('.modal[role="dialog"]');
        this.formDropzone = this.panel.find('form.dropzone-gallery');
        this.init();
    }

    init() {
        this.hookUploadModal();
        this.hookMediaActions();
        this.hookFormDropzone();
    }

    hookUploadModal() {
        this.uploadModal.on('hidden.bs.modal', this.closeModal.bind(this));
    }

    hookMediaActions() {
        this.panel.on('click', '.gallery-item a.set-default', $.proxy(this.setDefaultMedia, this));
        this.panel.on('click', '.gallery-item a.negative', $.proxy(this.removeMedia, this));
    }

    hookFormDropzone() {
        createDropzone(this.formDropzone);
    }

    closeModal() {
        location.reload();
    }

    setDefaultMedia(event) {
        event.stopPropagation();

        var link = $(event.currentTarget);
        var galleryItem = link.closest('.gallery-item');
        var overlay = galleryItem.find('.overlay');

        overlay.show().fadeTo('fast', 0.7);

        $.ajax({
            url: link.attr('data-url'),
            type: "POST",
            data: {
                media_type: link.attr('data-type'),
                media_filename: link.attr('data-filename'),
            },
            context: this
        }).done(function (response) {
            this.panel.find('.gallery-item').removeClass('default');
            galleryItem.addClass("default");
            overlay.hide();

            // Update the default badge visibility
            this.panel.find('.gallery-item .default-badge').hide();
            galleryItem.find('.default-badge').show();

            if (response.type === 'success') {
                this._notify("Image set as default", "success");
            } else {
                this._notify("Could not set image as default", "error");
            }
        }).fail(function () {
            overlay.hide();
            this._notify("Request failed", "error");
        });
    }

    removeMedia(event) {
        event.stopPropagation();

        var link = $(event.currentTarget);
        var galleryItem = link.closest('.gallery-item');
        var overlay = galleryItem.find('.overlay');

        if (!confirm("Are you sure you want to delete this image?")) {
            return;
        }

        overlay.show().fadeTo('fast', 0.7);

        $.ajax({
            url: link.attr('data-url'),
            type: "POST",
            data: {
                media_type: link.attr('data-type'),
                media_filename: link.attr('data-filename'),
            },
            context: this
        }).done(function (response) {
            if (response.type === 'success') {
                galleryItem.closest('[class*="col-"]').remove();
                this._notify("Image deleted", "success");
                if (this.panel.find('.gallery-item').length === 0) {
                    this.panel.find('#item-gallery .alert-info').show();
                }
            } else {
                overlay.hide();
                this._notify("Could not delete image", "error");
            }
        }).fail(function () {
            overlay.hide();
            this._notify("Request failed", "error");
        });
    }

    _notify(message, type) {
        if (typeof $.jGrowl === 'function') {
            var header = type === 'success' ? 'Success' : 'Error';
            $.jGrowl(message, {header: header});
        } else if (typeof toastr !== 'undefined') {
            toastr[type](message);
        } else {
            console.log('[MediaLibrary]', type, message);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.medialibrary-panel').forEach(function (el) {
        new MediaLibrary(el);
    });
});
