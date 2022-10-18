<?php

declare(strict_types=1);

namespace Plant\Handler;

use Mezzio\Hal\HalResponseFactory;
use Mezzio\Hal\ResourceGenerator;
use Plant\Entity\PlantEntity;
use Plant\TableGateway\PlantTableGateway;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use SoBoRed\Mezzio\Rest\Exception\NoResourceFoundException;
use SoBoRed\Mezzio\Rest\RestDispatchTrait;

class GetPlantHandler implements RequestHandlerInterface
{
    /**
     * @var PlantTableGateway
     */
    private $plantTable;

    use RestDispatchTrait;

    public function __construct(
        PlantTableGateway $plantModel,
        ResourceGenerator $resourceGenerator,
        HalResponseFactory $responseFactory
    )
    {
        $this->plantTable = $plantModel;
        $this->resourceGenerator = $resourceGenerator;
        $this->responseFactory = $responseFactory;
    }

    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $id = $request->getAttribute('id', false);
        $plant = $this->plantTable->get((int)$id)->current();

        if (! $plant instanceof PlantEntity) {
            throw NoResourceFoundException::create("Plant with id `{$id}` not found");
        }

        return $this->createResponse($request, $plant);
    }
}
