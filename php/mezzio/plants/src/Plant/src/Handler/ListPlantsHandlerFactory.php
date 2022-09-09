<?php

declare(strict_types=1);

namespace Plant\Handler;

use Mezzio\Hal\HalResponseFactory;
use Mezzio\Hal\ResourceGenerator;
use Plant\TableGateway\PlantTableGateway;
use Psr\Container\ContainerInterface;

class ListPlantsHandlerFactory
{
    public function __invoke(ContainerInterface $container) : ListPlantsHandler
    {
        return new ListPlantsHandler(
            $container->get(PlantTableGateway::class),
            $container->get(ResourceGenerator::class),
            $container->get(HalResponseFactory::class)
        );
    }
}
