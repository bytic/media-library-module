<?php

use ByTIC\MediaLibrary\Collections\Collection;
use ByTIC\MediaLibrary\Media\Media;

$itemClass = isset($itemClass) ? $itemClass : 'col-md-4 col-sm-6';
/** @var \ByTIC\MediaLibrary\HasMedia\HasMediaTrait|\Nip\Records\Record $item */
/** @var Collection|Media[] $images */
?>
<div class="gallery row" id="item-gallery">
    <div class="alert alert-info nomargin"<?php echo count($images) ? ' style="display: none;"' : ''; ?>>
        <?php echo translator()->translate('photos.messages.dnx'); ?>
    </div>
    <?php if ($images) { ?>
        <?php foreach ($images as $image) { ?>
            <div class="<?php echo $itemClass; ?>">
                <div class="gallery-item<?php echo $image->isDefault() ? ' default' : ''; ?>">
                    <div class="overlay" style="display: none;"></div>
                    <img src="<?php echo $image->getFullUrl(); ?>" alt=""/>
                    <div class="buttons inline">

                        <a href="javascript:" class="negative right btn btn-danger btn-xs"
                           data-url="<?php echo $item->compileURL('AsyncRemoveMedia'); ?>"
                           data-filename="<?php echo $image->getName(); ?>">
                            <span class="glyphicon glyphicon-remove glyphicon-white"></span>
                        </a>

                        <a href="javascript:" class="left set-default btn btn-primary btn-xs"
                           data-url="<?php echo $item->compileURL('AsyncSetDefaultMedia'); ?>"
                           data-filename="<?php echo $image->getName(); ?>">
                            <span class="glyphicon glyphicon-ok-circle glyphicon-white"></span>
                        </a>
                    </div>
                </div>
            </div>
        <?php } ?>
    <?php } ?>
    <br class="clear"/>
</div>
