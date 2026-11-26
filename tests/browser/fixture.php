<?php

require __DIR__ . '/../../vendor/autoload.php';

class FixtureView
{
    public function load($path)
    {
        ob_start();
        include __DIR__ . '/../../src/resources/views' . $path . '.php';
        return ob_get_clean();
    }

    public function render()
    {
        $formAction = '/upload';
        $modalId = 'dropzone-modal-images';
        $type = 'images';
        $constraint = new \ByTIC\MediaLibrary\Validation\Constraints\ImageConstraint();
        $constraint->mimeTypes = ['image/png'];
        $constraint->minWidth = 100;
        $constraint->minHeight = 100;
        include __DIR__ . '/../../src/resources/views/dropzone/modal.php';
    }
}

(new FixtureView())->render();
