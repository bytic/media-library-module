<div id="dropzone-modal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div class="modal-title">
                    <h4>Modal title</h4>
                </div>
            </div>
            <div class="modal-body">
                <div id="actions" class="row">
                    <div class="col-md-7">
                        <!-- The fileinput-button span is used to style the file input field as button -->
                        <span class="btn btn-success fileinput-button">
                            <i class="glyphicon glyphicon-plus"></i>
                            <span>Add files...</span>
                        </span>
                        <button type="submit" class="btn btn-primary start">
                            <i class="glyphicon glyphicon-upload"></i>
                            <span>Start upload</span>
                        </button>
                        <button type="reset" class="btn btn-warning cancel">
                            <i class="glyphicon glyphicon-ban-circle"></i>
                            <span>Cancel upload</span>
                        </button>
                    </div>

                    <div class="col-md-5">
                        <!-- The global file processing state -->
                        <span class="fileupload-process">
                            <div id="total-progress" class="progress progress-striped active" role="progressbar"
                                 aria-valuemin="0"
                                 aria-valuemax="100" aria-valuenow="0">
                                <div class="progress-bar progress-bar-success" style="width:0%;"
                                     data-dz-uploadprogress></div>
                            </div>
                        </span>
                    </div>

                    <?php echo $this->load('/dropzone/template'); ?>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Done</button>
            </div>
        </div>
    </div>
</div>
