<?php

declare(strict_types=1);

namespace Plant\Handler;

use Mezzio\Template\TemplateRendererInterface;
use Psr\Container\ContainerInterface;

class ListPlantsHandlerFactory
{
    public function __invoke(ContainerInterface $container) : ListPlantsHandler
    {
        return new ListPlantsHandler($container->get(TemplateRendererInterface::class));
    }
}
