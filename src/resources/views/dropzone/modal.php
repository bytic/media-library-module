<?php
$formAction = isset($formAction) ? $formAction : '/file-upload-test';
$modalTitle = isset($modalTitle) ? $modalTitle : 'Media Gallery';
?>
<div id="dropzone-modal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title"><?php echo $modalTitle; ?></h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div id="actions" class="row">

                    <div class="col-lg-5">
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
                </div>

                <form action="<?php echo $formAction; ?>" class="dropzone-gallery" enctype="multipart/form-data">
                    <?php echo $this->load('/dropzone/template'); ?>
                </form>

            </div>
            <div class="modal-footer">
                <div class="w-100 dropzone-actions">
                    <button type="button" class="btn btn-default float-right" data-dismiss="modal">Done</button>

                    <!-- The fileinput-button span is used to style the file input field as button -->
                    <span class="btn btn-success fileinput-button">
                            <i class="fas fa-folder-open"></i>
                            <span>Add files</span>
                        </span>
                    <button type="submit" class="btn btn-primary start">
                        <i class="fas fa-upload"></i>
                        <span>Start upload</span>
                    </button>
                    <button type="reset" class="btn btn-warning cancel">
                        <i class="fas fa-window-close"></i>
                        <span>Cancel upload</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
