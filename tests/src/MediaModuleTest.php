<?php

namespace ByTIC\Modules\MediaLibrary\Tests;

use ByTIC\Modules\MediaLibrary\MediaModule;

/**
 * Class MediaModuleTest
 * @package ByTIC\Modules\MediaLibrary\Tests
 */
class MediaModuleTest extends AbstractTest
{
    public function testBasePath()
    {
        self::assertStringEndsWith('media-library-module', MediaModule::basePath());
    }
}
