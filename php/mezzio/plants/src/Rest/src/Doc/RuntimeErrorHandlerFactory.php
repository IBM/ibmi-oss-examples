<?php

declare(strict_types=1);

namespace Rest\Doc;

use Psr\Container\ContainerInterface;

class RuntimeErrorHandlerFactory
{
    public function __invoke(ContainerInterface $container) : RuntimeErrorHandler
    {
        return new RuntimeErrorHandler();
    }
}
