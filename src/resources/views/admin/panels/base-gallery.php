<?php
/** @var \ByTIC\MediaLibrary\HasMedia\HasMediaTrait|\Nip\Records\Record $item */

use ByTIC\MediaLibraryModule\MediaModule;

/** @var Nip\View $viewObj */
$uploadUrl = isset($uploadUrl) ? $uploadUrl : $viewObj->uploadURL;
$type = isset($type) ? $type : 'images';
$modalId = isset($modalId) ? $modalId : 'dropzone-modal-'.$type;
?>
<div class="medialibrary-panel">
    <div class="panel panel-inverse card card-inverse">
        <div class="panel-heading card-header">
            <h4 class="panel-title card-title">
                <?php echo translator()->trans($type.'.label.title.singular'); ?>
            </h4>
            <div class="panel-heading-btn card-header-btn">
                <button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#<?php echo $modalId; ?>">
                    <i class="fas fa-upload"></i>
                    <?php echo translator()->trans($type.'.label.title.upload'); ?>
                </button>
            </div>
        </div>
        <div class="panel-body card-body">
            <?php
            echo MediaModule::getAdminImagesGridForModel($item, $type);
            ?>
        </div>
    </div>

    <?php
    echo MediaModule::loadView(
        '/dropzone/modal',
        [
            'formAction' => $uploadUrl,
            'modalId' => $modalId,
            'type' => $type,
        ]
    );
    ?>
</div>
