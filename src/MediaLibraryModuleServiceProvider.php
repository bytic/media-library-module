<?php
declare(strict_types=1);

namespace ByTIC\MediaLibraryModule;

use ByTIC\PackageBase\BaseBootableServiceProvider;
use Nip\Container\ServiceProviders\Providers\BootableServiceProviderInterface;

/**
 * Class MediaLibraryModuleServiceProvider.
 */
class MediaLibraryModuleServiceProvider extends BaseBootableServiceProvider implements BootableServiceProviderInterface
{

    protected function translationsPath(): string
    {
        return dirname(__DIR__) . '/resources/lang/';
    }

    public function provides(): array
    {
        return [];
    }

    public function register()
    {
    }
}
