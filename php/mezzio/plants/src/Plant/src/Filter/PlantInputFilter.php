<?php

declare(strict_types=1);

namespace Plant\Filter;

use Laminas\Filter\StringTrim;
use Laminas\Filter\ToInt;
use Laminas\InputFilter\InputFilter;
use Laminas\Validator\Digits;

class PlantInputFilter extends InputFilter
{
    public function init()
    {
        $this->add([
            'name' => 'id',
            'allow_empty' => true,
            'fallback_value' => 0,
            'filters' => [
                [
                    'name' => ToInt::class,
                ],
            ],
            'validators' => [
                [
                    'name' => Digits::class,
                ],
            ],
        ]);
        $this->add([
            'name' => 'name',
            'required' => true,
            'filters' => [
                [
                    'name' => StringTrim::class,
                ],
            ],
            'description' => 'Scientific name of plant',
            'allow_empty' => false,
            'continue_if_empty' => false,
        ]);
        $this->add([
            'name' => 'wiki',
            'required' => true,
            'filters' => [
                [
                    'name' => StringTrim::class,
                ],
            ],
            'description' => 'URL to wikipedia article of plant',
            'allow_empty' => false,
            'continue_if_empty' => false,
        ]);
        $this->add([
            'name' => 'nickname',
            'allow_empty' => true,
            'fallback_value' => '',
            'filters' => [
                [
                    'name' => StringTrim::class,
                ],
            ],
            'description' => 'Nickname of plant',
        ]);
    }
}