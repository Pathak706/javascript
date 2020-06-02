// Make connection
var socket = io.connect('http://142.93.221.87:3000');

// Query DOM
var output = document.getElementById('output');

socket.on('message', function(data){
   console.log(data);
    output.innerHTML += '<p><strong>' + data.roundid + ': </strong>' + data.number + '</p>';
});

