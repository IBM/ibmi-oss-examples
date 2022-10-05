<?php

declare(strict_types=1);

namespace Rest\Doc;

use Psr\Container\ContainerInterface;

class InvalidParameterHandlerFactory
{
    public function __invoke(ContainerInterface $container) : InvalidParameterHandler
    {
        return new InvalidParameterHandler();
    }
}
