<?php

declare(strict_types=1);

namespace App\Model;

use Exception;

class ActiveJobModel
{
    public $table = 'table(qsys2.active_job_info(RESET_STATISTICS => ?))';
    public $columns = [
        'JOB_NAME', 'AUTHORIZATION_NAME', 'JOB_TYPE', 'FUNCTION_TYPE',
        'FUNCTION', 'JOB_STATUS', 'ELAPSED_INTERACTION_COUNT',
        'ELAPSED_TOTAL_RESPONSE_TIME', 'ELAPSED_TOTAL_DISK_IO_COUNT',
        'ELAPSED_ASYNC_DISK_IO_COUNT', 'ELAPSED_SYNC_DISK_IO_COUNT',
        'ELAPSED_CPU_PERCENTAGE', 'ELAPSED_PAGE_FAULT_COUNT'
    ];
    private $conn;

    public function __construct($db2Conn)
    {
        $this->conn = $db2Conn;
    }

    /**
     * @throws Exception
     */
    public function getAll() : array
    {
        $result = [];
        $select = sprintf(
            'select %s from %s',
            implode(', ', $this->columns),
            $this->table
        );
        $stmt = db2_prepare($this->conn, $select);

        if (empty($stmt)) {
            $error = db2_stmt_error();
            $errorMessage = db2_stmt_errormsg();
            throw new Exception("Issue while preparing statement: {$error} - {$errorMessage}");
        }

        db2_execute($stmt, ['NO']);

        while ($row = db2_fetch_assoc($stmt)) {
            $result[] = $row;
        }

        return $result;
    }
}
