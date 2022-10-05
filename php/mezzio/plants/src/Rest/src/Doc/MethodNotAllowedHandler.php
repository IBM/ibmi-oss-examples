<?php

declare(strict_types=1);

namespace Rest\Doc;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\TextResponse;

class MethodNotAllowedHandler implements RequestHandlerInterface
{
    private const MESSAGE = <<< 'EOT'
Method Not Allowed

The HTTP method you used to access the resource is either not allowed,
or has not been implemented at this time. Check the Allow header to determine
what methods are allowed when requesting this resource.

EOT;

    /**
     * {@inheritDoc}
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        return new TextResponse(self::MESSAGE);
    }
}
