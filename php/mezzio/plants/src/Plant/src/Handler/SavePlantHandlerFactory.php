<?php

declare(strict_types=1);

namespace Plant\Handler;

use Mezzio\Template\TemplateRendererInterface;
use Psr\Container\ContainerInterface;

class SavePlantHandlerFactory
{
    public function __invoke(ContainerInterface $container) : SavePlantHandler
    {
        return new SavePlantHandler($container->get(TemplateRendererInterface::class));
    }
}
