<?php

declare(strict_types=1);

namespace Rest;

/**
 * The configuration provider for the Rest module
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
            'dependencies' => $this->getDependencies(),
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
                Doc\InvalidParameterHandler::class => Doc\InvalidParameterHandlerFactory::class,
                Doc\MethodNotAllowedHandler::class => Doc\MethodNotAllowedHandlerFactory::class,
                Doc\OutOfBoundsHandler::class => Doc\OutOfBoundsHandlerFactory::class,
                Doc\ResourceNotFoundHandler::class => Doc\ResourceNotFoundHandlerFactory::class,
                Doc\RuntimeErrorHandler::class => Doc\RuntimeErrorHandlerFactory::class,
            ],
        ];
    }
}
