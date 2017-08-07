<?php
/** @var \ByTIC\MediaLibrary\HasMedia\HasMediaTrait|\Nip\Records\Record $item */
/** @var Nip\View $viewObj */
$uploadUrl = isset($uploadUrl) ? $uploadUrl : $viewObj->uploadURL;
?>
<div class="panel panel-inverse">
    <div class="panel-heading">
        <div class="panel-heading-btn">
            <button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#dropzone-modal">
                <img src="<?php echo asset("/images/ico/picture.png"); ?>" alt=""/>
                <?php echo translator()->translate('photos.label.title.upload'); ?>
            </button>
        </div>
        <h4 class="panel-title">
            <?php echo translator()->translate('photos.label.title.singular'); ?>
        </h4>
    </div>
    <div class="panel-body">
        <?php
        echo \ByTIC\MediaLibraryModule\MediaModule::getAdminImagesGridForModel($item);
        ?>
    </div>
</div>


<?php
echo \ByTIC\MediaLibraryModule\MediaModule::loadView(
    '/dropzone/modal',
    ['formAction' => $uploadUrl]
);

$viewObj->Scripts()->addRaw(\ByTIC\MediaLibraryModule\MediaModule::loadAssetContent('/js/init-dropzone.js'));
$viewObj->Scripts()->addRaw(\ByTIC\MediaLibraryModule\MediaModule::loadAssetContent('/js/media-manage.js'));
?>
<script type="text/javascript">
    MediaLibrary.defaultMediaURL = '<?php echo $item->compileURL('AsyncSetDefaultMedia'); ?>';
    MediaLibrary.removeMediaURL = '<?php echo $item->compileURL('AsyncRemoveMedia'); ?>';
</script>
