<?php

namespace ByTIC\MediaLibraryModule;

use Nip\Container\ServiceProviders\Providers\AbstractSignatureServiceProvider;
use Nip\Container\ServiceProviders\Providers\BootableServiceProviderInterface;

/**
 * Class MediaLibraryModuleServiceProvider.
 */
class MediaLibraryModuleServiceProvider extends AbstractSignatureServiceProvider implements BootableServiceProviderInterface
{
    /**
     * {@inheritdoc}
     */
    public function provides()
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function register()
    {
    }

    public function boot()
    {
        $this->getContainer()->get('migrations.migrator')->path(dirname(__DIR__).'/migrations/');
    }

    protected function registerResources()
    {
        $folder = __DIR__.'/resources/lang/';
        $languages = $this->getContainer()->get('translation.languages');

        $translator = $this->getContainer()->get('translator');

        foreach ($languages as $language) {
            $path = $folder.$language;
            if (is_dir($path)) {
                $translator->addResource('php', $path, $language);
            }
        }
    }
}
