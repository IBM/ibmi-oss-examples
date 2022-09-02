<?php

declare(strict_types=1);

/**
 * PlantEntity.php
 *
 * @author: Yeshua Hall <yeshua@sobo.red>
 * @date: 8/23/22
 */

namespace Plant\Entity;

class PlantEntity
{
    public $id;
    public $name;
    public $nickname;
    public $wiki;

    public function getArrayCopy() : array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'nickname' => $this->nickname,
            'wiki' => $this->wiki,
        ];
    }

    public function exchangeArray(array $plant) : void
    {
        $this->id = $plant['id'] ?? 0;
        $this->name = $plant['name'];
        $this->nickname = $plant['nickname'] ?? '';
        $this->wiki = $plant['wiki'] ?? '';
    }
}
