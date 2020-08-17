<?php

namespace ByTIC\MediaLibraryModule\Application\Modules\AbstractModule\Controllers\Traits;

use ByTIC\MediaLibrary\Exceptions\FileCannotBeAdded;
use ByTIC\MediaLibrary\Exceptions\FileCannotBeAdded\FileUnacceptableForCollection;
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
        if (!$this->getRequest()->files->has('file') || $this->getRequest()->request->has('action')) {
            $this->uploadGalleryImgPicker();

            return;
        }

        /** @var HasMediaTrait $item */
        $item = $this->getModelFromRequest();
        $mediaType = $this->getRequest()->get('media_type', 'images');

        /** @var \ByTIC\MediaLibrary\Validation\Constraints\ImageConstraint $constraint */
//        $constraint = $item->getMediaRepository()->getCollection('images')->getConstraint();

        try {

            $adder = FileAdderFactory::create($item, $this->getRequest()->files->get('file'));

            if ($this->getRequest()->request->has('cropper'))
            {
                parse_str($this->getRequest()->request->get('cropper'), $copperData);
                $adder->getMedia()->cropperData = $copperData;
            }
            $adder->toMediaCollection($mediaType);
        } catch (FileCannotBeAdded $exception) {
            http_response_code(415);
            header('Content-Type: application/json; charset=utf-8');
            $output = ['error' => $exception->getMessage()];
            if ($exception instanceof FileUnacceptableForCollection) {
                $output['error'] .= ': '. $exception->violations->getMessageString();
            }
            echo json_encode($output);
        }
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
                $this->sendSuccess("Imaginea a fost stabilita ca principala");
                break;

            case 'covers':
                $item->getCovers()->persistDefaultMediaFromName(
                    $this->getRequest()->get('media_filename')
                );
                $this->sendSuccess("Imaginea a fost stabilita ca principala");
                break;

            default:
                $this->sendError("Imaginea nu a putut fi stabilita ca principala");
        }
    }

    public function removeMediaItem()
    {
        $item = $this->getModelFromRequest();

        switch ($this->getRequest()->get('media_type')) {
            case 'images':
                $item->getImages()->deleteMediaByKey(
                    $this->getRequest()->get('media_filename')
                );

                $this->sendSuccess("Imaginea a fost stearsa");
                break;

            case 'covers':
                $item->getCovers()->deleteMediaByKey(
                    $this->getRequest()->get('media_filename')
                );

                $this->sendSuccess("Imaginea a fost stearsa");
                break;
            default:
                $this->sendError("Imaginea nu a putut fi stearsa");
        }
    }
}
