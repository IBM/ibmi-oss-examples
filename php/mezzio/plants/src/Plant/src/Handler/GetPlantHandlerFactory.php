<?php

declare(strict_types=1);

namespace Plant\Handler;

use Mezzio\Template\TemplateRendererInterface;
use Psr\Container\ContainerInterface;

class GetPlantHandlerFactory
{
    public function __invoke(ContainerInterface $container) : GetPlantHandler
    {
        return new GetPlantHandler($container->get(TemplateRendererInterface::class));
    }
}
