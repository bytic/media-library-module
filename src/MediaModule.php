<?php

namespace ByTIC\Modules\MediaLibrary;

use ByTIC\MediaLibrary\HasMedia\HasMediaTrait;
use ByTIC\Modules\MediaLibrary\Application\Library\View\View;

/**
 * Class MediaModule
 * @package ByTIC\Modules\MediaLibrary
 */
class MediaModule
{

    /**
     * @param HasMediaTrait $item
     */
    public function getImagesGridForModel($item)
    {
        $images = $item->getImages();
        return self::loadView('/admin/gallery/images-grid.php');
    }

    /**
     * @param $path
     * @param array $variables
     * @return null|string
     */
    public static function loadView($path, $variables = [])
    {
        return View::instance()->load($path, $variables, true);
    }
}
