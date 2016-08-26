var data_request = $.ajax({
  type: "GET",
  url: "/admin/restaurants",
  remote: true,
  data: {latitude: $('#latitude').val(), longitude: $('#longitude').val(), distance: realValues[$('#slideDistance').val()], search: 'true'},
  dataType: 'json'
});

data_request.done(function (response, textStatus, jqXHR){
   AdminLocationList(response);
});