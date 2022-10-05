<?php

declare(strict_types=1);

namespace Rest;

use Mezzio\Hal\HalResponseFactory;
use Mezzio\Hal\ResourceGenerator;
use Mezzio\Hal\ResourceGenerator\Exception\OutOfBoundsException;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

trait RestDispatchTrait
{
    /**
     * @var ResourceGenerator
     */
    private $resourceGenerator;

    /**
     * @var HalResponseFactory
     */
    private $responseFactory;

    /**
     * Create a HAL response from the given $instance, based on the incoming $request.
     *
     * @param object $instance
     * @throws Exception\OutOfBoundsException if an `OutOfBoundsException` is
     *     thrown by the response factory and/or resource generator.
     */
    private function createResponse(ServerRequestInterface $request, object $instance): ResponseInterface
    {
        try {
            return $this->responseFactory->createResponse(
                $request,
                $this->resourceGenerator->fromObject($instance, $request)
            );
        } catch (OutOfBoundsException $e) {
            throw Exception\OutOfBoundsException::create($e->getMessage());
        }
    }
}