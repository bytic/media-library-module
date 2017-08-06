<?php

namespace ByTIC\MediaLibraryModule\Application\Library\View;

use ByTIC\MediaLibraryModule\MediaModule;
use Nip\Utility\Traits\SingletonTrait;

/**
 * Class View
 * @package ByTIC\MediaLibraryModule\Application\Library\View
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
