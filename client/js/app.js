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