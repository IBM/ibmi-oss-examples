<tr>
% for value in values:
	% if header:
		<th>{{value}}</th>
	% else:
		<td>{{value}}</td>
	% end
% end
</tr>