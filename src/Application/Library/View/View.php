<?php

namespace ByTIC\Modules\MediaLibrary\Application\Library\View;

use ByTIC\Modules\MediaLibrary\MediaModule;
use Nip\Utility\Traits\SingletonTrait;

/**
 * Class View
 * @package ByTIC\Modules\MediaLibrary\Application\Library\View
 */
class View extends \Nip\View
{
    use SingletonTrait;

    /** @noinspection PhpMissingParentCallCommonInspection
     *
     * @return string
     */
    protected function generateBasePath()
    {
        return MediaModule::basePath()
            . DIRECTORY_SEPARATOR . 'src'
            . DIRECTORY_SEPARATOR . 'resources'
            . DIRECTORY_SEPARATOR . 'views';
    }
}
