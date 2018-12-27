$(function(){
var socket = io();

setInterval(function(){
  socket.emit("admin");
}, 1000);

socket.on("admin", function(msg){
  console.log(msg);
  $("#admin").text(JSON.stringify(msg, null, 2));
});

});
