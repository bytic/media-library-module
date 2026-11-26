<?php

namespace ByTIC\MediaLibraryModule\Tests;

use ByTIC\MediaLibraryModule\Application\Modules\AbstractModule\Controllers\Traits\HasMediaAsyncTrait;
use Symfony\Component\HttpFoundation\Request;

class MediaRequestTest extends AbstractTest
{
    public function testMediaRequestValuePreservesRequestGetPrecedence()
    {
        $controller = new MediaRequestController();
        $controller->request = Request::create('/?media_type=query', 'POST', [
            'media_type' => 'body',
            'media_filename' => 'image.png',
        ]);
        self::assertSame('query', $controller->value('media_type'));
        self::assertSame('image.png', $controller->value('media_filename'));
        self::assertSame('images', $controller->value('missing', 'images'));

        $controller->request->attributes->set('media_type', 'route');
        self::assertSame('route', $controller->value('media_type'));
    }
}

class MediaRequestController
{
    use HasMediaAsyncTrait;

    public $request;

    public function getRequest()
    {
        return $this->request;
    }

    public function setResponseValues($values)
    {
    }

    public function value($key, $default = null)
    {
        return $this->mediaRequestValue($key, $default);
    }
}
