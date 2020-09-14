import Dropzone from 'dropzone';
import MediaLibraryCropper from './_init-cropper';

Dropzone.autoDiscover = false;

Dropzone.prototype.queueButtonsInit = function () {
    this.actionButtons = {
        start: this.element.querySelector(".dropzone-actions .start"),
        cancel: this.element.querySelector(".dropzone-actions .cancel"),
    }
    this.queueButtonsObserve();
    this.queueButtonsState(0);
};

Dropzone.prototype.queueButtonsObserve = function () {
    var instance = this;

    this.actionButtons.start.addEventListener("click", function () {
        instance.enqueueFiles(instance.getFilesWithStatus(Dropzone.ADDED));
    });

    this.actionButtons.cancel.addEventListener("click", function () {
        instance.removeAllFiles(true);
    });
};

Dropzone.prototype.queueButtonsState = function (state) {
    if (state === 1) {
        this.actionButtons.start.removeAttribute("disabled");
        this.actionButtons.start.style.opacity = "1";
        this.actionButtons.cancel.removeAttribute("disabled");
        this.actionButtons.cancel.style.opacity = "1";
    } else {
        this.actionButtons.start.setAttribute("disabled", "disabled");
        this.actionButtons.start.style.opacity = "0";
        this.actionButtons.cancel.setAttribute("disabled", "disabled");
        this.actionButtons.cancel.style.opacity = "0";
    }
};

var dropzoneOptionsImages = {
    thumbnailWidth: 300,
    thumbnailHeight: 300,
    parallelUploads: 20,
    autoQueue: false, // Make sure the files aren't queued until manually added
    constraint: {
        minWidth: 0,
        minHeight: 0,
    },

    init: function () {
        var dzClosure = this;

        this.queueButtonsInit();

        this.on("thumbnail", function (file) {
            var constraint = this.options.constraint;

            // Do the dimension checks you want to do
            if (file.width < constraint.minWidth || file.height < constraint.minHeight) {
                file.doRejection()
            }
            else {
                file.doAccept();
            }
        });

        this.on("addedfile", function (file) {
            // Hookup the start button
            file.previewElement.querySelector(".start").onclick = function () {
                dzClosure.enqueueFile(file);
            };

            this.queueButtonsState(1);
        });

        // Update the total progress bar
        this.on("totaluploadprogress", function (progress) {
            dzClosure.element.querySelector(".total-progress .progress-bar").style.width = progress + "%";
        });

        this.on("sending", function (file, xhr, formData) {
            // Show the total progress bar when upload starts
            dzClosure.element.querySelector(".total-progress").style.opacity = "1";

            // And disable the start button
            file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");

            if (file.hasOwnProperty('customPostParams')) {
                for (var postParam in file.customPostParams) {
                    formData.append(postParam, file.customPostParams[postParam]);
                }
            }
        });

        this.on("success", function (file, response) {
            file.previewElement.querySelector('.dz-progress').style.opacity = "0";
            file.previewElement.querySelector('.dz-size').style.opacity = "0";
            file.previewElement.querySelector('.dz-error-message').style.opacity = "0";

            $(file.previewElement.querySelector(".cancel")).hide();
            $(file.previewElement.querySelector(".start")).hide();
            file.previewElement.querySelector(".delete").style.display = "inline";
        });

        this.on("error", function (file, response, XMLHttpRequest) {
        });

        // Hide the total progress bar when nothing's uploading anymore
        this.on("queuecomplete", function (progress) {
            dzClosure.element.querySelector(".total-progress").style.opacity = "0";
            this.queueButtonsState(0);
        });
    },

    // Instead of directly accepting / rejecting the file, setup two
    // functions on the file that can be called later to accept / reject
    // the file.
    accept: function (file, done) {
        file.doAccept = done;
        file.doRejection = function () {

            // And disable the start button

            $(file.previewElement.querySelector(".start")).hide();
            $(file.previewElement.querySelector(".dz-progress")).hide();

            done("Invalid dimension.");
        };

        // Of course you could also just put the `done` function in the file
        // and call it either with or without error in the `thumbnail` event
        // callback, but I think that this is cleaner.
    }

}

var dropzoneOptionsImagesWithCropper =  Object.assign(
    dropzoneOptionsImages,
    {
        transformFile: function (file, done) {
            var cropper = new MediaLibraryCropper(this, file, done);
            cropper.init();
        }
    }
);


export default function createDropzone(element) {

    var options = dropzoneOptionsImagesWithCropper;

    options.constraint.minWidth = parseInt(element.data('min_width'));
    options.constraint.minHeight = parseInt(element.data('min_height'));
    options.acceptedFiles = element.data('accepted_files');

    // Get the template HTML and remove it from the doumenthe template HTML and remove it from the doument
    var previewNode = element.find(".dropzone-file-template")[0];
    previewNode.id = "";

    var previewTemplate = previewNode.parentNode.innerHTML;
    previewNode.parentNode.removeChild(previewNode);

    options.previewTemplate = previewTemplate;
    options.previewsContainer = element.find(".dropzone-previews")[0];

    options.clickable = element.find(".fileinput-button")[0];

    return new Dropzone(element[0], options);
}