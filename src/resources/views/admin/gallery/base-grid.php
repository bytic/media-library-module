<?php
declare(strict_types=1);

use ByTIC\MediaLibrary\Collections\Collection;
use ByTIC\MediaLibrary\HasMedia\HasMediaTrait;
use ByTIC\MediaLibrary\Media\Media;
use Nip\Records\Record;

$itemClass = $itemClass ?? 'col-md-3 col-sm-4 col-6';
$type = $type ?? 'images';

/** @var HasMediaTrait|Record $item */
/** @var Collection|Media[] $images */
?>
<div class="gallery" id="item-gallery">
    <?php if (!$images || count($images) === 0): ?>
        <div class="alert alert-info d-flex align-items-center gap-2 mb-0">
            <i class="fas fa-images opacity-75"></i>
            <span><?php echo translator()->trans($type . '.messages.dnx'); ?></span>
        </div>
    <?php else: ?>
        <div class="row g-3">
            <?php foreach ($images as $image): ?>
                <div class="<?php echo $itemClass; ?>">
                    <div class="gallery-item <?php echo $image->isDefault() ? 'default' : ''; ?>">
                        <div class="overlay" style="display: none;"></div>
                        <?php if ($image->isDefault()): ?>
                            <span class="default-badge">
                                <i class="fas fa-star me-1"></i><?php echo translator()->trans('images.label.default'); ?>
                            </span>
                        <?php endif; ?>
                        <img src="<?php echo $image->getFullUrl(); ?>"
                             class="img-fluid"
                             alt="<?php echo htmlspecialchars($image->getName()); ?>"
                             loading="lazy"/>
                        <div class="buttons">
                            <a href="javascript:void(0)" class="negative btn btn-danger btn-sm"
                               data-url="<?php echo $item->compileURL('AsyncRemoveMediaItem'); ?>"
                               data-type="<?php echo $type; ?>"
                               data-filename="<?php echo htmlspecialchars($image->getName()); ?>"
                               title="<?php echo translator()->trans('images.label.delete'); ?>"
                            >
                                <i class="fas fa-trash-alt"></i>
                            </a>

                            <a href="javascript:void(0)" class="is-default btn btn-success btn-sm disabled"
                               aria-disabled="true"
                               title="<?php echo translator()->trans('images.label.isDefault'); ?>"
                            >
                                <i class="fas fa-check-circle"></i>
                                <span class="d-none d-lg-inline"><?php echo translator()->trans('images.label.isDefault'); ?></span>
                            </a>

                            <a href="javascript:void(0)" class="set-default btn btn-outline-primary btn-sm"
                               data-url="<?php echo $item->compileURL('AsyncSetDefaultMediaItem'); ?>"
                               data-type="<?php echo $type; ?>"
                               data-filename="<?php echo htmlspecialchars($image->getName()); ?>"
                               title="<?php echo translator()->trans('images.label.defaultBtn'); ?>"
                            >
                                <i class="far fa-circle"></i>
                                <span class="d-none d-lg-inline"><?php echo translator()->trans('images.label.defaultBtn'); ?></span>
                            </a>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>
