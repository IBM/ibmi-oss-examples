/* eslint-disable no-undef */
$(document).ready(() => {
  $.getJSON('/zoo/api/bears', (query) => {
    $('.bear_message').text(query.message);
    $.each(query.result, (i, bear) => {
      const optionBear = `<li class="item"><a href="/public/html/bear_id.html?id=${bear.ID}">${bear.ID}</a>${bear.NAME}</li>`;
      $('.bear_list').append(optionBear);
    });
  }).error((query) => { alert(JSON.stringify(query.responseJSON.message)); }); // getJSON
});
