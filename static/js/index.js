$(function(){
var socket = io();

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

socket.on("update", function(msg){
  var html = "";

  for(var i of msg){
    var url      = i["url"];
    var progress = i["progress"];
    html += `<tr><td>${url}</td><td>${progress}</td></tr>`;
  }

  $("#download-queue").html(html);
});

socket.on("admin", function(msg){
  console.log(msg);
});

});
