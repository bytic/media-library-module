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

    protected function translationsPath(): string
    {
        return dirname(__DIR__) . '/resources/lang/';
    }

    public function boot()
    {
    }

    public function provides(): array
    {
        return [];
    }

    public function register()
    {
    }
}
