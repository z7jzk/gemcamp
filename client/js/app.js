//var requirejs = require('requirejs');
//var nameModule = requirejs('../server.js');
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
    
    $message.prepend('<span style="display: block; padding: 10px 0;"><i><strong>' + 
        message.name + ':&nbsp;&nbsp;' + '</i></strong>' + '<i><small><strong>' + 
        momentTimestamp.fromNow() + '</strong></small></i>' + '&nbsp;&nbsp;&nbsp;&nbsp;' + 
        '<p style="display: inline;">' + message.text + '</p>' + '</span>');
});

// Handles submitting of new message
var $form = $('#message-form');

$form.on('submit', function (event) {
    event.preventDefault();
    
    var momentTimestamp = moment().utcOffset("-05:00").fromNow();
    var $message = $form.find('input[name=message]');
    var $name = $form.find('input[name=name]');
    
    socket.emit('message', {
        text: $message.val(),
        name: $name.val(),
        time: momentTimestamp
    });
    
    //function sendChats() {
        //var momentTimestamp = moment().utcOffset("-05:00").format('h:mm a');
        //var message_text = $('#m').val();
        var send_name = $.ajax({
          type: 'post',
          url: "/wbitems",
          data: {name: $name.val(), mtext: $message.val()},
          dataType: 'json'
        }).done(function( data ) {
            
        }).fail(function (jqXHR, textStatus) {
            alert('Chat failed to post to database. Chat was not saved. Please try again.');
        });
      //}
    
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
    console.log({name: user_name});
    var send_name = $.ajax({
      type: 'post',
      url: "/update_namevar",
      data: {name: user_name}
    }).done(function( data ) {
        $('#name-modal').modal('hide');
        location.reload();
    }).fail(function (jqXHR, textStatus) {
        $('#name-modal').modal('hide');
        alert('Error: Server could not set name. Please reload and try again.');
    });
}