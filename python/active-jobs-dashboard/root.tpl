<html>
<head><title>Active Job Dashboard</title>
<script src="https://code.jquery.com/jquery-3.2.0.min.js" integrity="sha256-JAW99MJVpJBGcbzEuXk4Az05s/XyDdBomFqNlM3ic+I=" crossorigin="anonymous"></script>
<script type="text/javascript" src="tablesorter/jquery.tablesorter.min.js"></script>

<script>
function submit(reset) {
    var sorting = $("#job_info_table").data().tablesorter.sortList;
    $("#sorting").val(JSON.stringify(sorting));
    $('#reset').val(reset);
    $('#action_form').submit();
}
function refresh() { submit(false); }
function reset() { submit(true); }
$(document).ready(function() { 
    var table = $("#job_info_table");
    var sorting = $("#sorting").val();
    table.tablesorter({ sortList: JSON.parse(sorting) });
});
</script>
<link rel="stylesheet" href="tablesorter/style.css">
<style>
#header {
    width: 600px;
}

#actions { float: right; }

#actions button { display: inline; }

table.tablesorter thead tr th{
  padding-right: 20px;
}

</style>

</head>
<body>
<div id='content'>
<div id='header'>
Elapsed time: {{elapsed_time}} seconds
<span id='actions'>
  <form id='action_form' action='/' method='POST'>
    <input type='hidden' id='sorting' name='sorting' value='{{sorting}}' />
    <input type='hidden' id='reset' name='reset' value='false' />
  </form>
  <button type='submit' onclick='refresh()'>Refresh</button>
  <button type='submit' onclick='reset()'>Reset</button>
</span>
</div>
</div>

<table width="750px" id="job_info_table" class="tablesorter">
<thead>
% include('row', values=headers, header=True)
</thead>
<tbody>
% for row in rows:
    % include('row', values=row, header=False)
% end
</tbody>
</table>
</body>
</html>
