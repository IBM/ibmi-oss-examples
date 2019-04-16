/* eslint-disable no-undef */
$(document).ready(() => {
  // bear findById
  const id = $.urlParam('id');
  $.getJSON(`/zoo/api/bears/${id}`, (query) => {
    $('.bear_message').text(query.message);
    $.each(query.result, (i, bear) => {
      const optionBear = (`<li class="item">${bear.ID} - ${bear.NAME} <a href="/public/html/bear_gone.html?id=${bear.ID}">(remove)</a></li>`);
      $('.bear_list').append(optionBear);
    });
  }).error((query) => {
    alert(JSON.stringify(query.responseJSON.message));
  });
});
