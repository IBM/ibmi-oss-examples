<?php

declare(strict_types=1);

namespace Rest\Doc;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\TextResponse;

class InvalidParameterHandler implements RequestHandlerInterface
{
    private const MESSAGE = <<< 'EOT'
Invalid Parameter

One or more parameters provided in the request are considered invalid by
the resource. Please check the various error messages to determine what
changes you may need to make in order to create a successful request.

EOT;

    /**
     * {@inheritDoc}
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        return new TextResponse(self::MESSAGE);
    }
}
