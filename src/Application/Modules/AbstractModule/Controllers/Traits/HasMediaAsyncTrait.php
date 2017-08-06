<?php

namespace ByTIC\MediaLibraryModule\Application\Modules\AbstractModule\Controllers\Traits;

/**
 * Class HasMediaAsyncTrait
 * @package ByTIC\MediaLibraryModule\Application\Modules\AbstractModule\Controllers\Traits
 */
class HasMediaAsyncTrait
{

    public function setDefaultMediaItem()
    {
        $item = $this->getModelFromRequest();
    }

    public function removeMediaItem()
    {
        $item = $this->getModelFromRequest();
    }
}
