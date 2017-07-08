<!-- HTML heavily inspired by http://blueimp.github.io/jQuery-File-Upload/ -->
<style>
    #dropzone-previews .file-row {
        border-top: 1px solid #ddd;
        padding: 8px 8px 0px;
    }

    #dropzone-previews .file-row:nth-child(odd) {
        background: #f9f9f9;
    }

    #dropzone-previews .file-row .progress {
        height: 5px;
        border-radius: 0;
        box-shadow: unset;
        margin-top: 4px;
        margin-bottom: 0;
    }
</style>
<div class="table table-striped" id="dropzone-previews">
    <div id="dropzone-file-template" class="file-row" style="">
        <div class="row">
            <!-- This is used as the file preview template -->
            <div class="col-sm-4">
                <span class="preview"><img data-dz-thumbnail/></span>
            </div>
            <div class="col-sm-4">
                <p class="name" data-dz-name></p>
                <strong class="error text-danger" data-dz-errormessage></strong>
                <p class="size" data-dz-size></p>
            </div>
            <div class="col-sm-4">
                <button class="btn btn-sm btn-primary start">
                    <i class="glyphicon glyphicon-upload"></i>
                    <span>Start</span>
                </button>
                <button data-dz-remove class="btn btn-sm btn-warning cancel">
                    <i class="glyphicon glyphicon-ban-circle"></i>
                    <span>Cancel</span>
                </button>
                <button data-dz-remove class="btn btn-sm btn-danger delete">
                    <i class="glyphicon glyphicon-trash"></i>
                    <span>Delete</span>
                </button>
            </div>
        </div>
        <div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100"
             aria-valuenow="0">
            <div class="progress-bar progress-bar-success" style="width:0%;" data-dz-uploadprogress></div>
        </div>
    </div>

</div>