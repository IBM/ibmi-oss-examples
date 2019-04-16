/* eslint-disable no-undef */
$('#search_str').keypress((e) => {
  if (e.which === 13) {
    $('form#search').submit();
    return false;
  }
});
