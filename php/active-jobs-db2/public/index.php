<?php

declare(strict_types=1);

chdir(dirname(__DIR__));
require 'vendor/autoload.php';

use App\Connection\Db2Connection;
use App\Model\ActiveJobModel;

try {
    $db2Conn = new Db2Connection();
} catch (Exception $e) {
    echo $e->getMessage();
    die();
}

$activeJobModel = new ActiveJobModel($db2Conn->getConnection());

try {
    $activeJobs = $activeJobModel->getAll();
} catch (Exception $e) {
    echo $e->getMessage();
    die();
}

$db2Conn->close();
?>

<!doctype html>
<html class="no-js" lang="">

<head>
  <meta charset="utf-8">
  <title>PHP Example - Db2 Active Jobs</title>
  <meta name="description" content="An example of listing active jobs using Db2.">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- CSS only -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor"
        crossorigin="anonymous">
  <link href="https://cdn.datatables.net/v/bs5/dt-1.12.1/datatables.min.css"
        rel="stylesheet"
        type="text/css"/>
</head>

<body>
<nav class="navbar navbar-dark bg-black mb-3">
  <div class="container-fluid">
    <h1 class="navbar-brand">Db2 Active Jobs</h1>
  </div>
</nav>

<main class="container-fluid">
  <div id="LoadingActiveJobs" class="d-flex flex-row">
    <div class="spinner-border me-2" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <h2>Loading active jobs...</h2>
  </div>
  <table id="ActiveJobsTable" class="table table-striped visually-hidden">
    <thead>
    <tr>
      <th>Name</th>
      <th>Owner</th>
      <th>Type</th>
      <th>Function Type</th>
      <th>Function</th>
      <th>Status</th>
      <th>Interaction Count</th>
      <th>Total Response Time</th>
      <th>Disk I/O Count</th>
      <th>Async Disk I/O Count</th>
      <th>Sync Disk I/O Count</th>
      <th>CPU Percentage</th>
      <th>Page Fault Count</th>
    </tr>
    </thead>
    <tbody>
    <?php foreach ($activeJobs as $activeJob): ?>
      <tr>
        <td><?= $activeJob['JOB_NAME'] ?></td>
        <td><?= $activeJob['AUTHORIZATION_NAME'] ?></td>
        <td><?= $activeJob['JOB_TYPE'] ?></td>
        <td><?= $activeJob['FUNCTION_TYPE'] ?></td>
        <td><?= $activeJob['FUNCTION'] ?></td>
        <td><?= $activeJob['JOB_STATUS'] ?></td>
        <td><?= $activeJob['ELAPSED_INTERACTION_COUNT'] ?></td>
        <td><?= $activeJob['ELAPSED_TOTAL_RESPONSE_TIME'] ?></td>
        <td><?= $activeJob['ELAPSED_TOTAL_DISK_IO_COUNT'] ?></td>
        <td><?= $activeJob['ELAPSED_ASYNC_DISK_IO_COUNT'] ?></td>
        <td><?= $activeJob['ELAPSED_SYNC_DISK_IO_COUNT'] ?></td>
        <td><?= $activeJob['ELAPSED_CPU_PERCENTAGE'] ?></td>
        <td><?= $activeJob['ELAPSED_PAGE_FAULT_COUNT'] ?></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</main>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
        crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2"
        crossorigin="anonymous"></script>
<script src="https://cdn.datatables.net/v/bs5/dt-1.12.1/datatables.min.js"
        type="text/javascript"></script>

<script>
  $(document).ready(() => {
    const activeJobsTable = $('#ActiveJobsTable');

    activeJobsTable.on('draw.dt', () => {
      $('#LoadingActiveJobs').addClass('visually-hidden');
      activeJobsTable.removeClass('visually-hidden');
    });

    activeJobsTable.DataTable();
  });
</script>
</body>

</html>
