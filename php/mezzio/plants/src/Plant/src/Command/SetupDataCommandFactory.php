<?php

declare(strict_types=1);

/**
 * SetupDataCommandFactory.php
 *
 * @author: Yeshua Hall <yeshua@sobo.red>
 * @date: 8/23/22
 */

namespace Plant\Command;

use Plant\TableGateway\PlantTableGateway;
use Psr\Container\ContainerInterface;

class SetupDataCommandFactory
{
    public function __invoke(ContainerInterface $container) : SetupDataCommand
    {
        return new SetupDataCommand(
            $container->get(PlantTableGateway::class)
        );
    }
}
