<?php

declare(strict_types=1);

namespace App\Handler;

use Mezzio\Template\TemplateRendererInterface;
use Psr\Container\ContainerInterface;

class PlantPageHandlerFactory
{
    public function __invoke(ContainerInterface $container) : PlantPageHandler
    {
        return new PlantPageHandler($container->get(TemplateRendererInterface::class));
    }
}
