<?php

namespace ByTIC\MediaLibraryModule\Application\Modules\AbstractModule\Controllers\Traits;

use ByTIC\MediaLibrary\FileAdder\FileAdderFactory;
use ByTIC\MediaLibrary\HasMedia\HasMediaTrait;
use ByTIC\MediaLibraryModule\Controllers\Traits\Async\Covers;
use ByTIC\MediaLibraryModule\Controllers\Traits\Async\Files;
use ByTIC\MediaLibraryModule\Controllers\Traits\Async\Gallery;
use ByTIC\MediaLibraryModule\Controllers\Traits\Async\Images;
use ByTIC\MediaLibraryModule\Controllers\Traits\Async\Logos;
use Nip\Http\Request;

/**
 * Class HasMediaAsyncTrait
 * @package ByTIC\MediaLibraryModule\Application\Modules\AbstractModule\Controllers\Traits
 *
 * @method HasMediaTrait getModelFromRequest
 * @method Request getRequest
 */
trait HasMediaAsyncTrait
{
    use Covers;
    use Files;
    use Gallery;
    use Images;
    use Logos;

    public function uploadGallery()
    {
        if (!$this->getRequest()->files->has('file')) {
            return $this->uploadGalleryImgPicker();
        }

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
