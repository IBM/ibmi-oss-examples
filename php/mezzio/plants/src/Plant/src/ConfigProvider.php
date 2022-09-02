<?php

declare(strict_types=1);

namespace Plant;

use Laminas\Hydrator\ObjectPropertyHydrator;
use Mezzio\Hal\Metadata\RouteBasedCollectionMetadata;
use Mezzio\Hal\Metadata\RouteBasedResourceMetadata;
use Plant\Collection\PlantCollection;
use Plant\Entity\PlantEntity;

/**
 * The configuration provider for the Plant module
 *
 * @see https://docs.laminas.dev/laminas-component-installer/
 */
class ConfigProvider
{
    /**
     * Returns the configuration array
     *
     * To add a bit of a structure, each section is defined in a separate
     * method which returns an array with its configuration.
     */
    public function __invoke() : array
    {
        return [
            'laminas-cli' => $this->getCliConfig(),
            'dependencies' => $this->getDependencies(),
            'templates'    => $this->getTemplates(),
        ];
    }

    public function getCliConfig() : array
    {
        return [
            'commands' => [
                'plant:setup-data' => Command\SetupDataCommand::class,
            ],
        ];
    }

    /**
     * Returns the container dependencies
     */
    public function getDependencies() : array
    {
        return [
            'invokables' => [
            ],
            'factories'  => [
                Command\SetupDataCommand::class => Command\SetupDataCommandFactory::class,

                TableGateway\PlantTableGateway::class => TableGateway\PlantTableGatewayFactory::class,

                Handler\GetPlantHandler::class => Handler\GetPlantHandlerFactory::class,
                Handler\ListPlantsHandler::class => Handler\ListPlantsHandlerFactory::class,
                Handler\SavePlantHandler::class => Handler\SavePlantHandlerFactory::class,
            ],
        ];
    }

    public function getHalConfig() : array
    {
        return [
            [
                '__class__' => RouteBasedResourceMetadata::class,
                'resource_class' => PlantEntity::class,
                'route' => 'api.plant',
                'extractor' => ObjectPropertyHydrator::class,
                'resource_identifier' => 'id',
            ],
            [
                '__class__' => RouteBasedCollectionMetadata::class,
                'collection_class' => PlantCollection::class,
                'collection_relation' => 'api.plant',
                'route' => 'api.plants',
            ],
        ];
    }

    /**
     * Returns the templates configuration
     */
    public function getTemplates() : array
    {
        return [
            'paths' => [
                'plant'    => [__DIR__ . '/../templates/'],
            ],
        ];
    }
}
