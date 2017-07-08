document.addEventListener("DOMContentLoaded", function () {

    // Get the template HTML and remove it from the doumenthe template HTML and remove it from the doument
    var previewNode = document.querySelector("#dropzone-file-template");
    previewNode.id = "";

    var previewTemplate = previewNode.parentNode.innerHTML;
    previewNode.parentNode.removeChild(previewNode);

    var myDropzone = new Dropzone(document.body, { // Make the whole body a dropzone
        url: "/target-url", // Set the url
        thumbnailWidth: 80,
        thumbnailHeight: 80,
        parallelUploads: 20,
        previewTemplate: previewTemplate,
        autoQueue: false, // Make sure the files aren't queued until manually added
        previewsContainer: "#dropzone-previews", // Define the container to display the previews
        clickable: ".fileinput-button" // Define the element that should be used as click trigger to select files.
    });

    myDropzone.on("addedfile", function (file) {
        // Hookup the start button
        file.previewElement.querySelector(".start").onclick = function () {
            myDropzone.enqueueFile(file);
        };
    });

    // Update the total progress bar
    myDropzone.on("totaluploadprogress", function (progress) {
        document.querySelector("#total-progress .progress-bar").style.width = progress + "%";
    });

    myDropzone.on("sending", function (file) {
        // Show the total progress bar when upload starts
        document.querySelector("#total-progress").style.opacity = "1";
        // And disable the start button
        file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
    });

    // Hide the total progress bar when nothing's uploading anymore
    myDropzone.on("queuecomplete", function (progress) {
        document.querySelector("#total-progress").style.opacity = "0";
    });

    // Setup the buttons for all transfers
    // The "add files" button doesn't need to be setup because the config
    // `clickable` has already been specified.
    document.querySelector("#actions .start").onclick = function () {
        myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED));
    };
    document.querySelector("#actions .cancel").onclick = function () {
        myDropzone.removeAllFiles(true);
    };

    Dropzone.options.myAwesomeDropzone = {
        paramName: "file",
        maxFilesize: 10,
        url: 'UploadImages',
        previewsContainer: "#dropzone-previews",
        uploadMultiple: true,
        parallelUploads: 5,
        maxFiles: 20,
        init: function () {
            var cd;
            this.on("success", function (file, response) {
                $('.dz-progress').hide();
                $('.dz-size').hide();
                $('.dz-error-mark').hide();
                cd = response;
            });

            this.on("addedfile", function (file) {
                var removeButton = Dropzone.createElement("<a href=\"#\">Remove file</a>");
                var _this = this;
                removeButton.addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _this.removeFile(file);
                    var removeData = "largeFileName=" + cd.pi.largePicPath + "&smallFileName=" + cd.pi.smallPicPath;
                    $.ajax({
                        type: 'POST',
                        url: 'DeleteImage',
                        data: removeData,
                        dataType: 'json'
                    });
                });
                file.previewElement.appendChild(removeButton);
            });
        }
    };
});