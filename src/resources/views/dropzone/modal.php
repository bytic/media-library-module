<?php

use ByTIC\MediaLibrary\Validation\Constraints\ImageConstraint;
use Symfony\Component\HttpFoundation\File\UploadedFile;

$escape = static function ($value) {
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
};
$formAction = $formAction ?? '/file-upload-test';
$type = $type ?? 'images';
$modalTitle = $modalTitle ?? 'Media Gallery';
$modalId = $modalId ?? 'dropzone-modal';
$constraint = ($constraint ?? null) instanceof ImageConstraint ? $constraint : null;
$minWidth = max(0, (int) ($constraint->minWidth ?? 0));
$minHeight = max(0, (int) ($constraint->minHeight ?? 0));
$mimeTypes = implode(',', (array) ($constraint->mimeTypes ?? []));
$maxBytes = UploadedFile::getMaxFilesize();
$maxSize = function_exists('max_upload') ? max_upload() : round($maxBytes / 1048576, 1) . ' MB';
?>

<form action="<?= $escape($formAction) ?>" method="post" class="dropzone-gallery" enctype="multipart/form-data"
      data-min_width="<?= $minWidth ?>" data-min_height="<?= $minHeight ?>"
      data-aspect_ratio="<?= $minWidth && $minHeight ? $escape($minWidth / $minHeight) : '' ?>"
      data-accepted_files="<?= $escape($mimeTypes) ?>" data-max_bytes="<?= $escape($maxBytes) ?>">
    <input type="hidden" name="media_type" value="<?= $escape($type) ?>"/>

    <div id="<?= $escape($modalId) ?>" class="modal fade" tabindex="-1" role="dialog"
         aria-labelledby="<?= $escape($modalId) ?>-label">
        <div class="modal-dialog modal-fullscreen" role="document">
            <div class="modal-content ml-upload-shell">
                <div class="modal-header ml-upload-header">
                    <div>
                        <span class="ml-eyebrow"><?= $escape($modalTitle) ?></span>
                        <h2 class="modal-title" id="<?= $escape($modalId) ?>-label">Upload images</h2>
                        <p>Add images, then review each crop before uploading.</p>
                    </div>
                    <button type="button" class="ml-button ml-close" aria-label="Close"
                            data-dismiss="modal" data-bs-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body ml-upload-body">
                    <button type="button" class="dz-upload-area fileinput-button"
                            aria-describedby="<?= $escape($modalId) ?>-requirements">
                        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4"/>
                        </svg>
                        <strong>Drag images here</strong>
                        <span>or <span class="ml-browse">browse files</span> to select images</span>
                    </button>
                    <p class="ml-upload-requirements" id="<?= $escape($modalId) ?>-requirements">
                        <?= $escape($mimeTypes ? str_replace(',', ', ', $mimeTypes) : 'Images') ?>
                        &middot; Up to <?= $escape($maxSize) ?> per file
                        <?php if ($minWidth || $minHeight) { ?>
                            &middot; Minimum <?= $minWidth ?> &times; <?= $minHeight ?> px
                        <?php } ?>
                    </p>
                    <noscript>
                        <label>Choose an image <input name="file" type="file" accept="<?= $escape($mimeTypes ?: 'image/*') ?>"/></label>
                        <button type="submit">Upload image</button>
                    </noscript>
                    <div class="ml-upload-status" role="status">No images selected.</div>
                    <div class="total-progress" hidden>
                        <div class="ml-progress-label"><span>Upload progress</span><span class="upload-percent">0%</span></div>
                        <div class="ml-progress">
                            <div class="progress-bar" role="progressbar" aria-label="Upload progress"
                                 aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>
                        </div>
                    </div>
                    <?= $this->load('/dropzone/template') ?>
                </div>
                <div class="modal-footer ml-upload-footer">
                    <div class="dropzone-actions">
                        <button type="button" class="ml-button ml-button-primary start" disabled>Crop &amp; upload all</button>
                        <button type="button" class="ml-button cancel" disabled>Clear queue</button>
                    </div>
                    <button type="button" class="ml-button ml-done" data-dismiss="modal" data-bs-dismiss="modal">Done</button>
                </div>
            </div>
        </div>
    </div>
</form>
