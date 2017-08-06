document.addEventListener("DOMContentLoaded", function () {

    Dropzone.autoDiscover = false;

    Dropzone.prototype.queueButtonsInit = function () {
        this.queueButtonsObserve();
        this.queueButtonsState(0);
    };

    Dropzone.prototype.queueButtonsObserve = function () {
        var instance = this;
        document.querySelector("#actions .start").addEventListener("click", function () {
            instance.enqueueFiles(instance.getFilesWithStatus(Dropzone.ADDED));
        }, false);
        document.querySelector("#actions .cancel").addEventListener("click", function () {
            instance.removeAllFiles(true);
        }, false);
    };

    Dropzone.prototype.queueButtonsState = function (state) {
        if (state === 1) {
            document.querySelector("#actions .start").removeAttribute("disabled");
            document.querySelector("#actions .start").style.opacity = "1";
            document.querySelector("#actions .cancel").removeAttribute("disabled");
            document.querySelector("#actions .cancel").style.opacity = "1";
        } else {
            document.querySelector("#actions .start").setAttribute("disabled", "disabled");
            document.querySelector("#actions .start").style.opacity = "0";
            document.querySelector("#actions .cancel").setAttribute("disabled", "disabled");
            document.querySelector("#actions .cancel").style.opacity = "0";
        }
    };

    // Get the template HTML and remove it from the doumenthe template HTML and remove it from the doument
    var previewNode = document.querySelector("#dropzone-file-template");
    previewNode.id = "";

    var previewTemplate = previewNode.parentNode.innerHTML;
    previewNode.parentNode.removeChild(previewNode);


    var myDropzone = new Dropzone('form.dropzone-gallery', { // Make the whole body a dropzone
        thumbnailWidth: 200,
        thumbnailHeight: 200,
        parallelUploads: 20,
        previewTemplate: previewTemplate,
        previewsContainer: "#dropzone-previews",
        autoQueue: false, // Make sure the files aren't queued until manually added
        clickable: ".fileinput-button", // Define the element that should be used as click trigger to select files.

        init: function () {
            this.queueButtonsInit();

            this.on("addedfile", function (file) {
                // Hookup the start button
                file.previewElement.querySelector(".start").onclick = function () {
                    myDropzone.enqueueFile(file);
                };

                this.queueButtonsState(1);
            });

            // Update the total progress bar
            this.on("totaluploadprogress", function (progress) {
                document.querySelector("#total-progress .progress-bar").style.width = progress + "%";
            });

            this.on("sending", function (file) {
                // Show the total progress bar when upload starts
                document.querySelector("#total-progress").style.opacity = "1";
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
                document.querySelector("#total-progress").style.opacity = "0";

                this.queueButtonsState(0);
            });
        }
    });

    // function () {
    //
    // }

    // Dropzone.options.myAwesomeDropzone = {
    //     paramName: "file",
    //     maxFilesize: 10,
    //     url: 'UploadImages',
    //     previewsContainer: "#dropzone-previews",
    //     uploadMultiple: true,
    //     parallelUploads: 5,
    //     maxFiles: 20,
    //     init: function () {
    //         var cd;
    //         this.on("success", function (file, response) {
    //             $('.dz-progress').hide();
    //             $('.dz-size').hide();
    //             $('.dz-error-mark').hide();
    //             console.log(response);
    //             console.log(file);
    //             cd = response;
    //         });
    //         this.on("addedfile", function (file) {
    //             var removeButton = Dropzone.createElement("<a href=\"#\">Remove file</a>");
    //             var _this = this;
    //             removeButton.addEventListener("click", function (e) {
    //                 e.preventDefault();
    //                 e.stopPropagation();
    //                 _this.removeFile(file);
    //                 var name = "largeFileName=" + cd.pi.largePicPath + "&smallFileName=" + cd.pi.smallPicPath;
    //                 $.ajax({
    //                     type: 'POST',
    //                     url: 'DeleteImage',
    //                     data: name,
    //                     dataType: 'json'
    //                 });
    //             });
    //             file.previewElement.appendChild(removeButton);
    //         });
    //     }
    // };
});