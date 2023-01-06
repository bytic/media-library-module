<?php
declare(strict_types=1);

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
        $this->registerResources();
    }

    protected function registerResources()
    {
        $folder = dirname(__DIR__) . '/resources/lang/';
        $languages = $this->getContainer()->get('translation.languages');

        $translator = $this->getContainer()->get('translator');

        foreach ($languages as $language) {
            $path = $folder . $language;
            if (is_dir($path)) {
                $translator->addResource('php', $path, $language);
            }
        }
    }
}
