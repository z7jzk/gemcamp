var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');
var socket = io();

socket.on('connect', function () {
    console.log('Connected to socket.io server!');
});

socket.on('message', function (message) {
    if (!message.name) {
        message.name = name;
    }
    var momentTimestamp = moment().utcOffset("-05:00");
    var $message = $('.messages');
    console.log('New message:');
    console.log(message.text);
    
    $message.append('<span style="display: block; padding: 10px 0;"><i><strong>' + message.name + ':&nbsp;&nbsp;' + '</i></strong>' + '<i><small><strong>' + momentTimestamp.format('h:mm a') + '</strong></small></i>' + '&nbsp;&nbsp;&nbsp;&nbsp;' + '<p style="display: inline;">' + message.text + '</p>' + '</span>');
});

// Handles submitting of new message
var $form = $('#message-form');

$form.on('submit', function (event) {
    event.preventDefault();
    
    var $message = $form.find('input[name=message]');
    
    socket.emit('message', {
        text: $message.val()
    });
    
    $message.val('');
});

var $name = $('#name-form');

$name.on('submit', function (event) {
    event.preventDefault();
    
    var $user_name = $('#name').val();
    
    // $('#name-modal').modal('hide');
    
    if ($user_name == '') {
        window.alert('Name cannot be blank! Please put in your full name!');
    } else {
        send_name_server($user_name);
    }
    
    //$('#name-modal').modal('hide');
    
});

function send_name_server (user_name) {
    var send_name = $.ajax({
      type: 'post',
      url: "/update_namevar",
      remote: true,
      data: {name: user_name},
      dataType: 'json'
    }).done(function( data ) {
        //console.log(data);
        //$('#name-modal').modal('hide');
    }).fail(function (jqXHR, textStatus) {
        $('#name-modal').modal('hide');
        location.reload();
    });
}