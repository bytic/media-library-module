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
trait HasMediaAsyncTrait
{

    public function uploadGallery()
    {
        /** @var HasMediaTrait $item */
        $item = $this->getModelFromRequest();

        /** @var \ByTIC\MediaLibrary\Validation\Constraints\ImageConstraint $constraint */
//        $constraint = $item->getMediaRepository()->getCollection('images')->getConstraint();
        $adder = FileAdderFactory::create($item, $this->getRequest()->files->get('file'));
        $adder->toMediaCollection('images');
        die();
    }

    public function setDefaultMediaItem()
    {
        $item = $this->getModelFromRequest();

        switch ($this->getRequest()->get('media_type')) {
            case 'images':
                $item->getImages()->persistDefaultMediaFromName(
                    $this->getRequest()->get('media_filename')
                );
                return $this->sendSuccess("Imaginea a fost stabilita ca principala");
                break;

        }
        return $this->sendError("Imaginea nu a putut fi stabilita ca principala");
    }

    public function removeMediaItem()
    {
        $item = $this->getModelFromRequest();
    }
}
