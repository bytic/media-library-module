<?php
declare(strict_types=1);

use ByTIC\MediaLibrary\Collections\Collection;
use ByTIC\MediaLibrary\HasMedia\HasMediaTrait;
use ByTIC\MediaLibrary\Media\Media;
use Nip\Records\Record;

$itemClass = $itemClass ?? 'col-md-4 col-sm-6';
$type = $type ?? 'images';

/** @var HasMediaTrait|Record $item */
/** @var Collection|Media[] $images */
?>
<div class="gallery" id="item-gallery">
    <div class="alert alert-info nomargin"<?php echo count($images) ? ' style="display: none;"' : ''; ?>>
        <?php echo translator()->trans($type . '.messages.dnx'); ?>
    </div>
    <div class="row">
        <?php if ($images) { ?>
            <?php foreach ($images as $image) { ?>
                <div class="<?php echo $itemClass; ?>">
                    <div class="gallery-item <?php echo $image->isDefault() ? 'default' : ''; ?>">
                        <div class="overlay" style="display: none;"></div>
                        <img src="<?php echo $image->getFullUrl(); ?>" class="img-responsive" alt=""/>
                        <div class="buttons inline">

                            <a href="javascript:" class="negative btn btn-danger btn-xs pull-right"
                               data-url="<?php echo $item->compileURL('AsyncRemoveMediaItem'); ?>"
                               data-type="<?php echo $type; ?>"
                               data-filename="<?php echo $image->getName(); ?>"
                            >
                                <i class=" glyphicon glyphicon-remove glyphicon-white fas fa-trash-alt"></i>
                            </a>

                            <a href="javascript:" class="set-default btn btn-primary btn-xs"
                               data-url="<?php echo $item->compileURL('AsyncSetDefaultMediaItem'); ?>"
                               data-type="<?php echo $type; ?>"
                               data-filename="<?php echo $image->getName(); ?>"
                            >
                                <?php echo translator()->trans('images.label.defaultBtn'); ?>
                                <i class="glyphicon glyphicon-ok-circle glyphicon-white far fa-check-circle"></i>
                            </a>
                        </div>
                    </div>
                </div>
            <?php } ?>
        <?php } ?>
    </div>
    <br class="clear"/>
</div>
