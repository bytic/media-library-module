<?php

namespace ByTIC\MediaLibraryModule;

use ByTIC\Assets\Assets;
use ByTIC\MediaLibrary\HasMedia\HasMediaTrait;
use ByTIC\MediaLibraryModule\Application\Library\View\View;

/**
 * Class MediaModule
 * @package ByTIC\MediaLibraryModule
 */
class MediaModule
{
    public static function initAssets()
    {
        $assetEntry = Assets::entry();
        if (assets_manager()->hasEntrypoint('media-library')) {
            $assetEntry->addFromWebpack('media-library');

            return;
        }

        Assets::entry()->scripts()->addRaw(self::loadAssetContent('/js/_dropzone.min.js'));
        Assets::entry()->scripts()->addRaw(self::loadAssetContent('/js/_cropper.min.js'));
        Assets::entry()->scripts()->addRaw(self::loadAssetContent('/js/_init-cropper.js'));
        Assets::entry()->scripts()->addRaw(self::loadAssetContent('/js/_init-dropzone.js'));
        Assets::entry()->scripts()->addRaw(self::loadAssetContent('/js/_media-manage.js'));

        Assets::entry()->styles()->addRaw(self::loadAssetContent('/css/dropzone.min.css'));
        Assets::entry()->styles()->addRaw(self::loadAssetContent('/css/cropper.min.css'));
        Assets::entry()->styles()->addRaw(self::loadAssetContent('/css/gallery.css'));
    }

    /**
     * @param $path
     *
     * @return null|string
     */
    public static function loadAssetContent($path)
    {
        $fullPath = self::basePath()
                    . DIRECTORY_SEPARATOR . 'resources'
                    . DIRECTORY_SEPARATOR . 'assets'
                    . $path;
        if (file_exists($fullPath)) {
            return file_get_contents($fullPath);
        }

        return '';
    }

    /**
     * @return string
     */
    public static function basePath()
    {
        return dirname(__DIR__);
    }

    /**
     * @param HasMediaTrait $item
     *
     * @return null|string
     */
    public static function getAdminImagesGridForModel($item, $type = 'images')
    {
        $images = $item->getMedia($type);

        return self::loadView(
            '/admin/gallery/' . $type . '-grid',
            ['item' => $item, 'images' => $images]
        );
    }

    /**
     * @param HasMediaTrait $item
     *
     * @return null|string
     */
    public static function getAdminPanelForModel($item, $view, $type = 'images')
    {
        $images = $item->getMedia($type);

        return self::loadView(
            '/admin/panels/' . $type . '-gallery',
            [
                'item' => $item,
                'viewObj' => $view,
                'images' => $images,
            ]
        );
    }

    /**
     * @param $path
     * @param array $variables
     *
     * @return null|string
     */
    public static function loadView($path, $variables = [])
    {
        return View::instance()->load($path, $variables, true);
    }
}
