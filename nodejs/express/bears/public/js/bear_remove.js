/* eslint-disable no-undef */
$(document).ready(() => {
  // bear remove
  const id = $.urlParam('id');
  $.delete(`/zoo/api/bears/${id}`, (response) => {
    $('.bear_id').text(`(${id})`);
    $('.bear_message').text(response.message);
  }).error((error) => {
    alert(JSON.stringify(error.responseJSON.message));
  });
});
