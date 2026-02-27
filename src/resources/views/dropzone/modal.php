<?php

use ByTIC\MediaLibrary\Validation\Constraints\ImageConstraint;

$formAction = isset($formAction) ? $formAction : '/file-upload-test';
$type = isset($type) ? $type : 'images';
$modalTitle = isset($modalTitle) ? $modalTitle : 'Media Gallery';
$modalId = isset($modalId) ? $modalId : 'dropzone-modal';

/** @var ImageConstraint $constraint */
$constraint = isset($constraint) && $constraint instanceof ImageConstraint ? $constraint : false;
$mimeTypes = (array)$constraint->mimeTypes;
$mimeTypesString = implode(',', $mimeTypes);

$extensions = array_map(function($mime) {
    $parts = explode('/', $mime);
    return '.' . end($parts);
}, $mimeTypes);
$extensionsString = implode(', ', $extensions);
?>

<form action="<?php echo $formAction; ?>" method="post" class="dropzone-gallery" enctype="multipart/form-data"
      data-min_width="<?php echo $constraint->minWidth; ?>"
      data-min_height="<?php echo $constraint->minHeight; ?>"
      data-aspect_ratio="<?php echo $constraint->minWidth / $constraint->minHeight; ?>"
      data-accepted_files="<?php echo $mimeTypesString; ?>"
>
    <input type="hidden" name="media_type" value="<?php echo $type; ?>"/>

    <div id="<?php echo $modalId; ?>" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="<?php echo $modalId; ?>-label" aria-modal="true">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content border-0 shadow">
                <div class="modal-header border-bottom-0 pb-0">
                    <h5 class="modal-title fw-semibold" id="<?php echo $modalId; ?>-label">
                        <i class="fas fa-cloud-upload-alt me-2 text-primary"></i>
                        <?php echo $modalTitle; ?>
                    </h5>
                    <button type="button" class="btn-close" aria-label="Close"
                            data-dismiss="modal" data-bs-dismiss="modal"
                    ></button>
                </div>
                <div class="modal-body pt-2">
                    <div class="alert alert-light border d-flex gap-2 align-items-start mb-3 py-2">
                        <i class="fas fa-info-circle text-info mt-1 flex-shrink-0"></i>
                        <div class="small">
                            <strong>Requirements:</strong>
                            <ul class="mb-0 mt-1 ps-3">
                                <li>Allowed types: <strong><?php echo $extensionsString ?: '.jpg, .jpeg, .png'; ?></strong></li>
                                <li>Max file size: <strong><?php echo max_upload(); ?></strong></li>
                                <li>Min resolution: <strong><?php echo $constraint->minWidth . '×' . $constraint->minHeight . 'px'; ?></strong></li>
                            </ul>
                        </div>
                    </div>

                    <noscript>
                        <div class="fallback mb-3">
                            <input name="file-fallback" type="file" multiple
                                   accept="<?php echo $mimeTypesString; ?>" class="form-control"/>
                        </div>
                    </noscript>

                    <!-- Total upload progress -->
                    <div class="total-progress mb-3" style="opacity: 0; transition: opacity 0.3s;">
                        <div class="d-flex justify-content-between small text-muted mb-1">
                            <span>Uploading...</span>
                            <span class="upload-percent">0%</span>
                        </div>
                        <div class="progress" style="height: 6px;">
                            <div class="progress-bar bg-primary progress-bar-striped progress-bar-animated"
                                 role="progressbar"
                                 aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"
                                 data-dz-uploadprogress
                                 style="width: 0%;"></div>
                        </div>
                    </div>

                    <?php echo $this->load('/dropzone/template'); ?>
                </div>
                <div class="modal-footer border-top-0 pt-0 flex-wrap gap-2">
                    <!-- Left: upload controls -->
                    <div class="dropzone-actions d-flex flex-wrap gap-2 align-items-center me-auto">
                        <span class="btn btn-outline-secondary fileinput-button">
                            <i class="fas fa-folder-open me-1"></i>
                            <span>Browse files</span>
                        </span>
                        <a href="javascript:void(0)" class="btn btn-success start" style="opacity: 0; transition: opacity 0.2s;" disabled>
                            <i class="fas fa-upload me-1"></i>
                            <span>Upload all</span>
                        </a>
                        <a href="javascript:void(0)" class="btn btn-outline-danger cancel" style="opacity: 0; transition: opacity 0.2s;" disabled>
                            <i class="fas fa-times me-1"></i>
                            <span>Cancel</span>
                        </a>
                    </div>
                    <!-- Right: close -->
                    <button type="button" class="btn btn-secondary"
                            data-dismiss="modal" data-bs-dismiss="modal">
                        <i class="fas fa-check me-1"></i>
                        Done
                    </button>
                </div>
            </div>
        </div>
    </div>
</form>
