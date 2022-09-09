<?php

declare(strict_types=1);

namespace Rest\Exception;

use DomainException;
use Mezzio\ProblemDetails\Exception\CommonProblemDetailsExceptionTrait;
use Mezzio\ProblemDetails\Exception\ProblemDetailsExceptionInterface;

class InvalidParameterException extends DomainException implements ProblemDetailsExceptionInterface
{
    use CommonProblemDetailsExceptionTrait;

    public static function create(string $message, array $additionalData = []) : self
    {
        $e = new self($message);
        $e->status = 400;
        $e->detail = $message;
        $e->type = '/api/doc/invalid-parameter';
        $e->title = 'Invalid parameter';
        $e->additional['parameters'] = $additionalData;
        return $e;
    }
}
