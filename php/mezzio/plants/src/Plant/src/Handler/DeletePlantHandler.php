<?php

declare(strict_types=1);

namespace Plant\Handler;

use Laminas\Diactoros\Response\EmptyResponse;
use Plant\Entity\PlantEntity;
use Plant\TableGateway\PlantTableGateway;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use SoBoRed\Mezzio\Rest\Exception\NoResourceFoundException;

class DeletePlantHandler implements RequestHandlerInterface
{
    /**
     * @var PlantTableGateway
     */
    private $plantTable;

    public function __construct(PlantTableGateway $plantModel)
    {
        $this->plantTable = $plantModel;
    }

    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $id = $request->getAttribute('id', false);
        $plant = $this->plantTable->get((int)$id)->current();

        if (! $plant instanceof PlantEntity) {
            throw NoResourceFoundException::create("Plant with id `{$id}` not found");
        }

        $this->plantTable->delete(['id' => $id]);

        return new EmptyResponse(204);
    }
}
