/* eslint-disable no-undef */
$(document).ready(() => {
  // bear add
  $('.bear_add').click(() => {
    if ($('.bear_name').val()) {
      // [url, data, success]
      // https://api.jquery.com/jquery.post/
      $.post('/zoo/api/bears', { name: $('.bear_name').val() }, (response) => {
        $('.bear_message').text(response.message);
        $('.bear_name').val('');
        window.location.reload();
      }).error((query) => {
        alert(JSON.stringify(query.responseJSON.message));
      });
    }
  });
});
