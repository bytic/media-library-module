<?php
declare(strict_types=1);

/** @var HasMediaTrait|Record $item */

use ByTIC\MediaLibrary\HasMedia\HasMediaTrait;
use ByTIC\MediaLibraryModule\MediaModule;
use Nip\Records\Record;

/** @var Nip\View $viewObj */
$uploadUrl = $uploadUrl ?? $viewObj->uploadURL;
$type = $type ?? 'images';
$modalId = $modalId ?? 'dropzone-modal-' . $type;
$constraint = $item->getMediaRepository()->getCollection($type)->getConstraint();
?>
<div class="medialibrary-panel">
    <div class="panel card">
        <div class="panel-heading card-header">
            <h4 class="panel-title card-title">
                <?php echo translator()->trans($type . '.label.title.singular'); ?>
            </h4>
            <div class="panel-heading-btn card-header-btn">
                <button type="button" class="btn btn-info btn-xs"
                        data-toggle="modal" data-target="#<?php echo $modalId; ?>"
                        data-bs-toggle="modal" data-bs-target="#<?php echo $modalId; ?>"
                >
                    <i class="fas fa-upload"></i>
                    <?php echo translator()->trans($type . '.label.title.upload'); ?>
                </button>
            </div>
        </div>
        <div class="panel-body card-body">
            <?= MediaModule::getAdminImagesGridForModel($item, $type); ?>
        </div>
    </div>

    <?php
    echo MediaModule::loadView(
        '/dropzone/modal',
        [
            'formAction' => $uploadUrl,
            'modalId' => $modalId,
            'type' => $type,
            'constraint' => $constraint,
        ]
    );
    ?>
</div>
