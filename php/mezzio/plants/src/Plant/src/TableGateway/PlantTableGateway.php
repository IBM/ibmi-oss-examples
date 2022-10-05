<?php

declare(strict_types=1);

/**
 * PlantTableGateway.php
 *
 * @author: Yeshua Hall <yeshua@sobo.red>
 * @date: 8/23/22
 */

namespace Plant\TableGateway;

use Exception;
use Laminas\Db\ResultSet\ResultSetInterface;
use Laminas\Db\TableGateway\TableGateway;
use Laminas\Paginator\Adapter\LaminasDb\DbSelect;
use Plant\Entity\PlantEntity;

class PlantTableGateway extends TableGateway
{
    const SAVE_EXCEPTION_PREFIX = 'Save Plant Error: ';

    // Ensure column names are lowercase
    protected $columns = [
        '"id"' => 'id',
        '"name"' => 'name',
        '"nickname"' => 'nickname',
        '"wiki"' => 'wiki',
    ];

    public function get(int $id) : ResultSetInterface
    {
        return $this->select(['id' => $id]);
    }

    public function getForPagination(string $orderBy = '', string $order = '') : DbSelect
    {
        $select = $this->getSql()->select();
        $select->columns($this->columns);
        $select->order("{$orderBy} {$order}");

        return new DbSelect($select, $this->getSql(), $this->getResultSetPrototype());
    }

    /**
     * @throws Exception
     */
    public function save(PlantEntity $plant) : int
    {
        $id = $plant->id;
        $data = $plant->getArrayCopy();

        if (empty($id)) {
            unset($data['id']);

            try {
                $this->insert($data);
            } catch (Exception $e) {
                throw new Exception(self::SAVE_EXCEPTION_PREFIX . $e->getMessage());
            }

            return (int) $this->getLastInsertValue();
        }

        if (! $this->get($id)->current() instanceof PlantEntity) {
            $message = self::SAVE_EXCEPTION_PREFIX . "Cannot update plant with identifier $id; does not exist";
            throw new Exception($message);
        }

        try {
            $this->update($data, ['id' => $id]);
        } catch (Exception $e) {
            throw new Exception(self::SAVE_EXCEPTION_PREFIX . $e->getMessage());
        }

        return $id;
    }
}
