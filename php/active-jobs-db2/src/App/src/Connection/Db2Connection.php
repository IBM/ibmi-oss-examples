<?php

declare(strict_types=1);

namespace App\Connection;

use Exception;

class Db2Connection
{
    private $conn;
    private $db2Conf;

    /**
     * @throws Exception
     */
    public function __construct()
    {
        $this->db2Conf = include __DIR__ . '/../../../../config/db2.local.php';
        $this->conn = db2_pconnect(
            $this->db2Conf['db']['database'],
            $this->db2Conf['db']['username'],
            $this->db2Conf['db']['password'],
            $this->db2Conf['db']['platform_options'] ?? []
        );

        if (empty($this->conn)) {
            $error = db2_conn_error();
            $errorMessage = db2_conn_errormsg();
            throw new Exception("Issue while trying to connect: {$error} - {$errorMessage}");
        }
    }

    public function getConnection()
    {
        return $this->conn;
    }

    public function close() : void
    {
        db2_close($this->conn);
    }
}
