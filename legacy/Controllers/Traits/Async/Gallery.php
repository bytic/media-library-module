<?php

namespace ByTIC\MediaLibraryModule\Controllers\Traits\Async;

use ByTIC\Common\Records\Record;
use ByTIC\MediaLibrary\HasMedia\HasMediaTrait;
use ImgPicker;
use Nip\Http\Request;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * Class Gallery
 * @package ByTIC\MediaLibraryModule\Controllers\Traits\Async
 *
 * @method Request getRequest()
 * @method HasMediaTrait|Record getModelFromRequest()
 */
trait Gallery
{
    public function uploadGallery()
    {
        $this->uploadGalleryImgPicker();
    }

    public function uploadGalleryImgPicker()
    {
        $item = $this->getModelFromRequest();
        $newMedia = $item->getMedia('images')->newMedia();
        $minWidth = $item->getMedia('images')->getConstraint()->minWidth;
        $minHeight = $item->getMedia('images')->getConstraint()->minHeight;

        $options = [

            // Upload directory path
            'upload_dir' => TMP_PATH,

            // Upload directory url:
            'upload_url' => TMP_URL,

            // Accepted file types:
            'accept_file_types' => 'png|jpg|jpeg|gif',

            // Directory mode:
            'mkdir_mode' => 0777,

            // File size restrictions (in bytes):
            'max_file_size' => UploadedFile::getMaxFilesize(),
            'min_file_size' => 1,

            // Image resolution restrictions (in px):
            'max_width' => null,
            'max_height' => null,
            'min_width' => $minWidth,
            'min_height' => $minHeight,

            /**
             *    Load callback
             *
             * @param    ImgPicker $instance
             * @return string|array
             */
            'load' => function ($instance) {
                //return 'avatar.jpg';
            },

            /**
             *    Delete callback
             *
             * @param  string $filename
             * @param    ImgPicker $instance
             * @return boolean
             */
            'delete' => function ($filename, $instance) {
                return true;
            },

            /**
             *    Upload start callback
             *
             * @param    stdClass $image
             * @param    ImgPicker $instance
             * @return void
             */
            'upload_start' => function ($image, $instance) {
                $image->name = '~toCropFP' . $item->ID . '-' . rand(1000, 4000) . '.' . $image->type;
            },

            /**
             *    Upload complete callback
             *
             * @param    stdClass $image
             * @param    ImgPicker $instance
             * @return void
             */
            'upload_complete' => function ($image, $instance) {
            },

            /**
             *    Crop start callback
             *
             * @param    stdClass $image
             * @param    ImgPicker $instance
             * @return void
             */
            'crop_start' => function ($image, $instance) {
                $image->name = sha1(microtime()) . '.' . $image->type;
            },

            /**
             *    Crop complete callback
             *
             * @param    stdClass $image
             * @param    ImgPicker $instance
             * @return void
             */
            'crop_complete' => function ($image, $instance) {
                foreach (['full', 'default'] as $version) {
                    $filename = $instance->getVersionFilename($image->name, $version);
                    $filepath = $instance->getUploadPath($filename, $version);
                    rename($filepath, str_replace('-' . $version . '.', '.', $filepath));
                }
            },
        ];
        if (@$_POST['action'] == 'crop') {
            $filesystem = $item->getMedia('images')->getFilesystem();
            $rootPath = $filesystem->getAdapter()->getPathPrefix();
            // Image versions:
            $options['versions'] = [
                'full' => [
                    'upload_dir' => $rootPath . $newMedia->getBasePath('full') . DIRECTORY_SEPARATOR,
                    'upload_url' => $filesystem->getUrl($newMedia->getBasePath('full')),
                    'max_width' => 1600,
                    'max_height' => 1600,
                ],
                'default' => [
                    'upload_dir' => $rootPath . $newMedia->getBasePath('default') . DIRECTORY_SEPARATOR,
                    'upload_url' => $filesystem->getUrl($newMedia->getBasePath('default')),
                    'max_width' => $minWidth,
                    'crop' => $minHeight,
                ],
            ];
        }

        if (intval($_SERVER['CONTENT_LENGTH']) > 0 && count($_POST) === 0) {
            $maxSize = round(($this->getRequest()->server->getMaxFileSize() / 1048576), 2) . 'MB';
            $this->response['error'] = 'File to big. Max size [' . $maxSize . ']';

            return $this->_output();
        }

        // Create new ImgPicker instance
        new ImgPicker($options);
        die('');
    }
}
