<?php

declare(strict_types=1);

namespace Plant\Handler;

use Mezzio\Hal\HalResponseFactory;
use Mezzio\Hal\ResourceGenerator;
use Plant\Collection\PlantCollection;
use Plant\TableGateway\PlantTableGateway;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use SoBoRed\Mezzio\Rest\RestDispatchTrait;

class ListPlantsHandler implements RequestHandlerInterface
{
    /**
     * @var PlantTableGateway
     */
    private $plantTable;

    use RestDispatchTrait;

    public function __construct(
        PlantTableGateway $plantTable,
        ResourceGenerator $resourceGenerator,
        HalResponseFactory $responseFactory
    )
    {
        $this->plantTable = $plantTable;
        $this->resourceGenerator = $resourceGenerator;
        $this->responseFactory = $responseFactory;
    }

    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $page = $request->getQueryParams()['page'] ?? 1;
        $perPage = $request->getQueryParams()['perPage'] ?? 25;
        $all = isset($request->getQueryParams()['all']);
        $orderBy = $request->getQueryParams()['orderBy'] ?? 'name';
        $order = $request->getQueryParams()['order'] ?? 'ASC';
        $plantsSelect = $this->plantTable->getForPagination($orderBy, $order);

        $plants = new PlantCollection($plantsSelect);
        $plants->setItemCountPerPage($all ? $plants->getTotalItemCount() : $perPage);
        $plants->setCurrentPageNumber($page);

        return $this->createResponse($request, $plants);
    }
}
