
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
?>

<form action="<?php echo $formAction; ?>" method="post" class="dropzone-gallery" enctype="multipart/form-data"
      data-min_width="<?php echo $constraint->minWidth; ?>"
      data-min_height="<?php echo $constraint->minHeight; ?>"
      data-aspect_ratio="<?php echo $constraint->minWidth / $constraint->minHeight; ?>"
      data-accepted_files="<?php echo $mimeTypesString; ?>"
>
    <input type="hidden" name="media_type" value="<?php echo $type; ?>"/>

    <div id="<?php echo $modalId; ?>" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" style="display: inline-block">
                        <?php echo $modalTitle; ?>
                    </h4>
                    <button type="button" class="btn-close close" aria-label="Close"
                            data-dismiss="modal" data-bs-dismiss="modal"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-info">
                        Imaginile incarcate trebuie sa respecte urmatoarele conditii:
                        <ul>
                            <li>Extensii permise: <b>.jpg, .jpeg, .png</b></li>
                            <li>Dimensiune maxima per fisier: <b><?php echo max_upload(); ?></b></li>
                            <li>Rezolutie minima:
                                <b><?php echo $constraint->minWidth.'x'.$constraint->minHeight.'px'; ?></b>
                            </li>
                        </ul>
                    </div>
                    <div class="fallback"> <!-- this is the fallback if JS isn't working -->
                        <input name="file-fallback" type="file" multiple
                               accept="<?php echo $mimeTypesString; ?>"/>
                    </div>

                    <div class="alert alert-info" id="status">
                    </div>
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
                        <button type="button" class="btn btn-outline-secondary btn-default float-right float-end"
                                data-dismiss="modal" data-bs-dismiss="modal">
                            Done
                        </button>

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
