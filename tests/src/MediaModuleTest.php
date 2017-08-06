<?php

namespace ByTIC\MediaLibraryModule\Tests;

use ByTIC\MediaLibraryModule\MediaModule;

/**
 * Class MediaModuleTest
 * @package ByTIC\MediaLibraryModule\Tests
 */
class MediaModuleTest extends AbstractTest
{
    public function testBasePath()
    {
        self::assertStringEndsWith('media-library-module', MediaModule::basePath());
    }
}
