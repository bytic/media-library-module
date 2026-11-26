import createDropzone from './_init-dropzone';

class MediaLibrary {
    constructor(element) {
        this.$ = window.jQuery || window.$;
        if (this.$) {
            this.panel = this.$(element);
            this.hookMediaActions();
        }
    }

    hookMediaActions() {
        this.panel.on('click', '.gallery-item a.set-default', this.setDefaultMedia.bind(this));
        this.panel.on('click', '.gallery-item a.negative', this.removeMedia.bind(this));
    }

    setDefaultMedia(event) {
        const $ = this.$;
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
            overlay.hide();
            if (response.type === 'success') {
                this.panel.find('.gallery-item').removeClass('default');
                galleryItem.addClass("default");
                this.panel.find('.gallery-item .default-badge').hide();
                galleryItem.find('.default-badge').show();
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
        const $ = this.$;
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
        const $ = this.$;
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

function init() {
    document.querySelectorAll('.medialibrary-panel:not([data-ml-initialized])').forEach((panel) => {
        panel.dataset.mlInitialized = 'true';
        new MediaLibrary(panel);
    });
    document.querySelectorAll('form.dropzone-gallery').forEach((form) => {
        if (form.dropzone) return;
        const zone = createDropzone(form);
        const modal = form.querySelector('.modal[role="dialog"]');
        if (!zone || !modal) return;
        const preventClose = (event) => {
            if (zone.getActiveFiles().length || modal.querySelector('.ml-crop-dialog[open]')) event.preventDefault();
        };
        const refresh = () => {
            if (form.dataset.mlUploaded === 'true') {
                delete form.dataset.mlUploaded;
                location.reload();
            }
        };
        modal.addEventListener('hide.bs.modal', preventClose);
        modal.addEventListener('hidden.bs.modal', refresh);
        const $ = window.jQuery || window.$;
        if ($?.fn?.on) $(modal).on('hide.bs.modal', preventClose).on('hidden.bs.modal', refresh);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
    init();
}
