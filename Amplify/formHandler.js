
$(document).ready(function() {

  // Handle form submission.
  $("#submit").click(function(e) {

    var nickname = $("#nickname").val(),
	 	 email = $("#email").val(),
     country = $("#country").countrySelect("getSelectedCountryData").name,
     countryIso = $("#country").countrySelect("getSelectedCountryData").iso2.toUpperCase(),
	   age = $("#age").val(),
     platform = $("#platform").val(),
     utcSeconds = Date.now() / 1000,
     timestamp = new Date(0)

    e.preventDefault();

    if (nickname.length < 5) {
      $('#form-response').html('<div class="mt-3 alert alert-info" role="alert">Your nickname is too short.</div>');
    } else if (email.length < 6) {
      $('#form-response').html('<div class="mt-3 alert alert-info" role="alert">Your email is incorrect. Please check the email that you supplied.</div>');
    } else {
      $('#submit').prop('disabled', true);
      $('#submit').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Send</button>');

      timestamp.setUTCSeconds(utcSeconds);

      var data = JSON.stringify({
        'nickname': nickname,
        'email': email,
        'country': country,
        'countryIso': countryIso,
        'countryLat': countryGPS[countryIso]['latitude'],
        'countryLng': countryGPS[countryIso]['longitude'],
		    'age': age,
		    'platform': platform,
        'source': "beta-form",
        'utcSeconds': utcSeconds,
        'simpleDate': timestamp.getMonth() + 1 + '-' + timestamp.getDate() + '-' + timestamp.getFullYear(),
        'optTimestamp': timestamp.toString()
      });

      $.ajax({
        type: 'POST',
        url: 'API_GW_URL',
        contentType: 'application/json',
        data: data,
        success: function(res) {
          $('#form-response').html('<div class="mt-3 alert alert-success" role="alert">' + res['Message'] + '</div>');
          $('#submit').prop('hidden', true);
          $('#unsubAll').prop('hidden', true);
          $('#submit').text('Ok');
        },
        error: function(jqxhr, status, exception) {
          $('#form-response').html('<div class="mt-3 alert alert-danger" role="alert">An error occurred. Please try again later.</div>');
          $('#submit').text('Ok');
          $('#submit').prop('disabled', false);
        }
      });
    }
  });
});