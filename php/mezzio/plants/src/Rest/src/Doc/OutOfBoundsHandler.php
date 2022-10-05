<?php

declare(strict_types=1);

namespace Rest\Doc;

use Laminas\Diactoros\Response\TextResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class OutOfBoundsHandler implements RequestHandlerInterface
{
    private const MESSAGE = <<< 'EOT'
Parameter Out Of Range

Usually, this indicates that the "page" specified in the request is
invalid. Consider fetching the first page of the collection to
determine how many pages are available, and what the last page
in the collection is.

EOT;

    /**
     * {@inheritDoc}
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        return new TextResponse(self::MESSAGE);
    }
}
