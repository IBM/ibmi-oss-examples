% if header:
	<tr class="tablesorter-headerRow">
% else:
	<tr>
% end
% for value in values:
	% if header:
		<th>{{value}}</th>
	% else:
		<td>{{value}}</td>
	% end
% end
</tr>