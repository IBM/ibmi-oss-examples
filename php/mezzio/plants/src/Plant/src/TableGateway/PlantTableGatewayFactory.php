<?php

declare(strict_types=1);

/**
 * PlantTableGatewayFactory.php
 *
 * @author: Yeshua Hall <yeshua@sobo.red>
 * @date: 8/23/22
 */

namespace Plant\TableGateway;

use Laminas\Db\Adapter\AdapterInterface;
use Laminas\Db\ResultSet\HydratingResultSet;
use Laminas\Hydrator\ArraySerializableHydrator;
use Plant\Entity\PlantEntity;
use Psr\Container\ContainerInterface;

class PlantTableGatewayFactory
{
    public function __invoke(ContainerInterface $container) : PlantTableGateway
    {
        return new PlantTableGateway(
            'plants',
            $container->get(AdapterInterface::class),
            null,
            $this->getResultSetPrototype($container)
        );
    }

    private function getResultSetPrototype(ContainerInterface $container) : HydratingResultSet
    {
        $hydrators = $container->get('HydratorManager');
        $hydrator = $hydrators->get(ArraySerializableHydrator::class);
        return new HydratingResultSet($hydrator, new PlantEntity());
    }
}
