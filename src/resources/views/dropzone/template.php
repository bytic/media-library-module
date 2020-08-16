<!-- HTML heavily inspired by http://blueimp.github.io/jQuery-File-Upload/ -->
<style>
    #dropzone-previews .file-row {
        border: 1px solid #ddd;
        padding: 8px 8px 0px;
    }

    #dropzone-previews .file-row .progress {
        height: 5px;
        border-radius: 0;
        box-shadow: unset;
        margin-top: 4px;
        margin-bottom: 0;
    }
</style>
<div class="row" id="dropzone-previews">
    <div id="dropzone-file-template" class="col-sm-4" style="">
        <div class="file-row" style="">
            <!-- This is used as the file preview template -->
            <div class="preview">
                <img class="img-responsive img-fluid" data-dz-thumbnail/>
            </div>
            <div class="dz-details">
                <div class="dz-filename"><span data-dz-name></span></div>
                <div class="dz-size" data-dz-size></div>
                <div class="error text-danger dz-error-message"><span data-dz-errormessage></span></div>
            </div>
            <div class="actions">
                <span class="btn btn-xs btn-primary start">
                    <i class="glyphicon glyphicon-upload"></i>
                    <span>Start</span>
                </span>
                <span data-dz-remove class="btn btn-xs btn-warning cancel">
                    <i class="glyphicon glyphicon-ban-circle"></i>
                    <span>Cancel</span>
                </span>
                <span data-dz-remove class="btn btn-xs btn-danger delete" style="display: none">
                    <i class="glyphicon glyphicon-trash"></i>
                    <span>Delete</span>
                </span>
            </div>
            <div class="progress progress-striped active dz-progress" role="progressbar" aria-valuemin="0"
                 aria-valuemax="100"
                 aria-valuenow="0">
                <div class="progress-bar progress-bar-success" style="width:0%;" data-dz-uploadprogress></div>
            </div>
        </div>
    </div>
</div>
