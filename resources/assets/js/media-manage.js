document.addEventListener("DOMContentLoaded", function () {

    $('.gallery-item a.set-default').click(function (event) {
        MediaLibrary.setDefaultMedia(event);
    });
    $('.gallery-item a.negative').click(function (event) {
        MediaLibrary.removeImage(event);
    });

    var MediaLibrary = function (element) {
        this.$panel = $(element);
        this.$uploadModal = this.$element.find('.modal[data-role="dialog"]');
    };

    MediaLibrary.prototype.init = function () {
        this.hookUploadModal(this.$uploadModal);
        this.hookMediaActions();
    };

    MediaLibrary.prototype.hookUploadModal = function (element) {
        this.$uploadModal = $(element);

        this.$uploadModal.on('hidden.bs.modal', function (e) {
            this.closeModal(e);
        });
    };

    MediaLibrary.prototype.closeModal = function (e) {
        console.log('test');
    };

    MediaLibrary.prototype.setDefaultMedia = function (event) {
        event.stopPropagation();

        var element = $(event.target);
        var galleryItem = element.parents('.gallery-item');
        var overlay = galleryItem.find('.overlay');

        overlay.show().fadeTo('fast', 0.7);

        $.ajax({
            url: MediaLibrary.defaultMediaURL,
            type: "POST",
            data: {
                mediaType: 'image',
                mediaName: element.attr('rel'),
            },
            context: document.body
        }).done(function (response) {

            $('.gallery-item').removeClass('default');
            galleryItem.addClass("default");
            overlay.hide();

            if (response.type == 'success') {
                $.jGrowl("Imaginea a fost stabilita ca principala", {header: "Confirmare"});
            } else {
                $.jGrowl("Imaginea nu a putut fi stabilita ca principala", {header: "Eroare"});
            }
        });
    };

    MediaLibrary.removeImage = function (event) {
        event.stopPropagation();

        var galleryItem = $(event.target).parents('.gallery-item');
        var element = galleryItem.find('a.negative');
        var overlay = galleryItem.find('.overlay');

        if (confirm("Sunteti sigur(a)?")) {
            overlay.show().fadeTo('fast', 0.7);

            $.ajax({
                url: MediaLibrary.removeMediaURL,
                type: "POST",
                data: {image: element.attr('rel')},
                context: document.body
            }).done(function (response) {
                if (response.type == 'success') {
                    galleryItem.remove();
                    $.jGrowl("Imaginea a fost stearsa", {header: "Confirmare"});
                } else {
                    $.jGrowl("Imaginea nu a putut fi stearsa", {header: "Eroare"});
                }

                if ($('.gallery-item').size() == 0) {
                    $('item-gallery').find('.alert-info').show();
                }
            });
        }
    };

    MediaLibrary.setDefaultCover = function (event) {
        event.stopPropagation();

        var element = $(event.target);
        var galleryItem = element.parents('.gallery-item');
        var overlay = galleryItem.find('.overlay');


        overlay.show().fadeTo('fast', 0.7);

        $.ajax({
            url: MediaLibrary.setDefaultCoverURL,
            type: "POST",
            data: {image: element.attr('rel')},
            context: document.body
        }).done(function (response) {

            $('.gallery-item').removeClass('default');
            galleryItem.addClass("default");
            overlay.hide();

            if (response.type == 'success') {
                $.jGrowl("Imaginea a fost stabilita ca principala", {header: "Confirmare"});
            } else {
                $.jGrowl("Imaginea nu a putut fi stabilita ca principala", {header: "Eroare"});
            }
        });
    };

    MediaLibrary.removeCover = function (event) {
        event.stopPropagation();

        var galleryItem = $(event.target).parents('.gallery-item');
        var element = galleryItem.find('a.negative');
        var overlay = galleryItem.find('.overlay');

        if (confirm("Sunteti sigur(a)?")) {
            overlay.show().fadeTo('fast', 0.7);

            $.ajax({
                url: MediaLibrary.removeCoverURL,
                type: "POST",
                data: {image: element.attr('rel')},
                context: document.body
            }).done(function (response) {
                if (response.type == 'success') {
                    galleryItem.remove();
                    $.jGrowl("Imaginea a fost stearsa", {header: "Confirmare"});
                } else {
                    $.jGrowl("Imaginea nu a putut fi stearsa", {header: "Eroare"});
                }

                if ($('.gallery-item').size() == 0) {
                    $('item-gallery').find('.alert-info').show();
                }
            });
        }
    };


    // MediaLibrary DATA-API
    // ==============
    $('.medialibrary-panel').each(function () {
        $(this).MediaLibrary();
    });
});
