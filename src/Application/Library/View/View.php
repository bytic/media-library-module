<?php

namespace ByTIC\Modules\MediaLibrary\Application\Library\View;

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
        return dirname(dirname(dirname(__DIR__)))
            . DIRECTORY_SEPARATOR . 'resources'
            . DIRECTORY_SEPARATOR . 'views';
    }
}
