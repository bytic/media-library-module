import Dropzone from 'dropzone';
import MediaLibraryCropper from './_init-cropper';

Dropzone.autoDiscover = false;

Dropzone.prototype.queueButtonsInit = function () {
    this.actionButtons = {
        start: this.element.querySelector(".dropzone-actions .start"),
        cancel: this.element.querySelector(".dropzone-actions .cancel"),
    };
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
    var btn = this.actionButtons;
    if (state === 1) {
        btn.start.removeAttribute("disabled");
        btn.start.style.opacity = "1";
        btn.start.style.pointerEvents = "";
        btn.cancel.removeAttribute("disabled");
        btn.cancel.style.opacity = "1";
        btn.cancel.style.pointerEvents = "";
    } else {
        btn.start.setAttribute("disabled", "disabled");
        btn.start.style.opacity = "0";
        btn.start.style.pointerEvents = "none";
        btn.cancel.setAttribute("disabled", "disabled");
        btn.cancel.style.opacity = "0";
        btn.cancel.style.pointerEvents = "none";
    }
};

var dropzoneOptionsImages = {
    thumbnailWidth: 300,
    thumbnailHeight: 300,
    parallelUploads: 20,
    autoQueue: false,

    init: function () {
        var dzClosure = this;
        var dropArea = this.element.querySelector('#dz-drop-area');

        this.queueButtonsInit();

        // Make the drop area also a clickable trigger
        if (dropArea) {
            dropArea.addEventListener('click', function () {
                dzClosure.hiddenFileInput && dzClosure.hiddenFileInput.click();
            });
        }

        this.on("thumbnail", function (file) {
            var constraint = this.options.constraint;
            if (file.width < constraint.minWidth || file.height < constraint.minHeight) {
                file.doRejection();
            } else {
                file.doAccept();
            }
        });

        this.on("addedfile", function (file) {
            var startBtn = file.previewElement && file.previewElement.querySelector(".start");
            if (startBtn) {
                startBtn.addEventListener("click", function () {
                    dzClosure.enqueueFile(file);
                });
            }

            // Hide the drop area hint once files are added
            if (dropArea) {
                dropArea.style.display = 'none';
            }

            this.queueButtonsState(1);
        });

        this.on("totaluploadprogress", function (progress) {
            var bar = dzClosure.element.querySelector(".total-progress .progress-bar");
            var pct = dzClosure.element.querySelector(".upload-percent");
            if (bar) bar.style.width = progress + "%";
            if (pct) pct.textContent = Math.round(progress) + "%";
        });

        this.on("sending", function (file, xhr, formData) {
            var totalProgress = dzClosure.element.querySelector(".total-progress");
            if (totalProgress) totalProgress.style.opacity = "1";

            var startBtn = file.previewElement && file.previewElement.querySelector(".start");
            if (startBtn) startBtn.setAttribute("disabled", "disabled");

            if (file.hasOwnProperty('customPostParams')) {
                for (var postParam in file.customPostParams) {
                    formData.append(postParam, file.customPostParams[postParam]);
                }
            }
        });

        this.on("success", function (file) {
            if (!file.previewElement) return;
            var progress = file.previewElement.querySelector('.dz-progress');
            var errorMsg = file.previewElement.querySelector('.dz-error-message');
            if (progress) progress.style.opacity = "0";
            if (errorMsg) errorMsg.style.display = "none";

            var cancelBtn = file.previewElement.querySelector(".cancel");
            var startBtn = file.previewElement.querySelector(".start");
            var deleteBtn = file.previewElement.querySelector(".delete");
            if (cancelBtn) cancelBtn.style.display = "none";
            if (startBtn) startBtn.style.display = "none";
            if (deleteBtn) deleteBtn.style.display = "inline-flex";
        });

        this.on("error", function (file, message) {
            if (!file.previewElement) return;
            var errorMsg = file.previewElement.querySelector('.dz-error-message');
            if (errorMsg) {
                errorMsg.style.display = "block";
            }
        });

        this.on("queuecomplete", function () {
            var totalProgress = dzClosure.element.querySelector(".total-progress");
            if (totalProgress) {
                setTimeout(function () {
                    totalProgress.style.opacity = "0";
                }, 1500);
            }
            dzClosure.queueButtonsState(0);
        });

        this.on("removedfile", function () {
            var remaining = dzClosure.files.length;
            if (remaining === 0 && dropArea) {
                dropArea.style.display = '';
            }
            if (remaining === 0) {
                dzClosure.queueButtonsState(0);
            }
        });
    },

    accept: function (file, done) {
        file.doAccept = done;
        file.doRejection = function () {
            var startBtn = file.previewElement && file.previewElement.querySelector(".start");
            var progress = file.previewElement && file.previewElement.querySelector(".dz-progress");
            if (startBtn) startBtn.style.display = "none";
            if (progress) progress.style.display = "none";
            done("Invalid dimensions: image is too small.");
        };
    }
};

var dropzoneOptionsImagesWithCropper = Object.assign(
    {},
    dropzoneOptionsImages,
    {
        transformFile: function (file, done) {
            var cropper = new MediaLibraryCropper(this, file, done);
            cropper.init();
        }
    }
);


export default function createDropzone(element) {
    const options = Object.assign({}, dropzoneOptionsImagesWithCropper);

    options.acceptedFiles = element.data('accepted_files');
    options.constraint = {
        minWidth: parseInt(element.data('min_width'), 10),
        minHeight: parseInt(element.data('min_height'), 10),
    };

    const previewNode = element.find(".dropzone-file-template")[0];
    if (previewNode) {
        previewNode.id = "";
        const previewTemplate = previewNode.parentNode.innerHTML;
        previewNode.parentNode.removeChild(previewNode);
        options.previewTemplate = previewTemplate;
    }

    options.previewsContainer = element.find(".dropzone-previews")[0];
    options.clickable = element.find(".fileinput-button")[0];
    options.url = element.attr('action');

    return new Dropzone(element[0], options);
}
