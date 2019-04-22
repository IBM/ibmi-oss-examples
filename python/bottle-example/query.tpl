<html>
<head>
<style>
table, th, td
{
    border: 1px solid black;
    border-collapse: collapse;
}

th, td
{
    padding: 5px;
    text-align: left;
    width: 200px;
}

tr:nth-child(even)
{
    background-color: #f3f3f3;
}

tr:nth-child(odd)
{
    background-color:#fff;
}

th
{
    background-color: #008ABF;
    color: white
}
</style>
<head>
<body>
<table>
% include('row', values=headers, header=True)
% for row in rows:
	% include('row', values=row, header=False)
% end
</table>
</body>
</html>
