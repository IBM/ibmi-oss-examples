<?php

declare(strict_types=1);

namespace Plant\Handler;

use Laminas\InputFilter\InputFilterPluginManager;
use Mezzio\Hal\HalResponseFactory;
use Mezzio\Hal\ResourceGenerator;
use Plant\Filter\PlantInputFilter;
use Plant\TableGateway\PlantTableGateway;
use Psr\Container\ContainerInterface;

class SavePlantHandlerFactory
{
    public function __invoke(ContainerInterface $container) : SavePlantHandler
    {
        $filters = $container->get(InputFilterPluginManager::class);
        return new SavePlantHandler(
            $container->get(PlantTableGateway::class),
            $filters->get(PlantInputFilter::class),
            $container->get(ResourceGenerator::class),
            $container->get(HalResponseFactory::class)
        );
    }
}
