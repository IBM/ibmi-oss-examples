<?php

declare(strict_types=1);

namespace Plant\Handler;

use Plant\TableGateway\PlantTableGateway;
use Psr\Container\ContainerInterface;

class DeletePlantHandlerFactory
{
    public function __invoke(ContainerInterface $container) : DeletePlantHandler
    {
        return new DeletePlantHandler($container->get(PlantTableGateway::class));
    }
}
