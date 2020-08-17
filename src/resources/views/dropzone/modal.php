<?php
$formAction = isset($formAction) ? $formAction : '/file-upload-test';
$type = isset($type) ? $type : 'images';
$modalTitle = isset($modalTitle) ? $modalTitle : 'Media Gallery';
$modalId = isset($modalId) ? $modalId : 'dropzone-modal';
?>

<form action="<?php echo $formAction; ?>" method="post" class="dropzone-gallery" enctype="multipart/form-data">
    <input type="hidden" name="media_type" value="<?php echo $type; ?>" />

    <div id="<?php echo $modalId; ?>" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title"><?php echo $modalTitle; ?></h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- The global file processing state -->
                    <div class="total-progress">
                        <div class="progress">
                            <div class="progress-bar bg-info progress-bar-success" role="progressbar"
                                 aria-valuemin="0"
                                 aria-valuemax="100" aria-valuenow="0"
                                 data-dz-uploadprogress></div>
                        </div>
                    </div>
                    <?php echo $this->load('/dropzone/template'); ?>
                </div>
                <div class="modal-footer">
                    <div class="w-100 dropzone-actions">
                        <button type="button" class="btn btn-default float-right" data-dismiss="modal">Done</button>

                        <!-- The fileinput-button span is used to style the file input field as button -->
                        <span class="btn btn-success fileinput-button">
                            <i class="fas fa-folder-open"></i>
                            <span>Add files</span>
                        </span>
                        <a href="javascript:" class="btn btn-primary start">
                            <i class="fas fa-upload"></i>
                            <span>Start upload</span>
                        </a>
                        <a href="javascript:" class="btn btn-warning cancel">
                            <i class="fas fa-window-close"></i>
                            <span>Cancel upload</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>
