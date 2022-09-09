<?php

declare(strict_types=1);

namespace Plant\Handler;

use Mezzio\Hal\HalResponseFactory;
use Mezzio\Hal\ResourceGenerator;
use Plant\TableGateway\PlantTableGateway;
use Psr\Container\ContainerInterface;

class GetPlantHandlerFactory
{
    public function __invoke(ContainerInterface $container) : GetPlantHandler
    {
        return new GetPlantHandler(
            $container->get(PlantTableGateway::class),
            $container->get(ResourceGenerator::class),
            $container->get(HalResponseFactory::class)
        );
    }
}
