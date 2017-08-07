<?php

namespace ByTIC\MediaLibraryModule\Application\Modules\AbstractModule\Controllers\Traits;

use ByTIC\MediaLibrary\HasMedia\HasMediaTrait;
use Nip\Request;

/**
 * Class HasMediaAsyncTrait
 * @package ByTIC\MediaLibraryModule\Application\Modules\AbstractModule\Controllers\Traits
 *
 * @method HasMediaTrait getModelFromRequest
 * @method Request getRequest
 */
class HasMediaAsyncTrait
{

    public function setDefaultMediaItem()
    {
        $item = $this->getModelFromRequest();

        switch ($this->getRequest()->get('media_type')) {
            case 'images':
                $item->getImages()->persistDefaultMediaFromName(
                    $this->getRequest()->get('media_filename')
                );
                break;

        }
    }

    public function removeMediaItem()
    {
        $item = $this->getModelFromRequest();
    }
}
