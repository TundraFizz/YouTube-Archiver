$(function(){
var socket = io();

// setInterval(function(){
//   socket.emit("get-volume");
// }, 1000);

socket.on("progress", function(msg){
  console.log(msg);
  $("#progress").text(msg);
});

socket.on("complete", function(msg){
});

$("#submit").click(function(){
  var url = $("#url").val();
  socket.emit("archive", {"url": url});
});

});
