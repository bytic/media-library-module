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
    <div class="card shadow-sm">
        <div class="card-header d-flex align-items-center justify-content-between py-2">
            <h5 class="card-title mb-0 fw-semibold">
                <i class="fas fa-images me-2 text-muted"></i>
                <?php echo translator()->trans($type . '.label.title.singular'); ?>
            </h5>
            <button type="button"
                    class="btn btn-primary btn-sm"
                    data-toggle="modal" data-target="#<?php echo $modalId; ?>"
                    data-bs-toggle="modal" data-bs-target="#<?php echo $modalId; ?>"
            >
                <i class="fas fa-upload me-1"></i>
                <?php echo translator()->trans($type . '.label.title.upload'); ?>
            </button>
        </div>
        <div class="card-body">
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
