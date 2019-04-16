$('#no-worker').on('click', function (e) {
  $('.calcPrimes').hide();
  $('#loadme').show();
  $('#time').hide();
  $.ajax({
    url: '/primes/calc',
    type: 'GET',
    success: function (response) {
      if (response) {
        console.log(response);

        (typeof response.time === 'number')
          ? $('#time').html(`Time: ${response.time} s`)
          : $('#time').html(`Time: ${response.time} ns`);

        $('#time').show();
      } else {
        console.error(`Failed: ${response}`);
      }
      $('#loadme').hide();
      $('.calcPrimes').show();
      // setTimeout(location.reload(), 5000);
    },
    error: function (err) {
      console.error(`AJAX Failed: ${err.status}\n`);
      $('#loadme').hide();
      $('#errorAlert').html('<strong>Failed to calculate primes</strong>');
      $('#errorAlert').show();
      $('.calcPrimes').show();
    }
  });
});
