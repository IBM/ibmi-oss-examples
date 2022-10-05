<?php

declare(strict_types=1);

namespace Plant\Handler;

use Exception;
use Mezzio\Hal\HalResponseFactory;
use Mezzio\Hal\ResourceGenerator;
use Plant\Entity\PlantEntity;
use Plant\Filter\PlantInputFilter;
use Plant\TableGateway\PlantTableGateway;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\HtmlResponse;
use Rest\Exception\InvalidParameterException;
use Rest\Exception\RuntimeException;
use Rest\RestDispatchTrait;

class SavePlantHandler implements RequestHandlerInterface
{
    /**
     * @var PlantTableGateway
     */
    private $plantTable;

    /**
     * @var PlantInputFilter
     */
    private $plantFilter;

    use RestDispatchTrait;

    public function __construct(
        PlantTableGateway $plantTable,
        PlantInputFilter $plantFilter,
        ResourceGenerator $resourceGenerator,
        HalResponseFactory $responseFactory
    )
    {
        $this->plantTable = $plantTable;
        $this->plantFilter = $plantFilter;
        $this->resourceGenerator = $resourceGenerator;
        $this->responseFactory = $responseFactory;
    }

    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $body = $request->getParsedBody();
        $id = $request->getAttribute('id');
        $body['id'] = $body['id'] ?? $id;
        $this->plantFilter->setData($body);

        if (!$this->plantFilter->isValid()) {
            throw InvalidParameterException::create(
                'Invalid parameter',
                $this->plantFilter->getMessages()
            );
        }

        $status = empty($this->plantFilter->getValue('id')) ? 201 : 200;
        $plant = PlantEntity::createFromBody($this->plantFilter->getValues());

        try {
            $plantId = $this->plantTable->save($plant);
        } catch (Exception $e) {
            throw RuntimeException::create('An error occurred while saving plant data: ' . $e->getCode() . ' - ' . $e->getMessage());
        }

        return $this->createResponse($request, $this->plantTable->get($plantId)->current())
            ->withStatus($status);
    }
}
