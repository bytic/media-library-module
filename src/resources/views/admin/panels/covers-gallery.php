<?php
/** @var \ByTIC\MediaLibrary\HasMedia\HasMediaTrait|\Nip\Records\Record $item */

use ByTIC\Assets\Assets;
use ByTIC\MediaLibraryModule\MediaModule;

/** @var Nip\View $viewObj */
$uploadUrl = isset($uploadUrl) ? $uploadUrl : $viewObj->uploadURL;
?>
<div class="medialibrary-panel">
    <div class="panel panel-inverse card card-inverse">
        <div class="panel-heading card-header">
            <div class="panel-heading-btn">
                <button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#dropzone-modal">
                    <i class="fas fa-upload"></i>
                    <?php echo translator()->trans('photos.label.title.upload'); ?>
                </button>
            </div>
            <h4 class="panel-title">
                <?php echo translator()->trans('photos.label.title.singular'); ?>
            </h4>
        </div>
        <div class="panel-body">
            <?php
            echo MediaModule::getAdminImagesGridForModel($item);
            ?>
        </div>
    </div>

    <?php
    echo MediaModule::loadView(
        '/dropzone/modal',
        ['formAction' => $uploadUrl]
    );
    ?>
</div>

<?php
$assetEntry = Assets::entry();
if (assets_manager()->hasEntrypoint('media-library')) {
    return;
}

$viewObj->Scripts()->addRaw(MediaModule::loadAssetContent('/js/init-dropzone.js'));
$viewObj->Scripts()->addRaw(MediaModule::loadAssetContent('/js/media-manage.js'));
$viewObj->StyleSheets()->addRaw(MediaModule::loadAssetContent('/css/gallery.css'));
