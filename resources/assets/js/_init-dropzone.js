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

    init: function () {
        var dzClosure = this;

        this.queueButtonsInit();

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

        this.on("sending", function (file) {
            // Show the total progress bar when upload starts
            dzClosure.element.querySelector(".total-progress").style.opacity = "1";
            // And disable the start button
            file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
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


function createDropzone(element) {

    var options = dropzoneOptionsImagesWithCropper;
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