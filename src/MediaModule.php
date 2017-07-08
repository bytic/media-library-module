<?php

namespace ByTIC\Modules\MediaLibrary;

use ByTIC\Modules\MediaLibrary\Application\Library\View\View;

/**
 * Class MediaModule
 * @package ByTIC\Modules\MediaLibrary
 */
class MediaModule
{

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
